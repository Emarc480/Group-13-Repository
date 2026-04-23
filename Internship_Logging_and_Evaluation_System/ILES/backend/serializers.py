from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.password_validation import validate_password
from .models import CustomUser, InternshipPlacement, WeeklyLog, Evaluation, EvaluationCriteria

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

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password', 'role', 'first_name', 'last_name']

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'role']

class InternshipPlacementSerializer(serializers.ModelSerializer):
    student_username = serializers.ReadOnlyField(source='student.username')

    class Meta:
        model = InternshipPlacement
        fields = '__all__'

    def validate(self, data):
        if data.get('start_date') and data.get('end_date'):
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
                raise serializers.ValidationError("This student already has an overlapping internship placement.")

        return data

class WeeklyLogSerializer(serializers.ModelSerializer):
    student_name = serializers.ReadOnlyField(source='placement.student.username')
    company = serializers.ReadOnlyField(source='placement.company_name')

    class Meta:
        model = WeeklyLog
        fields = '__all__'

class EvaluationCriteriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = EvaluationCriteria
        fields = '__all__'

class EvaluationSerializer(serializers.ModelSerializer):
    criteria_name = serializers.ReadOnlyField(source='criteria.name')

    class Meta:
        model = Evaluation
        fields = '__all__'