from django.contrib import admin

# Register your models here.
from .models import Registra, Lecturer, Student

admin.site.register(Registra)
admin.site.register(Lecturer)
admin.site.register(Student)
