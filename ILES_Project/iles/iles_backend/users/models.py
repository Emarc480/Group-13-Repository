from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # Define role choices based on the ILES Core Roles
    ROLE_CHOICES = (
        ('STUDENT', 'Student Intern'),
        ('WORKPLACE_SUP', 'Workplace Supervisor'),
        ('ACADEMIC_SUP', 'Academic Supervisor'),
        ('ADMIN', 'Internship Administrator'),
    )
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='STUDENT')
    phone_number = models.CharField(max_length=15, blank=True, null=True)

    def __str__(self):
        return f"{self.username} ({self.role})"