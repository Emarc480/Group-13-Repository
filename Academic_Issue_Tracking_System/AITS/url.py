from django.urls import path
from .views import AITS_RegisterView
from .views import (
    main, login_view, student_dashboard, 
    lecturer_dashboard, registrar_dashboard,
    registrar_all_issues, registrar_update_issue, # These must exist in views.py
    submit_issue # Ensure this matches your fixed POST view
)

urlpatterns = [
    # General & Home
    path('', main),
    path('register/', AITS_RegisterView.as_view(), name='aits_register'),
    path('api/login/', login_view, name='login'),
    
    # Student Dash & Actions
    path('api/student/dashboard/', student_dashboard, name='student-dashboard'),
    path('api/student/submit-issue/', submit_issue, name='submit-issue'),
    
    # Lecturer Dash
    path('api/lecturer/dashboard/', lecturer_dashboard, name='lecturer-dashboard'),
    
    # Academic Registrar Dashboard & Management (THE FIX)
    path('api/registrar/dashboard/', registrar_dashboard, name='registrar-dashboard'),
    path('api/registrar/all-issues/', registrar_all_issues, name='registrar-all-issues'),
    path('api/registrar/update-issue/<int:issue_id>/', registrar_update_issue, name='registrar-update'),
]
    # path('register/', AITS_RegisterView.as_view(), name='aits_register')