from django.contrib.auth.models import AbstractUser
from django.db import models

# 1. CustomUser Model
class User(AbstractUser):
    ROLE_CHOICES = (
        ('STUDENT', 'Student'),
        ('WORKPLACE_SUP', 'Workplace Supervisor'),
        ('ACADEMIC_SUP', 'Academic Supervisor'),
        ('COORDINATOR', 'Internship Coordinator'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='STUDENT')
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    organization = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"

# 2. InternshipPlacement Model
class InternshipPlacement(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='placements')
    company_name = models.CharField(max_length=200)
    location = models.CharField(max_length=200, blank=True)
    start_date = models.DateField()
    end_date = models.DateField()
    workplace_supervisor = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, limit_choices_to={'role': 'WORKPLACE_SUP'}, related_name='supervised_interns'
    )
    academic_supervisor = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, limit_choices_to={'role': 'ACADEMIC_SUP'}, related_name='academic_interns'
    )

    def __str__(self):
        return f"{self.student.username} at {self.company_name}"

# 3. WeeklyLog Model
class WeeklyLog(models.Model):
    placement = models.ForeignKey(InternshipPlacement, on_delete=models.CASCADE, related_name='logs')
    week_number = models.PositiveIntegerField()
    activities_performed = models.TextField()
    challenges_faced = models.TextField(blank=True)
    lessons_learned = models.TextField(blank=True)
    date_submitted = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return f"Week {self.week_number} - {self.placement.student.username}"

# 4. EvaluationCriteria Model
class EvaluationCriteria(models.Model):
    name = models.CharField(max_length=100) # e.g., Punctuality, Technical Skill
    max_score = models.IntegerField(default=10)

    def __str__(self):
        return self.name

# 5. Evaluation Model
class Evaluation(models.Model):
    placement = models.ForeignKey(InternshipPlacement, on_delete=models.CASCADE, related_name='evaluations')
    evaluator = models.ForeignKey(User, on_delete=models.CASCADE)
    criteria = models.ForeignKey(EvaluationCriteria, on_delete=models.CASCADE)
    score = models.IntegerField()
    comments = models.TextField(blank=True)
    evaluation_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.criteria.name} score for {self.placement.student.username}"