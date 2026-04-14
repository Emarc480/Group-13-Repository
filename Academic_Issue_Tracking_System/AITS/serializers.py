from rest_framework import serializers
from .models import User, Issue, AuditLog, Department


class AITS_RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'email', 'role', 'registration_number']

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class IssueSerializer(serializers.ModelSerializer):

    submitted_by = serializers.SerializerMethodField()
    status = serializers.CharField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Issue
        fields = [
            'id',
            'submitted_by',
            'department',
            'course_code',
            'category',
            'status',
            'description',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['student', 'assigned_to', 'status', 'created_at', 'updated_at']

    def get_submitted_by(self, obj):
        return obj.student.username

    def validate_course_code(self, value):
        if not value.strip():
            raise serializers.ValidationError("Course code cannot be empty.")
        return value.upper()

    def validate_description(self, value):
        if len(value.strip()) < 20:
            raise serializers.ValidationError(
                "Description must be at least 20 characters long."
            )
        return value

    def validate_department(self, value):
        if not Department.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("Selected department does not exist.")
        return value


class AuditLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditLog
        fields = '__all__'