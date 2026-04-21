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
    student = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name='placements')
    student_no = models.CharField(max_length=20)
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
            )]


class WeeklyLog(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
        ('reviewed', 'Reviewed'),
        ('approved', 'Approved'),
    ]
    placement = models.ForeignKey(
        InternshipPlacement, on_delete=models.CASCADE)
    week_number = models.PositiveIntegerField()
    activities = models.TextField()
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='draft')
    submitted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['placement', 'week_number'],
                name='unique log per placement week'
            )
        ]


class EvaluationCriteria(models.Model):
    name = models.CharField(max_length=100)
    weight = models.DecimalField(max_digits=5, decimal_places=2)


class Evaluation(models.Model):
    placement = models.ForeignKey(
        InternshipPlacement, on_delete=models.CASCADE)
    criteria = models.ForeignKey(EvaluationCriteria, on_delete=models.CASCADE)
    score = models.DecimalField(max_digits=5, decimal_places=2)
    evaluated_by = models.ForeignKey(
        CustomUser, on_delete=models.SET_NULL, null=True)
    evaluated_at = models.DateTimeField(auto_now_add=True)
