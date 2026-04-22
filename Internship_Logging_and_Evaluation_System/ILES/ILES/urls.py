"""
URL configuration for ILES project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

# Import your custom views and serializer logic
from rest_framework_simplejwt.views import TokenObtainPairView
from backend.serializers import MyTokenObtainPairSerializer
from backend.views import (
    InternshipPlacementViewset, 
    WeeklyLogViewset, 
    EvaluationViewset, 
    EvaluationCriteriaViewset
)

# Define the custom Token View to use our Role-aware Serializer
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

# Register API routes
router = DefaultRouter()
router.register(r'placements', InternshipPlacementViewset, basename='placement')
router.register(r'logs', WeeklyLogViewset, basename='logs')
router.register(r'evaluations', EvaluationViewset, basename='evaluations')
router.register(r'criteria', EvaluationCriteriaViewset, basename='criteria')

urlpatterns = [
    # Admin Interface
    path('admin/', admin.site.urls),

    # Authentication Endpoints (Week 4 Task)
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Resource Endpoints
    path('api/', include(router.urls)),
]