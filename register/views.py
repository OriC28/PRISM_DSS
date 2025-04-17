from django.shortcuts import render
from .forms import RegisterProject
# Create your views here.

def register(request):
    form = RegisterProject()
    return render(request, 'registrar-proyecto.html', {'form': RegisterProject()})