from django.urls import path
from . import views

urlpatterns = [
    path('registrar-proyecto/', views.register, name='registrar-proyecto'),
]