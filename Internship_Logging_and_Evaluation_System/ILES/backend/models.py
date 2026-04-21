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
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    organization = models.CharField(max_length=100, blank=True, null=True)

class InternshipPlacement(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='placements')
    company_name = models.CharField(max_length=200)
    start_date = models.DateField()
    end_date = models.DateField()
    workplace_supervisor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='supervised_interns')

class WeeklyLog(models.Model):
    placement = models.ForeignKey(InternshipPlacement, on_delete=models.CASCADE, related_name='logs')
    week_number = models.PositiveIntegerField()
    activities_performed = models.TextField()
    date_submitted = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(default=False)

class Evaluation(models.Model):
    placement = models.ForeignKey(InternshipPlacement, on_delete=models.CASCADE)
    evaluator = models.ForeignKey(User, on_delete=models.CASCADE)
    score = models.IntegerField()
    comments = models.TextField(blank=True)    