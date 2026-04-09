from django.contrib import admin
from .models import User, Department, Issue, AuditLog

# Register your models here.

admin.site.register(User)
admin.site.register(Department)
admin.site.register(Issue)
admin.site.register(AuditLog)