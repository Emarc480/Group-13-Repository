from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('student', 'Student_Intern'),
        ('workplace_supervisor', 'Workplace_Supervisor'),
        ('academic_supervisor', 'Academic_Supervisor'),
        ('intern_admin', 'Internship_Administrator'),
    ]
    role = models.CharField(max_length=30, choices=ROLE_CHOICES)

class InternshipPlacement(models.Model):
    student = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='placements')
    student_no = models.IntegerField(max_length=20)
    company_name = models.CharField(max_length=45)
    start_date = models.DateField()
    end_date = models.DateField()
    workplace_supervisor = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, related_name='supervised_placements')