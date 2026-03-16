from rest_framework.permissions import BasePermission


class IsStudent(BasePermission):
    """
    Allows access only to users with the student role.
    """
    def has_permission(self, request, view):
        return request.user.role == 'student'


class IsLecturer(BasePermission):
    """
    Allows access only to users with the lecturer role.
    """
    def has_permission(self, request, view):
        return request.user.role == 'lecturer'


class IsHOD(BasePermission):
    """
    Allows access only to users with the head of department role.
    """
    def has_permission(self, request, view):
        return request.user.role == 'hod'


class IsRegistrar(BasePermission):
    """
    Allows access only to users with the registrar role.
    """
    def has_permission(self, request, view):
        return request.user.role == 'registrar'


class IsRegistrarOrHOD(BasePermission):
    """
    Allows access to both registrar and head of department.
    """
    def has_permission(self, request, view):
        return request.user.role in ['registrar', 'hod']