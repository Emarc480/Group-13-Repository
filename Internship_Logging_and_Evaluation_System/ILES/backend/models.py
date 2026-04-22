from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

class User(AbstractUser):
    ROLE_CHOICES = [
        ('STUDENT', 'Student'),
        ('WORKPLACE_SUPERVISOR', 'Workplace Supervisor'),
        ('ACADEMIC_SUPERVISOR', 'Academic Supervisor'),
        ('ADMIN', 'Internship Administrator'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='STUDENT')

class InternshipPlacement(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='placements')
    organization_name = models.CharField(max_length=255) 
    supervisor_name = models.CharField(max_length=255, default="TBD")
    start_date = models.DateField(default=timezone.now)
    end_date = models.DateField(default=timezone.now)

    class Meta:
        # Week 3 Task: Constraint - unique relationship
        unique_together = ('student', 'organization_name')

    def __str__(self):
        return f"{self.student.username} at {self.organization_name}"

class WeeklyLog(models.Model):
    STATUS_CHOICES = [
        ('DRAFT', 'Draft'),
        ('SUBMITTED', 'Submitted'),
        ('REVIEWED', 'Reviewed'),
        ('APPROVED', 'Approved'),
    ]
    placement = models.ForeignKey(InternshipPlacement, on_delete=models.CASCADE)
    week_number = models.PositiveIntegerField() # Week 3 Task: Data constraint
    content = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='DRAFT')
    created_at = models.DateTimeField(default=timezone.now) 
    is_verified = models.BooleanField(default=False)

    class Meta:
        # Week 3 Task: Constraint - No duplicate weeks per placement
        unique_together = ('placement', 'week_number')

    def __str__(self):
        return f"Week {self.week_number} - {self.placement.student.username}"

class EvaluationCriteria(models.Model):
    name = models.CharField(max_length=100)
    max_score = models.IntegerField()

    def __str__(self):
        return self.name

class Evaluation(models.Model):
    placement = models.ForeignKey(InternshipPlacement, on_delete=models.CASCADE)
    criteria = models.ForeignKey(EvaluationCriteria, on_delete=models.CASCADE)
    score = models.IntegerField()
    comments = models.TextField(blank=True, null=True)