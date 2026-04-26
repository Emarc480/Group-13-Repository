from rest_framework import serializers
from .models import InternshipPlacement, WeeklyLog, Evaluation, EvaluationCriteria, CustomUser
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.core.exceptions import ValidationError

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

    def validate(self, data):
        instance = InternshipPlacement(**data)
        if self.instance:
            instance.pk = self.instance.pk
        
        try:
            instance.clean()
        except ValidationError as e:
            raise serializers.ValidationError(e.message_dict if hasattr(e, 'message_dict') else e.message)
        return data

class WeeklyLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeeklyLog
        fields = '__all__'

    def update(self, instance, validated_data):
        if instance.status == 'approved':
            raise serializers.ValidationError("Cannot update a log that has been approved.")
        return super().update(instance, validated_data)
    
    def validate(self, data):
        from django.utils import timezone
        from datetime import timedelta

        if data.get('status') == 'submitted':
            placement = data.get('placement') or self.instance.placement
            week_number = data.get('week_number') or self.instance.week_number

            week_start = placement.start_date + timedelta(weeks=week_number - 1)
            deadline = week_start + timedelta(days=7)

            if timezone.now().date() > deadline:
                raise serializers.ValidationError(
                        f"Submission deadline for week {week_number} has passed. Deadline was {deadline}."
                        )
        return data

class EvaluationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evaluation
        fields = '__all__'

class EvaluationCriteriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = EvaluationCriteria
        fields = '__all__'

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['role'] = self.user.role
        return data