from django.shortcuts import render
from rest_framework import viewsets
from .models import InternshipPlacement, WeeklyLog, Evaluation, EvaluationCriteria
from .permissions import IsStudent, IsInternAdmin, IsWorkplaceSupervisor, IsAcademicSupervisor
from .serializers import InternshipPlacementSerializer, WeeklyLogSerializer, EvaluationSerializer, EvaluationCriteriaSerializer

# Create your views here.

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