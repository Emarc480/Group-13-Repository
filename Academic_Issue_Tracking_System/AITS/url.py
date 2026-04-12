from django.urls import path
from .views import AITS_RegisterView
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
)

urlpatterns = [
    # General & Home
    path('', main),
    path('register/', AITS_RegisterView.as_view(), name='aits_register'),
    path('api/login/', login_view, name='login'),
    
    # Student Dash & Actions
    path('api/student/dashboard/', student_dashboard, name='student-dashboard'),
    path('api/student/issues/', submit_issue, name='submit-issue'),
    path('api/student/issues/all/', list_issues, name='list-issues'),
    path('api/student/issues/<int:issue_id>/', issue_detail, name='issue-detail'),
    path('api/studeent/issues/<int:issue_id>/edit/', edit_issue, name='edit-issue'),
    path('api/student/issues/<int:issue_id>/withdraw/', withdraw_issue, name='withdraw-issue'),

    # Lecturer
    path('api/lecturer/dashboard/', lecturer_dashboard, name='lecturer-dashboard'),
    
    # Academic Registrar Dashboard & Management (THE FIX)
    path('api/registrar/dashboard/', registrar_dashboard, name='registrar-dashboard'),
    path('api/registrar/all-issues/', registrar_all_issues, name='registrar-all-issues'),
    path('api/registrar/update-issue/<int:issue_id>/', registrar_update_issue, name='registrar-update'),
]
