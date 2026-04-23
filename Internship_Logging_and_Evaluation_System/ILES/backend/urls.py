from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer
from .views import (
    InternshipPlacementViewset, 
    WeeklyLogViewset, 
    EvaluationViewset, 
    EvaluationCriteriaViewset
)

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

router = DefaultRouter()
router.register(r'placements', InternshipPlacementViewset, basename='placement')
router.register(r'logs', WeeklyLogViewset, basename='logs')
router.register(r'evaluations', EvaluationViewset, basename='evaluations')
router.register(r'criteria', EvaluationCriteriaViewset, basename='criteria')

urlpatterns = [
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', include(router.urls)),
]