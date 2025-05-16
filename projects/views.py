from django.shortcuts import render
from django.views.decorators.http import require_POST
from .forms import FormAnalyze
from django.http import JsonResponse
import json

from .utils.get_database_data import get_data
from .services.api import get_IAresponse

# Create your views here.

def show_form(request):
    form = FormAnalyze(request.GET or None)
    return render(request, 'analizar-proyecto.html', {'form':form, 'active_page': 'analizar-proyecto'})

@require_POST
def process_data(request):
    if request.method != 'POST':
        return JsonResponse({
            'success': False,
            'error': ['Método no permitido']
            }, status=405)

    form = FormAnalyze(request.POST)

    if not form.is_valid():
        return JsonResponse({
            'success': False,
            'errors': form.errors.get_json_data(),
            'non_field_errors': form.non_field_errors()
            }, status=400)
    
    try:
        db_data = json.dumps(get_data(form.cleaned_data['project_type']))
        form_data = form.cleaned_data
        ia_response = get_IAresponse(form_data, db_data)

        return JsonResponse({
            'success': True,
            'data': ia_response
        }, status=200)

    except ConnectionError as e:
        return JsonResponse({
            'success': False,
            'error': [str(e)]
            }, status=503)  
    
    except ValueError as e:
        return JsonResponse({
            'success': False,
            'error': [str(e)]
        }, status=502)  
    
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': [str(e)]
        }, status=500)