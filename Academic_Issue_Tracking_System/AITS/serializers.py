from rest_framework import serializers
from .models import User, Issue

class AITS_RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'email', 'role', 'registration_number']

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class IssueSerializer(serializers.ModelSerializer):
    student_name = serializers.ReadOnlyField(source='student.username')

    class Meta:
        model = Issue
        fields = ['id', 'student', 'student_name', 'category', 'description', 'status', 'created_at']