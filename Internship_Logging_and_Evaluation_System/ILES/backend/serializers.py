from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User, InternshipPlacement, WeeklyLog, Evaluation, EvaluationCriteria

# --- WEEK 4: JWT & RBAC LOGIC ---
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims into the encrypted token
        token['role'] = user.role
        token['username'] = user.username
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        # Add extra data to the plain-text response for React to store in localStorage
        data['role'] = self.user.role
        data['username'] = self.user.username
        data['id'] = self.user.id
        return data

# --- MODEL SERIALIZERS ---
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