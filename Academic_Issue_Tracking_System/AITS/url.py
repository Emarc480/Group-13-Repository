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
    assign_issue,
    resolve_issue,
    list_issues,
    issue_detail,
    edit_issue,
    withdraw_issue,
    department_list,
)


urlpatterns = [

    path('', main),
    path('api/login/', login_view, name='login'),
    path('api/register/', AITS_RegisterView.as_view(), name='register'),
    path('api/profile/', profile, name='profile'),
    path('api/departments/', department_list, name='department-list'),

    # Student
    path('api/student/dashboard/', student_dashboard, name='student-dashboard'),
    path('api/student/issues/', submit_issue, name='submit-issue'),
    path('api/student/issues/all/', list_issues, name='list-issues'),
    path('api/student/issues/<int:issue_id>/', issue_detail, name='issue-detail'),
    path('api/studeent/issues/<int:issue_id>/edit/', edit_issue, name='edit-issue'),
    path('api/student/issues/<int:issue_id>/withdraw/', withdraw_issue, name='withdraw-issue'),

    # Lecturer
    path('api/lecturer/dashboard/', lecturer_dashboard, name='lecturer-dashboard'),

    # Registrar
    path('api/registrar/dashboard/', registrar_dashboard, name='registrar-dashboard'),
    path('api/registrar/assign-issue/<int:issue_id>/', assign_issue, name='assign-issue'),
    path('api/registrar/resolve-issue/<int:issue_id>/', resolve_issue, name='resolve-issue'),
]
