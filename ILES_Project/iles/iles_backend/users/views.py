from rest_framework import viewsets, permissions
from .models import WeeklyLog, InternshipPlacement, Evaluation
from .serializers import WeeklyLogSerializer, InternshipPlacementSerializer, EvaluationSerializer

class WeeklyLogViewSet(viewsets.ModelViewSet):
    serializer_class = WeeklyLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # This ensures a student only sees THEIR own logs
        return WeeklyLog.objects.filter(placement__student=self.request.user)

    def perform_create(self, serializer):
        # Automatically link the log to the student's active placement
        placement = InternshipPlacement.objects.get(student=self.request.user)
        serializer.save(placement=placement)

class EvaluationViewSet(viewsets.ModelViewSet):
    queryset = Evaluation.objects.all()
    serializer_class = EvaluationSerializer
    permission_classes = [permissions.IsAuthenticated]