from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import InternshipPlacement, WeeklyLog, Evaluation, EvaluationCriteria, User
from .serializers import *

# Custom Permission for Supervisors/Admins
class IsSupervisorOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in [
            'ADMIN', 'ACADEMIC_SUPERVISOR', 'WORKPLACE_SUPERVISOR'
        ]

class InternshipPlacementViewset(viewsets.ModelViewSet):
    serializer_class = InternshipPlacementSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'ADMIN':
            return InternshipPlacement.objects.all()
        # Students see their own; Supervisors see placements they are involved in
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
        # Automatically link log to the student's placement if they are a student
        serializer.save()

class EvaluationViewset(viewsets.ModelViewSet):
    queryset = Evaluation.objects.all()
    serializer_class = EvaluationSerializer
    # RBAC: Only supervisors or admins can create/edit evaluations
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsSupervisorOrAdmin()]
        return [permissions.IsAuthenticated()]

class EvaluationCriteriaViewset(viewsets.ModelViewSet):
    queryset = EvaluationCriteria.objects.all()
    serializer_class = EvaluationCriteriaSerializer
    # Only Admin can manage criteria
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return [permissions.IsAuthenticated()]
