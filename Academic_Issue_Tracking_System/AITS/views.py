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
from .serializers import IssueSerializer
from .models import Issue

# --- This is the Welcome View ---
def main(request):
    return HttpResponse("Welcome to the Academic Issue Tracking System API")

# --- This is the Register View ---
class AITS_RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = AITS_RegistrationSerializer
    permission_classes = [AllowAny]

# --- This is the Login View ---
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

# Student Dashboard --- displays info related to the student ---
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsStudent])
def student_dashboard(request):
    issues = Issue.objects.filter(student=request.user)
    serializer = IssueSerializer(issues, many=True)
    return Response({
        'username': request.user.username,
        'student_number':request.user.student_number,
        'stats': {
            'total': issues.count(),
            'open': issues.filter(status='open').count(),
            'in_progress': issues.filter(status = 'in_progress').count(),
            'resolved': issues.filter(status = 'resolved').count(),
        },
        'issues': serializer.data
        })

# --- This is the Submit Issue View ---
@api_view(['POST'])
@permission_classes([IsAuthenticated, IsStudent])
def submit_issue(request):
    serializer = IssueSerializer(data = request.data)
    if serializer.is_valid():
        serializer.save(student = request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Lecturer Dashboard --- displays info related to the Lecturer ---
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsLecturer])
def lecturer_dashboard(request):
    return Response({'message': f'Welcome lecturer {request.user.username}'})


# Registrar Dashboard --- displays info related to the Registrar ---
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsRegistrar])
def registrar_dashboard(request):
    return Response({'message': f'Welcome registrar {request.user.username}'})

# --- Assign issue (Registrar only) ---
@api_view(['PATCH'])
@permission_classes([IsAuthenticated, IsRegistrar])
def assign_issue(request, issue_id):
    try:
        issue = Issue.objects.get(id=issue_id)
    except Issue.DoesNotExist:
        return Response({'error': 'Issue not found'}, status=status.HTTP_404_NOT_FOUND)

    assigned_to_id = request.data.get('assigned_to')
    issue.assigned_to_id = assigned_to_id
    issue.status = 'in_progress'
    issue.save()
    return Response({'message': 'Issue assigned successfully'})

# --- Resolve issue (Registrar only) ---
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def resolve_issue(request, issue_id):
    try:
        issue = Issue.objects.get(id=issue_id)
    except Issue.DoesNotExist:
        return Response({'error': 'Issue not found'}, status=status.HTTP_404_NOT_FOUND)

    issue.status = 'resolved'
    issue.save()
    return Response({'message': 'Issue resolved successfully'})

# Profile --- displays info related to the current user ---
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    return Response(
        "Your profile is as follows",
        {
            'username': request.user.username,
            'email': request.user.email,
            'role': request.user.role,
            'student_number': request.user.student_number,
            'department': request.user.department.name if request.user.department else None,
        })