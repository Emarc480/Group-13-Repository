from rest_framework import serializers
from .models import User, InternshipPlacement, WeeklyLog, Evaluation

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'organization']

class WeeklyLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeeklyLog
        fields = '__all__'

class EvaluationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evaluation
        fields = '__all__'

class InternshipPlacementSerializer(serializers.ModelSerializer):
    # This nesting allows you to see the student's info inside the placement data
    student = UserSerializer(read_only=True)
    logs = WeeklyLogSerializer(many=True, read_only=True)
    
    class Meta:
        model = InternshipPlacement
        fields = ['id', 'student', 'company_name', 'start_date', 'end_date', 'logs']