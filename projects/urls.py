from django.urls import path
from . import views

urlpatterns = [
    path('analizar-proyecto/', views.analyze)
]
