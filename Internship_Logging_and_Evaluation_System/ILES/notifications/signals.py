from django.db.models.signals import post_save
from django.dispatch import receiver
from backend.models import InternshipPlacement, WeeklyLog, ReviewComment
from .models import Notification


@receiver(post_save, sender=InternshipPlacement)
def notify_internship_assigned(sender, instance, created, **kwargs):
    if created:
        Notification.objects.create(
            recipient=instance.student,
            notification_type='internship_assigned',
            title='Internship Assigned',
            message=f"You have been assigned to {instance.company_name}. "
                    f"Duration: {instance.start_date} to {instance.end_date}.",
            related_object_id=instance.id,
            related_object_type='InternshipPlacement'
        )


@receiver(post_save, sender=WeeklyLog)
def notify_log_submitted(sender, instance, **kwargs):
    if instance.status == 'submitted':
        supervisor = instance.placement.workplace_supervisor
        if supervisor:
            Notification.objects.create(
                recipient=supervisor,
                notification_type='log_submitted',
                title='New Log Submitted',
                message=f"{instance.placement.student.get_full_name() or instance.placement.student.username} "
                        f"submitted Week {instance.week_number} log.",
                related_object_id=instance.id,
                related_object_type='WeeklyLog'
            )


@receiver(post_save, sender=ReviewComment)
def notify_log_reviewed(sender, instance, created, **kwargs):
    if created and instance.action in ['approved', 'rejected']:
        student = instance.log.placement.student
        Notification.objects.create(
            recipient=student,
            notification_type=f"log_{instance.action}",
            title=f"Log {instance.action.capitalize()}",
            message=f"Your Week {instance.log.week_number} log has been "
                    f"{instance.action} by {instance.reviewer.get_full_name() or instance.reviewer.username}.",
            related_object_id=instance.log.id,
            related_object_type='WeeklyLog'
        )