from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    CustomTokenObtainPairView,
    RegisterView,
    logout_view,
    me,
    InternshipPlacementViewset,
    WeeklyLogViewset,
    EvaluationViewset,
    EvaluationCriteriaViewset,
    dashboard_stats,
)

router = DefaultRouter()
router.register(r'placements', InternshipPlacementViewset)
router.register(r'logs', WeeklyLogViewset)
router.register(r'evaluations', EvaluationViewset)
router.register(r'criteria', EvaluationCriteriaViewset)

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/logout/', logout_view, name='logout'),
    path('auth/me/', me, name='me'),
    path('dashboard/stats/', dashboard_stats, name='dashboard_stats'),
    path('', include(router.urls)),
]