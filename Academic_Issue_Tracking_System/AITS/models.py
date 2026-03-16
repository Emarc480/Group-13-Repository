from django.db import models

# Create your models here.
class Registra(models.Model):
    staff_no = models.IntegerField()
    name = models.CharField(max_length=23)
    email = models.CharField()

    def __str__(self):
        return (self.staff_no + self.name)


class Lecturer(models.Model):
    staff_no = models.IntegerField()
    name = models.CharField(max_length=25)
    email = models.CharField()

    def __str__(self):
        return (self.staff_no + self.name)
    
class Student(models.Model):
    student_no = models.IntegerField()
    name = models.CharField(max_length=27)
    email = models.CharField()

    def ___str__(self):
        return (self.student_no + self.name)