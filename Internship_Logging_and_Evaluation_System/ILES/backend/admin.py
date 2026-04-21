from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, InternshipPlacement, WeeklyLog, Evaluation, EvaluationCriteria

# 1. Customize User View
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'role', 'is_staff')
    list_filter = ('role', 'is_staff')
    # This ensures 'role' shows up when editing a user
    fieldsets = UserAdmin.fieldsets + (
        ('Extra Info', {'fields': ('role',)}),
    )

# 2. Customize Placement View
class PlacementAdmin(admin.ModelAdmin):
    list_display = ('student', 'organization_name', 'supervisor_name', 'start_date')
    search_fields = ('organization_name', 'student__username')

# 3. Customize Weekly Log View (The most important one!)
class WeeklyLogAdmin(admin.ModelAdmin):
    list_display = ('get_student', 'week_number', 'status', 'created_at')
    list_filter = ('status', 'week_number')
    
    # Helper to pull the student name through the placement relationship
    def get_student(self, obj):
        return obj.placement.student.username
    get_student.short_description = 'Student'

# Registering with the new classes
admin.site.register(User, CustomUserAdmin)
admin.site.register(InternshipPlacement, PlacementAdmin)
admin.site.register(WeeklyLog, WeeklyLogAdmin)
admin.site.register(Evaluation)
admin.site.register(EvaluationCriteria)