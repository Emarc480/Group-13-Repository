from django.shortcuts import render
from django.utils import timezone
from rest_framework import viewsets, generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CustomUser, InternshipPlacement, WeeklyLog, Evaluation, EvaluationCriteria
from .permissions import IsStudent, IsInternAdmin, IsWorkplaceSupervisor, IsAcademicSupervisor
from .serializers import (
    RegisterSerializer,
    InternshipPlacementSerializer,
    WeeklyLogSerializer,
    EvaluationSerializer,
    EvaluationCriteriaSerializer,
    CustomTokenObtainPairSerializer
)
from rest_framework_simplejwt.views import TokenObtainPairView

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

class InternshipPlacementViewset(viewsets.ModelViewSet):
    queryset = InternshipPlacement.objects.all()
    serializer_class = InternshipPlacementSerializer
    permission_classes = [IsAuthenticated, IsInternAdmin]

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
        elif self.action in ['list', 'retrieve']:
            return [IsAuthenticated()]
        return [IsInternAdmin()]
        
    def get_queryset(self):
        user = self.request.user
        if user.role == 'student':
            return WeeklyLog.objects.filter(placement__student=user)
        elif user.role in ['workplace_supervisor', 'academic_supervisor']:
            return WeeklyLog.objects.filter(placement__workplace_supervisor=user)
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
        
        serializer = self.get_serializer(weekly_log, data={'status': 'submitted'}, partial=True)
        serializer.is_valid(raise_exception=True)
        
        weekly_log.status = 'submitted'
        weekly_log.submitted_at = timezone.now()
        weekly_log.save()
        return Response({'message': f'Weekly log {weekly_log.week_number} submitted successfully.'},
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

class EvaluationViewset(viewsets.ModelViewSet):
    queryset = Evaluation.objects.all()
    serializer_class = EvaluationSerializer
    permission_classes = [IsAuthenticated, IsAcademicSupervisor | IsInternAdmin | IsStudent]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'student':
            return Evaluation.objects.filter(placement__student=user)
        return Evaluation.objects.all()

class EvaluationCriteriaViewset(viewsets.ModelViewSet):
    queryset = EvaluationCriteria.objects.all()
    serializer_class = EvaluationCriteriaSerializer
    permission_classes = [IsInternAdmin | IsAcademicSupervisor]