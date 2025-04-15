from django.shortcuts import render
from .forms import FormAnalyze
from .utils.get_database_data import get_data
from .services.api import get_IAresponse
import json

# Create your views here.
def show_form(request):
    ia_response = {}
    if request.method == 'POST':
        form = FormAnalyze(request.POST)
        if form.is_valid():
            db_data = json.dumps(get_data(form.cleaned_data['project_type']))
            form_data = form.cleaned_data
            ia_response = get_IAresponse(form_data, db_data)
    else:   
        form = FormAnalyze()

    return render(request, 'analizar-proyecto.html', {'form':form, 'active_page': 'analizar-proyecto', 'data': ia_response})
