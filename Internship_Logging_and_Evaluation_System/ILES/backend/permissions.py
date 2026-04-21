from rest_framework.permissions import BasePermission

class IsStudent(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'student'

class IsWorkplaceSupervisor(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'workplace_supervisor'

class IsAcademicSupervisor(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'academic_supervisor'

class IsInternAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'intern_admin'

from rest_framework import permissions

class IsOwnerOrSupervisor(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.role in ['academic_supervisor', 'workplace_supervisor']:
            return True
        return obj.placement.student == request.user