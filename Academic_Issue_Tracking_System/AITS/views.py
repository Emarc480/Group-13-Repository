from rest_framework import generics
from rest_framework.permissions import AllowAny # Add this import
from .serializers import AITS_RegistrationSerializer
from .models import User

class AITS_RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = AITS_RegistrationSerializer
    permission_classes = [AllowAny] # Add this line