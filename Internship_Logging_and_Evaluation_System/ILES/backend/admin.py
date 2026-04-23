from django.contrib import admin
from .models import CustomUser, InternshipPlacement, WeeklyLog, EvaluationCriteria, Evaluation

@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'role', 'is_staff')
    list_filter = ('role',)

@admin.register(InternshipPlacement)
class PlacementAdmin(admin.ModelAdmin):
    list_display = ('student', 'organization_name', 'supervisor_name') 
    search_fields = ('organization_name', 'student__username')

@admin.register(WeeklyLog)
class WeeklyLogAdmin(admin.ModelAdmin):
    list_display = ('week_number', 'placement', 'status', 'created_at', 'is_verified')
    list_filter = ('status', 'is_verified')
    readonly_fields = ('created_at',)

admin.site.register(EvaluationCriteria)
admin.site.register(Evaluation)