from django.urls import path
from .views import AITS_RegisterView

urlpatterns = [
    path('register/', AITS_RegisterView.as_view(), name='aits_register'),
]