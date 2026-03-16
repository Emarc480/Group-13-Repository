from django.urls import path
from .views import AITS_RegisterView
from .views import main, login_view, student_dashboard, lecturer_dashboard, registrar_dashboard


urlpatterns = [
    path('', main),
    path('api/login/', login_view, name='login'),
    path('api/student/dashboard/', student_dashboard, name='student-dashboard'),
    path('api/lecturer/dashboard/', lecturer_dashboard, name='lecturer-dashboard'),
    path('api/registrar/dashboard/', registrar_dashboard, name='registrar-dashboard'),
    path('register/', AITS_RegisterView.as_view(), name='aits_register'),
]