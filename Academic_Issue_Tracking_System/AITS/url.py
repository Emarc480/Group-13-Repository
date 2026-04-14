from django.urls import path
from .views import (
    AITS_RegisterView,
    main,
    login_view,
    student_dashboard,
    lecturer_dashboard,
    registrar_dashboard,
    profile,
    submit_issue,
    list_issues,
    issue_detail,
    edit_issue,
    withdraw_issue,
    department_list,
    registrar_all_issues,
    registrar_update_issue,
)

urlpatterns = [
    # General & Home
    path('', main),
    path('register/', AITS_RegisterView.as_view(), name='aits_register'),
    path('api/login/', login_view, name='login'),
    path('api/register/', AITS_RegisterView.as_view(), name='register'),
    path('api/profile/', profile, name='profile'),
    path('api/departments/', department_list, name='department-list'),

    # Student
    path('api/student/dashboard/', student_dashboard, name='student-dashboard'),
    path('api/student/issues/', submit_issue, name='submit-issue'),
    path('api/student/issues/all/', list_issues, name='list-issues'),
    path('api/student/issues/<int:issue_id>/', issue_detail, name='issue-detail'),
    path('api/student/issues/<int:issue_id>/edit/', edit_issue, name='edit-issue'),
    path('api/student/issues/<int:issue_id>/withdraw/', withdraw_issue, name='withdraw-issue'),

    # Lecturer
    path('api/lecturer/dashboard/', lecturer_dashboard, name='lecturer-dashboard'),

    # Registrar
    path('api/registrar/dashboard/', registrar_dashboard, name='registrar-dashboard'),
    path('api/registrar/all-issues/', registrar_all_issues, name='registrar-all-issues'),
    path('api/registrar/update-issue/<int:issue_id>/', registrar_update_issue, name='registrar-update'),
]