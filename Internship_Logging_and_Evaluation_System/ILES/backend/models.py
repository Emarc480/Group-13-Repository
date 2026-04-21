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