from django.views.decorators.http import require_POST
from django.http import JsonResponse
from django.shortcuts import render
from .forms import FormAnalyze
import json

from .utils.get_database_data import get_data
from .services.api import get_IAresponse

# Create your views here.

def show_form(request):
    """"
    Render the form for analyzing a project.

    Attributes:
        request (HttpRequest): The HTTP request object.
    """
    form = FormAnalyze(request.GET or None)
    return render(request, 'analizar-proyecto.html', {'form':form, 'active_page': 'analizar-proyecto'})

@require_POST 
def process_data(request):
    """
    Process the data from the form and return a JSON response with the anaylisis result.
    
    Attributes:
        request (HttpRequest): The HTTP request object containing the form data.
    """
    # Check if the request method is POST
    if request.method != 'POST':
        return JsonResponse({
            'success': False,
            'error': ['Método no permitido']
            }, status=405)

    form = FormAnalyze(request.POST)

    # Check if the form is valid
    if not form.is_valid():
        return JsonResponse({
            'success': False,
            'errors': form.errors.get_json_data(),
            'non_field_errors': form.non_field_errors()
            }, status=400)
    
    try:
        # Convert to JSON format
        db_data = json.dumps(get_data(form.cleaned_data['project_type'])) 
        form_data = form.cleaned_data
        # Get the IA response from the API
        response = get_IAresponse(form_data, db_data)

        return JsonResponse({
            'success': True,
            'data': response
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