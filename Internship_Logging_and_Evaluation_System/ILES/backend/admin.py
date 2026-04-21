from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, InternshipPlacement, WeeklyLog, Evaluation, EvaluationCriteria

# This allows us to see the custom 'role' field in the Admin panel
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('role',)}),
    )
    list_display = ['username', 'email', 'role', 'is_staff']

# Registering the models
admin.site.register(User, CustomUserAdmin)
admin.site.register(InternshipPlacement)
admin.site.register(WeeklyLog)
admin.site.register(Evaluation)
admin.site.register(EvaluationCriteria)