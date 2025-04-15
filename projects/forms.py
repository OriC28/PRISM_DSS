from django import forms
from shared.models.dss_models import TipoProyecto

class FormAnalyze(forms.Form):
    project_name = forms.CharField(
        label="Nombre de Proyecto",
        required=True,
        max_length=255, 
        error_messages={
            'required': 'Este campo es obligatorio', 
            'max_length': 'El nombre del proyecto no puede exceder los 255 caracteres'
            }
        )
    project_type = forms.ChoiceField(
        label="Tipo de Proyecto", 
        required=True, 
        choices=[
            ('Residencial', 'Residencial'),
            ('Comercial', 'Comercial'),
            ('Industrial', 'Industrial'),
            ('Infraestructura', 'Infraeustructura'),
            ('Institucional', 'Institucional')
        ],
        initial='Residencial',
        error_messages={'required': 'Este campo es obligatorio'}
    )

    project_function = forms.CharField(
        label="Función o Uso", 
        required=True,
        max_length=100,
        min_length=4,
        error_messages={
            'required': 'Este campo es obligatorio',
            'max_length': 'La función o uso no puede exceder los 100 caracteres',
            'min_length': 'La función o uso debe tener al menos 4 caracteres'
        }
    )
    estimate = forms.FloatField(
        label="Presupuesto (USD)",
        required=True,
        error_messages={
            'required': 'Este campo es obligatorio',
            'invalid': 'El presupuesto debe ser un número válido'
        }
    )
    time = forms.IntegerField(
        label="Tiempo Estimado (Meses)",
        required=True,
        min_value=1,

        error_messages={
            'required': 'Este campo es obligatorio',
            'min_value': 'El tiempo estimado debe ser al menos 1 mes',
            'invalid': 'El tiempo estimado debe ser un número entero válido'
        }
    )
    project_description = forms.CharField(
        label="Descripción",
        required=True,
        max_length=255,   
        widget=forms.Textarea,
        error_messages={
            'required': 'Este campo es obligatorio',
            'max_length': 'La descripción no puede exceder los 255 caracteres'
        }
    )