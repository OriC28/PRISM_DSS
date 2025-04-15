from django.urls import path
from . import views

urlpatterns = [
    path('analizar-proyecto/', views.show_form, name='show_form')
]