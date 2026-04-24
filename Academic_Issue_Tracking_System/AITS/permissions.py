from rest_framework.permissions import BasePermission

class IsStudent(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'student')

class IsLecturer(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'lecturer')

class IsHOD(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'hod')

class IsRegistrar(BasePermission):
    def has_permission(self, request, view):
        # The key check for your specific task
        return bool(request.user and request.user.is_authenticated and request.user.role == 'registrar')

class IsRegistrarOrHOD(BasePermission):
    def has_permission(self, request, view):
        return request.user.role in ['registrar', 'hod']
    
class IsIssueOwner(BasePermission):
    """
    Allows access only to the owner of the student who submitted the issue.
    Used for edit and withidraw endpoints to ensure only the student who submitted the issue can edit or withdraw it.
    """
    def has_object_permission(self, request, view, obj):
        return obj.student == request.user
