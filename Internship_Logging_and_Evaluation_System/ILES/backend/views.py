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
    EvaluationCriteriaSerializer
)
# Create your views here.

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
    permission_classes = [IsInternAdmin]

class WeeklyLogViewset(viewsets.ModelViewSet):
    queryset = WeeklyLog.objects.all()
    serializer_class = WeeklyLogSerializer
    permission_classes = [IsStudent | IsWorkplaceSupervisor | IsAcademicSupervisor | IsInternAdmin]

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
        weekly_log.status = 'submitted'
        weekly_log.submitted_at = timezone.now()
        weekly_log.save()
        return Response({'message': f'Weekly log {weekly_log.week_number} submitted successfully.'},
                        status=status.HTTP_200_OK)

class EvaluationViewset(viewsets.ModelViewSet):
    queryset = Evaluation.objects.all()
    serializer_class = EvaluationSerializer
    permission_classes = [ IsStudent | IsAcademicSupervisor]

class EvaluationCriteriaViewset(viewsets.ModelViewSet):
    queryset = EvaluationCriteria.objects.all()
    serializer_class = EvaluationCriteriaSerializer
    permission_classes = [IsInternAdmin | IsAcademicSupervisor]