from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import (
    InternshipPlacementViewset, 
    WeeklyLogViewset, 
    EvaluationViewset, 
    EvaluationCriteriaViewset
)

router = DefaultRouter()
router.register(r'placements', InternshipPlacementViewset, basename='placement')
router.register(r'logs', WeeklyLogViewset, basename='weeklylog')
router.register(r'evaluations', EvaluationViewset, basename='evaluation')
router.register(r'criteria', EvaluationCriteriaViewset, basename='criteria')

urlpatterns = [
    path('', include(router.urls)),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]