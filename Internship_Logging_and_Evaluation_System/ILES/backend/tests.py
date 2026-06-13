from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from .models import CustomUser, InternshipPlacement, WeeklyLog
from datetime import date, timedelta

class ILESTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.student = CustomUser.objects.create_user(
            username='teststudent',
            password='Test1234!',
            email='student@test.com',
            role='student',
            first_name='Test',
            last_name='Student'
        )

        self.supervisor = CustomUser.objects.create_user(
            username='testsupervisor',
            password='Test1234!',
            email='supervisor@test.com',
            role='workplace_supervisor',
            first_name='Test',
            last_name='Supervisor'
        )

        self.admin = CustomUser.objects.create_user(
            username='testadmin',
            password='Test1234!',
            email='admin@test.com',
            role='intern_admin',
            first_name='Test',
            last_name='Admin'
        )

        self.placement = InternshipPlacement.objects.create(
            student=self.student,
            student_no='2022/HD07/1234',
            company_name='Test Company',
            start_date=date.today() - timedelta(weeks=4),
            end_date=date.today() + timedelta(weeks=8),
            workplace_supervisor=self.supervisor
        )

    def get_student_token(self):
        response = self.client.post('/api/auth/login/', {
            'username': 'teststudent',
            'password': 'Test1234!'
        }, format='json')
        return response.data['access']

    def get_supervisor_token(self):
        response = self.client.post('/api/auth/login/', {
            'username': 'testsupervisor',
            'password': 'Test1234!'
        }, format='json')
        return response.data['access']

    def get_admin_token(self):
        response = self.client.post('/api/auth/login/', {
            'username': 'testadmin',
            'password': 'Test1234!'
        }, format='json')
        return response.data['access']

    # Test 1 - Register
    def test_user_registration(self):
        response = self.client.post('/api/auth/register/', {
            'username': 'newstudent',
            'password': 'Test1234!',
            'email': 'new@test.com',
            'role': 'student',
            'first_name': 'New',
            'last_name': 'Student'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    # Test 2 - Login
    def test_user_login(self):
        response = self.client.post('/api/auth/login/', {
            'username': 'teststudent',
            'password': 'Test1234!'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)

    # Test 3 - Me endpoint
    def test_me_endpoint(self):
        token = self.get_student_token()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        response = self.client.get('/api/auth/me/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'teststudent')
        self.assertEqual(response.data['role'], 'student')

    # Test 4 - Create log
    def test_student_can_create_log(self):
        token = self.get_student_token()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        response = self.client.post('/api/logs/', {
            'placement': self.placement.id,
            'week_number': 1,
            'activities': 'Attended orientation.',
            'status': 'draft'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['status'], 'draft')

    # Test 5 - Submit log
    def test_student_can_submit_log(self):
        token = self.get_student_token()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        log = WeeklyLog.objects.create(
            placement=self.placement,
            week_number=2,
            activities='Week 2 activities.',
            status='draft'
        )
        response = self.client.post(f'/api/logs/{log.id}/submit/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        log.refresh_from_db()
        self.assertEqual(log.status, 'submitted')

    # Test 6 - Recall log
    def test_student_can_recall_log(self):
        token = self.get_student_token()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        log = WeeklyLog.objects.create(
            placement=self.placement,
            week_number=3,
            activities='Week 3 activities.',
            status='submitted'
        )
        response = self.client.post(f'/api/logs/{log.id}/recall/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        log.refresh_from_db()
        self.assertEqual(log.status, 'draft')

    # Test 7 - Block approved log edit
    def test_cannot_edit_approved_log(self):
        token = self.get_student_token()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        log = WeeklyLog.objects.create(
            placement=self.placement,
            week_number=4,
            activities='Week 4 activities.',
            status='approved'
        )
        response = self.client.patch(f'/api/logs/{log.id}/', {
            'activities': 'Trying to edit approved log.'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # Test 8 - Deadline enforcement
    def test_cannot_submit_after_deadline(self):
        token = self.get_student_token()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        log = WeeklyLog.objects.create(
            placement=self.placement,
            week_number=10,
            activities='Late submission.',
            status='draft',
<<<<<<< HEAD
            deadline=date(2020, 1, 1)
        )
        response = self.client.post(f'/api/logs/{log.id}/submit/', format='json')
=======
            deadline=date.today() - timedelta(days=1)
        )
        response = self.client.post(f'/api/logs/{log.id}/submit/')
>>>>>>> arnold-backend
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # Test 9 - Permission check
    def test_supervisor_cannot_create_log(self):
        token = self.get_supervisor_token()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        response = self.client.post('/api/logs/', {
            'placement': self.placement.id,
            'week_number': 5,
            'activities': 'Supervisor trying to create log.',
            'status': 'draft'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # Test 10 - Student filter
    def test_student_only_sees_own_logs(self):
        token = self.get_student_token()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        WeeklyLog.objects.create(
            placement=self.placement,
            week_number=6,
            activities='My log.',
            status='draft'
        )
        response = self.client.get('/api/logs/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        for log in response.data:
            self.assertEqual(log['placement'], self.placement.id)