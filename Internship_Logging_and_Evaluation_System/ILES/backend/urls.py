from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    RegisterView,
    me,
    InternshipPlacementViewset,
    WeeklyLogViewset,
    EvaluationViewset,
    EvaluationCriteriaViewset,
    )

router = DefaultRouter()
router.register(r'placements', InternshipPlacementViewset)
router.register(r'logs', WeeklyLogViewset)
router.register(r'evaluations', EvaluationViewset)
router.register(r'criteria', EvaluationCriteriaViewset)

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/me/', me, name='me'),
    path('', include(router.urls)),
]