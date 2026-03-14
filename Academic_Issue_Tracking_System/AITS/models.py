from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('registrar', 'Academic Registrar'),
        ('lecturer', 'Lecturer'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')
    registration_number = models.CharField(max_length=50, unique=True, null=True, blank=True)

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='aits_users',
        blank=True,
    )

    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='aits_users',
        blank=True,
    )
    
    def __str__(self):
        return f"{self.username} ({self.role})"