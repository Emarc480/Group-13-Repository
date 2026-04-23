from django.shortcuts import render
from rest_framework import viewsets, generics, status, permissions
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import CustomUser, InternshipPlacement, WeeklyLog, Evaluation, EvaluationCriteria
from .serializers import (
    RegisterSerializer,
    InternshipPlacementSerializer,
    WeeklyLogSerializer,
    EvaluationSerializer,
    EvaluationCriteriaSerializer,
    MyTokenObtainPairSerializer
)
from .permissions import IsStudent, IsInternAdmin, IsWorkplaceSupervisor, IsAcademicSupervisor

# Logic for dynamic permission checking
class IsSupervisorOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in [
            'intern_admin', 'academic_supervisor', 'workplace_supervisor'
        ]

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

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
    serializer_class = InternshipPlacementSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'intern_admin':
            return InternshipPlacement.objects.all()
        if user.role == 'workplace_supervisor':
            return InternshipPlacement.objects.filter(workplace_supervisor=user)
        return InternshipPlacement.objects.filter(student=user)

class WeeklyLogViewset(viewsets.ModelViewSet):
    serializer_class = WeeklyLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['intern_admin', 'academic_supervisor', 'workplace_supervisor']:
            return WeeklyLog.objects.all()
        return WeeklyLog.objects.filter(placement__student=user)

    def perform_create(self, serializer):
        serializer.save()
https://github.com/Emarc480/Group-13-Repository/pull/20/conflict?name=Internship_Logging_and_Evaluation_System%252FILES%252Fbackend%252Fviews.py&ancestor_oid=91ea44a218fbd2f408430959283f0419c921093e&base_oid=ed35acc4df716ce5d5d4077745152e3fdb87d826&head_oid=fbb2f542468594f06b7918d48250d623c1d8f764
class EvaluationViewset(viewsets.ModelViewSet):
    queryset = Evaluation.objects.all()
    serializer_class = EvaluationSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsSupervisorOrAdmin()]
        return [IsAuthenticated()]

class EvaluationCriteriaViewset(viewsets.ModelViewSet):
    queryset = EvaluationCriteria.objects.all()
    serializer_class = EvaluationCriteriaSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsInternAdmin()]
        return [IsAuthenticated()]