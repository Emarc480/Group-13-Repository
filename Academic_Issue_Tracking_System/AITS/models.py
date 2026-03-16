from django.contrib.auth.models import AbstractUser
from django.db import models


class Department(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=10)

    def __str__(self):
        return self.name


class User(AbstractUser):
    ROLE_CHOICES = [
        ('student', 'Student'),
        ('lecturer', 'Lecturer'),
        ('hod', 'Head of Department'),
        ('registrar', 'Academic Registrar'),
    ]
    role = models.CharField(
        max_length=20, choices=ROLE_CHOICES, default='student')
    student_number = models.CharField(max_length=20, blank=True, null=True)
    department = models.ForeignKey(
        Department, on_delete=models.SET_NULL, null=True, blank=True)
    registration_number = models.CharField(
        max_length=50, unique=True, null=True, blank=True)

    def __str__(self):
        return f"{self.username} ({self.role})"

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


class Issue(models.Model):
    CATEGORY_CHOICES = [
        ('missing_marks', 'Missing Marks'),
        ('appeal', 'Appeal'),
        ('correction', 'Correction'),
    ]
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    ]

    student = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='issues')
    assigned_to = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_issues')
    department = models.ForeignKey(
        Department, on_delete=models.SET_NULL, null=True)
    course_code = models.CharField(max_length=20)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='open')
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.course_code} - {self.category} ({self.status})"


class AuditLog(models.Model):
    issue = models.ForeignKey(
        Issue, on_delete=models.CASCADE, related_name='logs')
    performed_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True)
    action = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.issue} - {self.action} at {self.timestamp}"
