from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from django.core.exceptions import ValidationError
from datetime import timedelta

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
        unique_together = ('student', 'organization_name')

    def clean(self):
        if self.start_date and self.end_date and self.start_date >= self.end_date:
            raise ValidationError("End date must be after the start date.")
        
        overlapping = InternshipPlacement.objects.filter(
            student=self.student,
            start_date__lt=self.end_date,
            end_date__gt=self.start_date
        )
        if self.pk:
            overlapping = overlapping.exclude(pk=self.pk)
        if overlapping.exists():
            raise ValidationError("This student has an overlapping placement.")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.student.username} at {self.organization_name}"

class WeeklyLog(models.Model):
    STATUS_CHOICES = [
        ('DRAFT', 'Draft'),
        ('SUBMITTED', 'Submitted'),
        ('APPROVED', 'Approved'),
    ]
    placement = models.ForeignKey(InternshipPlacement, on_delete=models.CASCADE)
    week_number = models.PositiveIntegerField()
    content = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='DRAFT')
    created_at = models.DateTimeField(default=timezone.now) 
    is_verified = models.BooleanField(default=False)

    class Meta:
        unique_together = ('placement', 'week_number')

    def clean(self):
        if self.pk:
            original = WeeklyLog.objects.get(pk=self.pk)
            if original.status == 'APPROVED':
                raise ValidationError("Cannot edit log after approval.")

        if self.status == 'SUBMITTED':
            deadline = self.placement.start_date + timedelta(weeks=self.week_number) + timedelta(days=7)
            if timezone.now().date() > deadline:
                raise ValidationError("Submission deadline has passed.")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

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