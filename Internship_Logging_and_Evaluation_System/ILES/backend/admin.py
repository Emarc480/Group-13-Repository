from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, InternshipPlacement, WeeklyLog, Evaluation, EvaluationCriteria

# 1. User Customization
@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'role', 'is_staff', 'is_active')
    list_filter = ('role', 'is_staff', 'is_active')
    search_fields = ('username', 'email')
    ordering = ('username',)

    fieldsets = UserAdmin.fieldsets + (
        ('ILES Role Management', {'fields': ('role',)}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('ILES Role Management', {'fields': ('role',)}),
    )

# 2. Placement Customization
@admin.register(InternshipPlacement)
class PlacementAdmin(admin.ModelAdmin):
    list_display = ('student', 'organization_name', 'supervisor_name', 'start_date')
    search_fields = ('organization_name', 'supervisor_name', 'student__username')
    list_filter = ('start_date',)

# 3. Weekly Log Customization
@admin.register(WeeklyLog)
class WeeklyLogAdmin(admin.ModelAdmin):
    list_display = ('get_student', 'week_number', 'status', 'created_at', 'is_verified')
    list_filter = ('status', 'week_number', 'is_verified')
    search_fields = ('placement__student__username', 'content')
    readonly_fields = ('created_at',) # Keep the timestamp honest

    def get_student(self, obj):
        return obj.placement.student.username if obj.placement else "No Placement"
    get_student.short_description = 'Student'

# 4. Evaluation Customization
@admin.register(EvaluationCriteria)
class EvaluationCriteriaAdmin(admin.ModelAdmin):
    list_display = ('name', 'max_score')

@admin.register(Evaluation)
class EvaluationAdmin(admin.ModelAdmin):
    list_display = ('placement', 'criteria', 'score')
    list_filter = ('criteria',)