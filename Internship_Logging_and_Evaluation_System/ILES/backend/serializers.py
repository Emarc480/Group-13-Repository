from rest_framework import serializers
from .models import InternshipPlacement, WeeklyLog, Evaluation, EvaluationCriteria
from django.contrib.auth.password_validation import validate_password
from .models import CustomUser

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password', 'role', 'first_name', 'last_name']

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user

class InternshipPlacementSerializer(serializers.ModelSerializer):
    class Meta:
        model = InternshipPlacement
        fields = '__all__'

class WeeklyLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeeklyLog
        fields = '__all__'

class EvaluationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evaluation
        fields = '__all__'

class EvaluationCriteriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = EvaluationCriteria
        fields = '__all__'
