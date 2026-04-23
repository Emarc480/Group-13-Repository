from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from django.core.exceptions import ValidationError
from datetime import timedelta

class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('student', 'Student_Intern'),
        ('workplace_supervisor', 'Workplace_Supervisor'),
        ('academic_supervisor', 'Academic_Supervisor'),
        ('intern_admin', 'Internship_Administrator'),
    ]
    role = models.CharField(max_length=30, choices=ROLE_CHOICES, default='student')

class InternshipPlacement(models.Model):
    student = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='placements')
    student_no = models.CharField(max_length=20, default="0")
    company_name = models.CharField(max_length=255)
    start_date = models.DateField(default=timezone.now)
    end_date = models.DateField(default=timezone.now)
    workplace_supervisor = models.ForeignKey(
        CustomUser, on_delete=models.SET_NULL, null=True, related_name='supervised_placements'
    )

    class Meta:
        constraints = [
            models.CheckConstraint(
                condition=models.Q(end_date__gt=models.F('start_date')),
                name='end_after_start'
            )
        ]
        unique_together = ('student', 'company_name')

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
        return f"{self.student.username} at {self.company_name}"

class WeeklyLog(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
        ('approved', 'Approved'),
    ]
    placement = models.ForeignKey(InternshipPlacement, on_delete=models.CASCADE, related_name='logs')
    week_number = models.PositiveIntegerField()
    activities = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    submitted_at = models.DateTimeField(null=True, blank=True)
    is_verified = models.BooleanField(default=False)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['placement', 'week_number'],
                name='unique log per placement week'
            )
        ]

    def clean(self):
        if self.pk:
            original = WeeklyLog.objects.get(pk=self.pk)
            if original.status == 'approved':
                raise ValidationError("Cannot edit log after approval.")

        if self.status == 'submitted':
            deadline = self.placement.start_date + timedelta(weeks=self.week_number) + timedelta(days=7)
            if timezone.now().date() > deadline:
                raise ValidationError("Submission deadline has passed.")

    def save(self, *args, **kwargs):
        if self.status == 'submitted' and not self.submitted_at:
            self.submitted_at = timezone.now()
        self.full_clean()
        super().save(*args, **kwargs)

class EvaluationCriteria(models.Model):
    name = models.CharField(max_length=100)
    max_score = models.IntegerField(default=10)
    weight = models.DecimalField(max_digits=5, decimal_places=2, default=1.0)

class Evaluation(models.Model):
    placement = models.ForeignKey(InternshipPlacement, on_delete=models.CASCADE)
    criteria = models.ForeignKey(EvaluationCriteria, on_delete=models.CASCADE)
    score = models.DecimalField(max_digits=5, decimal_places=2)
    evaluated_by = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True)
    evaluated_at = models.DateTimeField(auto_now_add=True)
    comments = models.TextField(blank=True, null=True)