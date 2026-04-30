from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
from django.utils import timezone

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
    student_no = models.CharField(default="0", max_length=20)
    company_name = models.CharField(max_length=45)
    start_date = models.DateField()
    end_date = models.DateField()
    workplace_supervisor = models.ForeignKey(
        CustomUser, on_delete=models.SET_NULL, null=True, related_name='supervised_placements')

    class Meta:
        constraints = [
            models.CheckConstraint(
                condition=models.Q(end_date__gt=models.F('start_date')),
                name='end_after_start'
            )
        ]

    def clean(self):
        if self.start_date and self.end_date:
            if self.start_date > self.end_date:
                raise ValidationError("Start date cannot be greater than end date.")

            overlapping_placements = InternshipPlacement.objects.filter(
                student=self.student,
                start_date__lte=self.end_date,
                end_date__gte=self.start_date
            ).exclude(pk=self.pk)

            if overlapping_placements.exists():
                raise ValidationError(
                    "This student already has an internship placement that overlaps with these dates."
                )

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

class WeeklyLog(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
        ('reviewed', 'Reviewed'),
        ('approved', 'Approved'),
    ]
    placement = models.ForeignKey(InternshipPlacement, on_delete=models.CASCADE)
    week_number = models.PositiveIntegerField()
    activities = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    submitted_at = models.DateTimeField(null=True, blank=True)
    deadline = models.DateField(null=True, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['placement', 'week_number'],
                name='unique_log_per_placement_week'
            )
        ]

    def is_editable(self):
        if self.status == 'approved':
            return False
        
        if self.deadline and timezone.now().date() > self.deadline:
            return False
        
        return True
    
    def clean(self):
        if not self.is_editable() and self.pk:
            raise ValidationError("this log can nolonger be edited")


class EvaluationCriteria(models.Model):
    name = models.CharField(max_length=100)
    weight = models.DecimalField(max_digits=5, decimal_places=2)

class Evaluation(models.Model):
    placement = models.ForeignKey(InternshipPlacement, on_delete=models.CASCADE)
    criteria = models.ForeignKey(EvaluationCriteria, on_delete=models.CASCADE)
    score = models.DecimalField(max_digits=5, decimal_places=2)
    evaluated_by = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True)
    evaluated_at = models.DateTimeField(auto_now_add=True)

class ReviewComment(models.Model):
    log = models.ForeignKey(WeeklyLog, on_delete=models.CASCADE, related_name='comments')
    reviewer = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True)
    comment = models.TextField()
    action = models.CharField(max_length=20, choices=[
        ('reviewed', 'Reviewed'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ])
    created_at = models.DateTimeField(auto_now_add=True)