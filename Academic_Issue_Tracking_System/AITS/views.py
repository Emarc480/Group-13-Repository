from django.http import HttpResponse
from django.contrib.auth import authenticate

# REST Framework Imports
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken

# Local Imports
from .models import User, Issue, AuditLog
from .serializers import AITS_RegistrationSerializer, IssueSerializer
from .permissions import IsRegistrar, IsLecturer, IsStudent, IsIssueOwner

# --- GENERAL VIEWS ---

def main(request):
    return HttpResponse("Welcome to the Academic Issue Tracking System API")

def profile(request):
    return Response("Your profile is as follows")

# --- AUTHENTICATION VIEWS ---

class AITS_RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = AITS_RegistrationSerializer
    permission_classes = [AllowAny]

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

# --- STUDENT VIEWS ---

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsStudent])
def student_dashboard(request):
    return Response({'message': f'Welcome student {request.user.username}'})

@api_view(['POST'])
def submit_issue(request):
    serializer = IssueSerializer(data=request.data)
    if serializer.is_valid():
        issue = serializer.save(student = request.user)
        AuditLog.objects.create(
            issue=issue,
            performed_by = request.user,
            action = 'Issue Submitted'
        )
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsStudent])
def list_issues(request):
    issues = Issue.objects.filter(student=request.user)
    serializer = IssueSerializer(issues, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsStudent])
def issue_detail(request, issue_id):
    try:
        issue = Issue.objects.get(id=issue_id, student=request.user)
    except Issue.DoesNotExist:
        return Response({'error': 'Issue not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = IssueSerializer(issue)
    return Response(serializer.data)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated, IsStudent, IsIssueOwner])
def edit_issue(request, issue_id):
    try:
        issue = Issue.objects.get(id=issue_id, student=request.user)
    except Issue.DoesNotExist:
        return Response({'error': 'Issue not found'}, status=status.HTTP_404_NOT_FOUND)

    if issue.status != 'open':
        return Response({'error': 'Only open issues can be edited'}, status=status.HTTP_400_BAD_REQUEST)

    serializer = IssueSerializer(issue, data=request.data, partial=True)
    if serializer.is_valid():
        issue = serializer.save()
        AuditLog.objects.create(
            issue = issue,
            performed_by = request.user,
            action = 'Issued edited by student'
        )
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated, IsStudent, IsIssueOwner])
def withdraw_issue(request, issue_id):
    try:
        issue = Issue.objects.get(id=issue_id, student=request.user)
    except Issue.DoesNotExist:
        return Response({'error': 'Issue not found'}, status=status.HTTP_404_NOT_FOUND)
    
    if issue.status != 'open':
        return Response({'error': 'Only open issues can be withdrawn'}, status=status.HTTP_400_BAD_REQUEST)
    
    AuditLog.objects.create(
        issue = issue,
        performed_by = request.user,
        action = 'Issue withdrawn by student'
    )
    issue.delete()
    return Response({'message': 'Issue withdrawn successfully'}, status=status.HTTP_204_NO_CONTENT)

# --- LECTURER VIEWS ---

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsLecturer])
def lecturer_dashboard(request):
    return Response({'message': f'Welcome lecturer {request.user.username}'})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def lecturer_issues(request):
    issues = Issue.objects.filter(assigned_to=request.user)
    serializer = IssueSerializer(issues, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsLecturer])
def update_issue_status(request, issue_id):
    try:
        issue = Issue.objects.get(id=issue_id, assigned_to=request.user)
    except Issue.DoesNotExist:
        return Response({'error': 'Issue not found'}, status=status.HTTP_404_NOT_FOUND)

    new_status = request.data.get('status')
    if new_status not in ['Open', 'In Progress', 'Resolved']:
        return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

    issue.status = new_status
    issue.save()
    return Response({'message': 'Issue status updated successfully'})

# --- REGISTRAR VIEWS ---

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsRegistrar])
def registrar_dashboard(request):
    total_issues = Issue.objects.count()
    pending_issues = Issue.objects.filter(status='Pending').count()
    return Response({
        'message': f'Welcome registrar {request.user.username}',
        'total_issues': total_issues,
        'pending_count': pending_issues
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsRegistrar])
def registrar_all_issues(request):
    issues = Issue.objects.all().order_by('-id')
    serializer = IssueSerializer(issues, many=True)
    return Response(serializer.data)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated, IsRegistrar])
def registrar_update_issue(request, issue_id):
    try:
        issue = Issue.objects.get(id=issue_id)
    except Issue.DoesNotExist:
        return Response({'error': 'Issue not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = IssueSerializer(issue, data=request.data, partial=True)
    if serializer.is_valid():
        updated_issue = serializer.save()
        AuditLog.objects.create(
            issue=updated_issue,
            action=f"Updated to {updated_issue.status} by Registrar",
            performed_by=request.user
        )
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# --- MISSING FUNCTION ADDED BELOW ---

@api_view(['PATCH'])
@permission_classes([IsAuthenticated, IsRegistrar])
def assign_issue(request, issue_id):
    """
    Specifically for the Registrar to assign an issue to a Lecturer
    """
    try:
        issue = Issue.objects.get(id=issue_id)
    except Issue.DoesNotExist:
        return Response({'error': 'Issue not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = IssueSerializer(issue, data=request.data, partial=True)
    if serializer.is_valid():
        updated_issue = serializer.save()
        # Create Log
        AuditLog.objects.create(
            issue=updated_issue,
            action=f"Assigned to {updated_issue.assigned_to.username if updated_issue.assigned_to else 'None'} by Registrar",
            performed_by=request.user
        )
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)