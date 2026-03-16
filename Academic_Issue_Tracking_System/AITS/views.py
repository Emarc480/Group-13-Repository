from rest_framework import generics
from rest_framework.permissions import AllowAny
from .serializers import AITS_RegistrationSerializer
from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import User
from .permissions import IsRegistrar, IsLecturer, IsStudent


class AITS_RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = AITS_RegistrationSerializer
    permission_classes = [AllowAny]


def main(request):
    return HttpResponse("We good to go G")


# Login View
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response(
            {'error': 'Please provide both username and password'},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = authenticate(username=username, password=password)

    if not user:
        return Response(
            {'error': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    refresh = RefreshToken.for_user(user)

    return Response({
        'token': str(refresh.access_token),
        'refresh': str(refresh),
        'role': user.role,
        'username': user.username,
    })


# Test protected routes per role
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsStudent])
def student_dashboard(request):
    return Response({'message': f'Welcome student {request.user.username}'})


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsLecturer])
def lecturer_dashboard(request):
    return Response({'message': f'Welcome lecturer {request.user.username}'})


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsRegistrar])
def registrar_dashboard(request):
    return Response({'message': f'Welcome registrar {request.user.username}'})
