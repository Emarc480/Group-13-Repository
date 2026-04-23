from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView
from backend.serializers import MyTokenObtainPairSerializer
from backend.views import (
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
    path('admin/', admin.site.urls),
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/', include(router.urls)),
]