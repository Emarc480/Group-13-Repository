from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import User, Department, Issue

class IssueSubmissionTests(TestCase):

    def setUp(self):
        self.department = Department.objects.create(
            name="Computer Science", code="CS")
        
        self.student = User.objects.create_user(
            username="student1",
            password="test123",
            role="student",
            student_number="22/U/001")
        
        self.other_student = User.objects.create_user(
            username="student2",
            password="test123",
            role="student",
            student_number="22/U/002")
        
        self.client = APIClient()

        response = self.client.post(reverse('login'), {
            'username': 'student1',
            'password': 'test123'
        })
        self.token = response.data['token']
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)

    def test_student_can_submit_issue(self):
        response = self.client.post(reverse('submit-issue'), {
            'department': self.department.id,
            'course_code': 'CSC1100',
            'category': 'missing_marks',
            'description': 'My marks for the midterm exam are missing. Please look into this issue as soon as possible.'
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Issue.objects.count(), 1)

    def test_issue_status_defaults_to_open(self):
        self.client.post(reverse('submit-issue'), {
            'department': self.department.id,
            'course_code': 'CSC1100',
            'category': 'missing_marks',
            'description': 'My marks for the midterm exam are missing. Please look into this issue as soon as possible.'
        })
        issue = Issue.objects.first()
        self.assertEqual(issue.status, 'open')

    def test_student_can_list_their_issues(self):
        Issue.objects.create(
            student=self.student,
            department=self.department,
            course_code='CSC1100',
            category='missing_marks',
            description='My marks for the midterm exam are missing. Please look into this issue as soon as possible.',
            status='open'
        )
        response = self.client.get(reverse('list-issues'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_student_cannot_see_other_students_issues(self):
        Issue.objects.create(
            student=self.other_student,
            department=self.department,
            course_code='CSC1100',
            category='missing_marks',
            description='My marks for the midterm exam are missing. Please look into this issue as soon as possible.',
            status='open'
        )
        response = self.client.get(reverse('list-issues'))
        self.assertEqual(len(response.data), 0)

    def test_student_can_withdraw_open_issue(self):
        issue = Issue.objects.create(
            student=self.student,
            department=self.department,
            course_code='CSC1100',
            category='missing_marks',
            description='My marks for the midterm exam are missing. Please look into this issue as soon as possible.',
            status='open'
        )
        response = self.client.delete(
            reverse('withdraw-issue', args=[issue.id])
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Issue.objects.count(), 0)

    def test_student_cannot_withdraw_resolved_issue(self):
        issue = Issue.objects.create(
            student=self.student,
            department=self.department,
            course_code='CSC1100',
            category='missing_marks',
            description='My marks for the midterm exam are missing. Please look into this issue as soon as possible.',
            status='resolved'
        )
        response = self.client.delete(
            reverse('withdraw-issue', args=[issue.id])
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_description_too_short_is_rejected(self):
        response = self.client.post(reverse('submit-issue'), {
            'department': self.department.id,
            'course_code': 'CSC1100',
            'category': 'missing_marks',
            'description': 'Too short'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)