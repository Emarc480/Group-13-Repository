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
)


urlpatterns = [

    path('', main),
    path('api/login/', login_view, name='login'),
    path('api/register/', AITS_RegisterView.as_view(), name='register'),
    path('api/profile/', profile, name='profile'),

    # Student
    path('api/student/dashboard/', student_dashboard, name='student-dashboard'),
    path('api/student/submit_issue/', submit_issue, name='submit-issue'),

    # Lecturer
    path('api/lecturer/dashboard/', lecturer_dashboard, name='lecturer-dashboard'),

    # Registrar
    path('api/registrar/dashboard/', registrar_dashboard, name='registrar-dashboard'),
    path('api/registrar/assign-issue/<int:issue_id>/', assign_issue, name='assign-issue'),
    path('api/registrar/resolve-issue/<int:issue_id>/', resolve_issue, name='resolve-issue'),
]
    # path('register/', AITS_RegisterView.as_view(), name='aits_register')