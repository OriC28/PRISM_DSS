from django.shortcuts import render, redirect,HttpResponse
from django.contrib import messages
from django.contrib.auth import authenticate, login as login_user, logout as logout_user
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from .forms import LoginForm

# Create your views here.
def login(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            username = request.POST.get('username')
            password = request.POST.get('password')
            
            user = authenticate(request, username=username, password=password)
            if user is None:
                messages.error(request, 'Contraseña incorrecta.')
                return render(request, 'login.html', {'form': form})
            login_user(request, user)
            return redirect('/dashboard')
        else:
            return render(request, 'login.html',{'form': form})
    return render(request, 'login.html',{'form': LoginForm()})
def logout(request):
    if request.method == 'POST':
        logout_user(request)
    return redirect('/login')