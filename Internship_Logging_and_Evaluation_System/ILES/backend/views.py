from django.shortcuts import render
from rest_framework import viewsets, generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
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

class InternshipPlacementViewset(viewsets.ModelViewSet):
    queryset = InternshipPlacement.objects.all()
    serializer_class = InternshipPlacementSerializer
    permission_classes = IsInternAdmin

class WeeklyLogViewset(viewsets.ModelViewSet):
    queryset = WeeklyLog
    serializer_class = WeeklyLogSerializer
    permission_classes = IsStudent

class EvaluationViewset(viewsets.ModelViewSet):
    queryset = Evaluation
    serializer_class = EvaluationSerializer
    permission_classes = [ IsStudent | IsAcademicSupervisor]

class EvaluationCriteriaViewset(viewsets.ModelViewSet):
    queryset = EvaluationCriteria
    serializer_class = EvaluationCriteriaSerializer
    permission_classes = [IsInternAdmin | IsAcademicSupervisor]