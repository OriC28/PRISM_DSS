from django.shortcuts import render

# Create your views here.
def analyze(request):
    return render(request, 'analizar-proyecto.html')
