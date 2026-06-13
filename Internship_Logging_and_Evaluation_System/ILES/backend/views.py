from django.shortcuts import render
from django.utils import timezone
from django.contrib.auth import logout
from django.db.models import Count
from rest_framework import viewsets, generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import CustomUser, InternshipPlacement, WeeklyLog, Evaluation, EvaluationCriteria, ReviewComment
from .permissions import IsStudent, IsInternAdmin, IsWorkplaceSupervisor, IsAcademicSupervisor
from .serializers import (
    RegisterSerializer,
    InternshipPlacementSerializer,
    WeeklyLogSerializer,
    EvaluationSerializer,
    EvaluationCriteriaSerializer,
    CustomTokenObtainPairSerializer,
    ReviewCommentSerializer,
    UserSummarySerializer
)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': {
                'username': user.username,
                'email': user.email,
                'role': user.role,
            },
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    user = request.user
    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'role': user.role,
    })


@api_view(['POST'])
def logout_view(request):
    logout(request)
    return Response({'message': 'Logged out successfully.'}, status=status.HTTP_200_OK)


class InternshipPlacementViewset(viewsets.ModelViewSet):
    queryset = InternshipPlacement.objects.all()
    serializer_class = InternshipPlacementSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsInternAdmin()]
        return [IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'intern_admin':
            return InternshipPlacement.objects.all()
        elif user.role == 'student':
            return InternshipPlacement.objects.filter(student=user)
        elif user.role == 'workplace_supervisor':
            return InternshipPlacement.objects.filter(workplace_supervisor=user)
        return InternshipPlacement.objects.none()


class WeeklyLogViewset(viewsets.ModelViewSet):
    queryset = WeeklyLog.objects.all()
    serializer_class = WeeklyLogSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'submit', 'recall']:
            return [IsStudent()]
        elif self.action in ['approve', 'reject']:
            return [IsWorkplaceSupervisor()]
        elif self.action in ['review']:
            return [IsAcademicSupervisor()]
        elif self.action in ['list', 'retrieve', 'history']:
            return [IsAuthenticated()]
        return [IsInternAdmin()]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'student':
            return WeeklyLog.objects.filter(placement__student=user)
        elif user.role == 'workplace_supervisor':
            return WeeklyLog.objects.filter(placement__workplace_supervisor=user)
        elif user.role == 'academic_supervisor':
            return WeeklyLog.objects.all()
        elif user.role == 'intern_admin':
            return WeeklyLog.objects.all()
        return WeeklyLog.objects.none()

    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        weekly_log = self.get_object()
        if weekly_log.status != 'draft':
            return Response(
                {'error': 'Only draft logs can be submitted.'},
                status=status.HTTP_400_BAD_REQUEST)
        
        if weekly_log.deadline and timezone.now().date() > weekly_log.deadline:
            return Response(
                {'error': 'Submission deadline has passed.'},
                status=status.HTTP_400_BAD_REQUEST)

        if weekly_log.deadline and timezone.now().date() > weekly_log.deadline:
            return Response(
                {'error': f'Submission deadline has passed. Deadline was {weekly_log.deadline}.'},
                status=status.HTTP_400_BAD_REQUEST)

        weekly_log.status = 'submitted'
        weekly_log.submitted_at = timezone.now()
        weekly_log.save()
        return Response(
            {'message': f'Weekly log {weekly_log.week_number} submitted successfully.'},
            status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def recall(self, request, pk=None):
        weekly_log = self.get_object()

        if weekly_log.status != 'submitted':
            return Response(
                {'error': 'Only submitted logs can be recalled.'},
                status=status.HTTP_400_BAD_REQUEST)

        if weekly_log.placement.student != request.user:
            return Response(
                {'error': 'You can only recall your own submitted logs.'},
                status=status.HTTP_403_FORBIDDEN)

        weekly_log.status = 'draft'
        weekly_log.submitted_at = None
        weekly_log.save()
        return Response({'message': f'Weekly log {weekly_log.week_number} recalled successfully.'},
                        status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        log = self.get_object()

        if log.status not in ['submitted', 'reviewed']:
            return Response(
                {'error': 'Only submitted or reviewed logs can be approved.'},
                status=status.HTTP_400_BAD_REQUEST)

        comment_text = request.data.get('comment', '')
        log.status = 'approved'
        log.save()

        ReviewComment.objects.create(
            log=log,
            reviewer=request.user,
            comment=comment_text,
            action='approved'
        )
        return Response({'message': f'Week {log.week_number} log approved.'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        log = self.get_object()

        if log.status not in ['submitted', 'reviewed']:
            return Response(
                {'error': 'Only submitted or reviewed logs can be rejected.'},
                status=status.HTTP_400_BAD_REQUEST)

        comment_text = request.data.get('comment', '')
        if not comment_text:
            return Response(
                {'error': 'A comment is required when rejecting a log.'},
                status=status.HTTP_400_BAD_REQUEST)

        log.status = 'draft'
        log.submitted_at = None
        log.save()

        ReviewComment.objects.create(
            log=log,
            reviewer=request.user,
            comment=comment_text,
            action='rejected'
        )
        return Response({'message': f'Week {log.week_number} log rejected and returned to student.'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'])
    def history(self, request, pk=None):
        log = self.get_object()
        comments = ReviewComment.objects.filter(log=log).order_by('created_at')
        serializer = ReviewCommentSerializer(comments, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def review(self, request, pk=None):
        log = self.get_object()

        if log.status != 'submitted':
            return Response(
                {'error': 'Only submitted logs can be marked as reviewed.'},
                status=status.HTTP_400_BAD_REQUEST)

        comment_text = request.data.get('comment', '')
        log.status = 'reviewed'
        log.save()

        ReviewComment.objects.create(
            log=log,
            reviewer=request.user,
            comment=comment_text,
            action='reviewed'
        )
        return Response({'message': f'Week {log.week_number} log marked as reviewed.'}, status=status.HTTP_200_OK)


class EvaluationViewset(viewsets.ModelViewSet):
    queryset = Evaluation.objects.all()
    serializer_class = EvaluationSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAcademicSupervisor()]
        return [IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['academic_supervisor', 'intern_admin']:
            return Evaluation.objects.all()
        elif user.role == 'student':
            return Evaluation.objects.filter(placement__student=user)
        elif user.role == 'workplace_supervisor':
            return Evaluation.objects.filter(placement__workplace_supervisor=user)
        return Evaluation.objects.none()

    def perform_create(self, serializer):
        serializer.save(evaluated_by=self.request.user)


class EvaluationCriteriaViewset(viewsets.ModelViewSet):
    queryset = EvaluationCriteria.objects.all()
    serializer_class = EvaluationCriteriaSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAcademicSupervisor()]
        return [IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user

        if user.role in ['academic_supervisor', 'intern_admin']:
            return EvaluationCriteria.objects.all()

        return EvaluationCriteria.objects.none()

    def create(self, request, *args, **kwargs):
        log_id = request.data.get('log')
        existing = EvaluationCriteria.objects.filter(log_id=log_id).first()

        if existing:
            serializer = self.get_serializer(
                existing, data=request.data, partial=False)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return super().create(request, *args, **kwargs)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_summary(request):
    user = request.user

    if user.role == 'intern_admin':
        logs_by_status = (
            WeeklyLog.objects
            .values('status')
            .annotate(count=Count('id'))
        )

        return Response({
            'total_students': CustomUser.objects.filter(role='student').count(),
            'total_placements': InternshipPlacement.objects.count(),
            'total_logs': WeeklyLog.objects.count(),
            'logs_by_status': list(logs_by_status),
        })

    elif user.role == 'academic_supervisor':
        logs_by_status = (
            WeeklyLog.objects
            .values('status')
            .annotate(count=Count('id'))
        )

        return Response({
            'total_logs': WeeklyLog.objects.count(),
            'logs_by_status': list(logs_by_status),
        })

    elif user.role == 'workplace_supervisor':
        logs = WeeklyLog.objects.filter(placement__workplace_supervisor=user)

        logs_by_status = (
            logs.values('status')
            .annotate(count=Count('id'))
        )

        return Response({
            'total_logs': logs.count(),
            'logs_by_status': list(logs_by_status),
        })

    elif user.role == 'student':
        logs = WeeklyLog.objects.filter(placement__student=user)

        logs_by_status = (
            logs.values('status')
            .annotate(count=Count('id'))
        )

        evaluation = Evaluation.objects.filter(placement__student=user).first()

        return Response({
            'total_logs': logs.count(),
            'logs_by_status': list(logs_by_status),
            'score': str(evaluation.score) if evaluation else None,
            'grade': evaluation.grade if evaluation else None,
        })

    return Response({'error': 'Unknown role.'}, status=status.HTTP_400_BAD_REQUEST)


class UserListView(generics.ListAPIView):
    serializer_class = UserSummarySerializer
    permission_classes = [IsInternAdmin]

    def get_queryset(self):
        role = self.request.query_params.get('role')
        qs = CustomUser.objects.all().order_by('username')
        if role:
            qs = qs.filter(role=role)
        return qs
