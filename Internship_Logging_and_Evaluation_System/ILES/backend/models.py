from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('STUDENT', 'Student'),
        ('WORKPLACE_SUP', 'Workplace Supervisor'),
        ('ACADEMIC_SUP', 'Academic Supervisor'),
        ('COORDINATOR', 'Internship Coordinator'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='STUDENT')

class InternshipPlacement(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='placements')
    company_name = models.CharField(max_length=200)
    start_date = models.DateField()
    end_date = models.DateField()

class WeeklyLog(models.Model):
    placement = models.ForeignKey(InternshipPlacement, on_delete=models.CASCADE, related_name='logs')
    week_number = models.PositiveIntegerField()
    activities = models.TextField()
    is_verified = models.BooleanField(default=False)

class EvaluationCriteria(models.Model):
    name = models.CharField(max_length=100)
    max_score = models.IntegerField(default=10)

class Evaluation(models.Model):
    placement = models.ForeignKey(InternshipPlacement, on_delete=models.CASCADE)
    evaluator = models.ForeignKey(User, on_delete=models.CASCADE)
    criteria = models.ForeignKey(EvaluationCriteria, on_delete=models.CASCADE)
    score = models.IntegerField()