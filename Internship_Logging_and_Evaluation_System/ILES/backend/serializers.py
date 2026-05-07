from rest_framework import serializers
from .models import InternshipPlacement, WeeklyLog, Evaluation, EvaluationCriteria, CustomUser, ReviewComment
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.core.exceptions import ValidationError
from django.utils import timezone


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, validators=[validate_password])

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password',
                  'role', 'first_name', 'last_name']

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user


class InternshipPlacementSerializer(serializers.ModelSerializer):
    class Meta:
        model = InternshipPlacement
        fields = '__all__'

    def validate(self, data):
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        student = data.get('student')

        instance = self.instance

        if start_date and end_date and start_date > end_date:
            raise serializers.ValidationError(
                {"end_date": "End date must be after start date."})

        query = InternshipPlacement.objects.filter(
            student=student,
            start_date__lte=end_date,
            end_date__gte=start_date
        )

        if instance:
            query = query.exclude(pk=instance.pk)

        if query.exists():
            raise serializers.ValidationError(
                "This student already has an internship placement that overlaps with these dates."
            )

        return data


class WeeklyLogSerializer(serializers.ModelSerializer):
    evaluation_score = serializers.SerializerMethodField()
    evaluation_finalized = serializers.SerializerMethodField()

    class Meta:
        model = WeeklyLog
        fields = '__all__'
        read_only_fields = ['status', 'submitted_at', 'is_editable']

    def get_evaluation_finalized(self, obj):
        evaluation = obj.placement.evaluation_criteria.first()
        if evaluation:
            return evaluation.is_finalized
        return False

    def get_evaluation_score(self, obj):
        evaluation = obj.placement.evaluation_criteria.first()
        if evaluation and evaluation.is_finalized:
            return evaluation.total_score
        return None

    def update(self, instance, validated_data):
        if instance.status == 'approved':
            raise serializers.ValidationError(
                "Cannot update a log that has been approved.")
        return super().update(instance, validated_data)

    def validate(self, data):
        from django.utils import timezone
        from datetime import timedelta

        if data.get('status') == 'submitted':
            placement = data.get('placement') or self.instance.placement
            week_number = data.get('week_number') or self.instance.week_number

            week_start = placement.start_date + \
                timedelta(weeks=week_number - 1)
            deadline = week_start + timedelta(days=7)

            if timezone.now().date() > deadline:
                raise serializers.ValidationError(
                    f"Submission deadline for week {week_number} has passed. Deadline was {deadline}."
                )
        return data


class EvaluationSerializer(serializers.ModelSerializer):
    score = serializers.DecimalField(
        max_digits=5, decimal_places=2, read_only=True)
    grade = serializers.CharField(read_only=True)
    criteria_detail = serializers.SerializerMethodField()

    class Meta:
        model = Evaluation
        fields = '__all__'
        read_only_fields = ['score', 'grade', 'evaluated_by', 'evaluated_at']

    def get_criteria_detail(self, obj):
        x = obj.criteria
        return {
            'punctuality': x.punctuality,
            'technical_skills': x.technical_skills,
            'communication': x.communication,
            'initiative': x.initiative,
            'total_score': str(x.total_score),
        }

    def validate(self, data):
        placement = data.get('placement')
        instance = self.instance
        if instance is None:
            if Evaluation.objects.filter(placement=placement).exists():
                raise serializers.ValidationError(
                    "An evaluation already exists for this placement.")
        return data


class EvaluationCriteriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = EvaluationCriteria
        fields = '__all__'


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['role'] = self.user.role or "No Role Assigned"
        return data


class ReviewCommentSerializer(serializers.ModelSerializer):
    reviewer_name = serializers.SerializerMethodField()

    class Meta:
        model = ReviewComment
        fields = '__all__'
        read_only_fields = ['reviewer', 'created_at']

    def get_reviewer_name(self, obj):
        if obj.reviewer:
            return f"{obj.reviewer.first_name} {obj.reviewer.last_name}"

        return "Unknown"
