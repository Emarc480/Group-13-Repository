from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User, InternshipPlacement, WeeklyLog, Evaluation, EvaluationCriteria

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role
        token['username'] = user.username
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['role'] = self.user.role
        data['username'] = self.user.username
        data['id'] = self.user.id
        return data

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role']

class InternshipPlacementSerializer(serializers.ModelSerializer):
    student_username = serializers.ReadOnlyField(source='student.username')

    class Meta:
        model = InternshipPlacement
        fields = [
            'id', 'student', 'student_username', 'organization_name', 
            'supervisor_name', 'start_date', 'end_date'
        ]

    def validate(self, data):
        if data['start_date'] >= data['end_date']:
            raise serializers.ValidationError("End date must be after the start date.")

        overlapping = InternshipPlacement.objects.filter(
            student=data['student'],
            start_date__lt=data['end_date'],
            end_date__gt=data['start_date']
        )

        if self.instance:
            overlapping = overlapping.exclude(pk=self.instance.pk)

        if overlapping.exists():
            raise serializers.ValidationError("This student already has an internship placement during this time period.")

        return data

class WeeklyLogSerializer(serializers.ModelSerializer):
    student_name = serializers.ReadOnlyField(source='placement.student.username')
    organization = serializers.ReadOnlyField(source='placement.organization_name')

    class Meta:
        model = WeeklyLog
        fields = [
            'id', 'placement', 'student_name', 'organization', 
            'week_number', 'content', 'status', 'created_at', 'is_verified'
        ]

class EvaluationCriteriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = EvaluationCriteria
        fields = ['id', 'name', 'max_score']

class EvaluationSerializer(serializers.ModelSerializer):
    criteria_name = serializers.ReadOnlyField(source='criteria.name')

    class Meta:
        model = Evaluation
        fields = ['id', 'placement', 'criteria', 'criteria_name', 'score', 'comments']