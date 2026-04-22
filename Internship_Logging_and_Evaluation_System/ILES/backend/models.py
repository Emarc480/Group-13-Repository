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
    organization_name = models.CharField(max_length=255, default="Pending") 
    supervisor_name = models.CharField(max_length=255, default="TBD")
    start_date = models.DateField()
    end_date = models.DateField()

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
    week_number = models.IntegerField()
    content = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='DRAFT')
    
    created_at = models.DateTimeField(default=timezone.now) 
    is_verified = models.BooleanField(default=False)

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
    
class InternshipPlacement(models.Model):
    # Added 'unique=True' so a student can't be placed in the same spot twice accidentally
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='placements')
    organization_name = models.CharField(max_length=255) # Required (no default)
    
    class Meta:
        # Constraint: A student should only have one active placement at a time
        unique_together = ('student', 'organization_name')

class WeeklyLog(models.Model):
    # ... existing fields ...
    # Constraint: Ensure week_number is always positive and required
    week_number = models.PositiveIntegerField() 
    
    class Meta:
        # Constraint: A placement cannot have two "Week 1" logs
        unique_together = ('placement', 'week_number')