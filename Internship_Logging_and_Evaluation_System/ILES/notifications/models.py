from django.db import models
from django.conf import settings


class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ('log_submitted', 'Intern Submitted Log'),
        ('log_approved', 'Log Approved'),
        ('log_rejected', 'Log Rejected'),
        ('internship_assigned', 'New Internship Assigned'),
        ('deadline_reminder', 'Deadline Reminder'),
        ('admin_announcement', 'Admin Announcement'),
    ]

    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    notification_type = models.CharField(max_length=50, choices=NOTIFICATION_TYPES)
    title = models.CharField(max_length=255)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    related_object_id = models.PositiveIntegerField(null=True, blank=True)
    related_object_type = models.CharField(max_length=50, null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.recipient} | {self.notification_type}"