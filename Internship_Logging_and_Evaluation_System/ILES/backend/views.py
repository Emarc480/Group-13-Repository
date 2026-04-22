from rest_framework import viewsets, permissions
from .models import InternshipPlacement, WeeklyLog, Evaluation, EvaluationCriteria, User
from .serializers import *

class IsInternAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'ADMIN'

class IsStudent(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'STUDENT'

class InternshipPlacementViewset(viewsets.ModelViewSet):
    queryset = InternshipPlacement.objects.all()
    serializer_class = InternshipPlacementSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'ADMIN':
            return InternshipPlacement.objects.all()
        return InternshipPlacement.objects.filter(student=user)

class WeeklyLogViewset(viewsets.ModelViewSet):
    serializer_class = WeeklyLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['ADMIN', 'ACADEMIC_SUPERVISOR', 'WORKPLACE_SUPERVISOR']:
            return WeeklyLog.objects.all()
        return WeeklyLog.objects.filter(placement__student=user)

    def perform_create(self, serializer):
        serializer.save()

class EvaluationViewset(viewsets.ModelViewSet):
    queryset = Evaluation.objects.all()
    serializer_class = EvaluationSerializer
    permission_classes = [permissions.IsAuthenticated]

class EvaluationCriteriaViewset(viewsets.ModelViewSet):
    queryset = EvaluationCriteria.objects.all()
    serializer_class = EvaluationCriteriaSerializer
    permission_classes = [permissions.IsAuthenticated]