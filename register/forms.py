from django import forms
from shared.models.dss_models import TipoProyecto


class RegisterProject(forms.Form):
    
    project_name = forms.CharField(
        label="Nombre de Proyecto*",
        required=True,
        max_length=255,
        widget=forms.TextInput(attrs={
            'id': 'projectName',
            'name': 'projectName',
            }
            ),
        error_messages={
            'required': 'Este campo es obligatorio',
            'max_length': 'El nombre del proyecto no puede exceder los 255 caracteres'
        }
    )
    
    project_type = forms.ChoiceField(
        label="Tipo de Proyecto*", 
        required=True, 
        widget=forms.Select(attrs={
            'id': 'projectType',
            'name': 'projectType',
            }
            ),
        choices=[
            ('Residencial', 'Residencial'),
            ('Comercial', 'Comercial'),
            ('Industrial', 'Industrial'),
            ('Infraestructura', 'Infraeustructura'),
            ('Institucional', 'Institucional')
        ],
        initial='Seleccionar...',
        error_messages={'required': 'Este campo es obligatorio'}
    )
    
    project_status = forms.ChoiceField(
        label="Estado del Proyecto*",
        required=True,
        widget=forms.Select(attrs={
            'id': 'projectStatus',
            'name': 'projectStatus',
            }
            ),
        choices=[
            ('En planificación', 'En planificación'),
            ('En ejecución', 'En ejecución'),
            ('Suspendido', 'Suspendido'),
            ('Completado', 'Completado'),
        ],
        initial='Seleccionar...',
        error_messages={'required': 'Este campo es obligatorio'}
    )
    
    project_budget = forms.FloatField(
        label="Presupuesto*",
        required=True,
        widget=forms.NumberInput(attrs={
            'id': 'projectBudget',
            'name': 'projectBudget',
            'min':'0',
            'step':"0.01"
            }
            ),
        error_messages={
            'required': 'Este campo es obligatorio',
            'invalid': 'El presupuesto debe ser un número válido'
        }
    )
    
    project_budget_unit = forms.ChoiceField(
        required=True,
        widget=forms.Select(attrs={
            'id': 'currency',
            'name': 'currency',
            }
            ),
        choices=[
            ('USD', 'USD'),
            ('PEN', 'PEN'),
            ('UER', 'UER'),
            ('VES', 'VES'),
            ('MXN', 'MXN'),
        ],
        initial='Seleccionar...',
        error_messages={'required': 'Este campo es obligatorio'}
    )
    
    project_duration = forms.IntegerField(
        label="Duración Estimada*",
        required=True,
        min_value=1,
        widget=forms.NumberInput(attrs={
            'id': 'projectDuration',
            'name': 'projectDuration',
            }
            ),
        error_messages={
            'required': 'Este campo es obligatorio',
            'min_value': 'La duración estimada debe ser mayor a 1',
            'invalid': 'La duración estimada debe ser un número entero válido'
        }
    )
    
    project_duration_unit = forms.ChoiceField(
        required=True,
        widget=forms.Select(attrs={
            'id': 'durationUnit',
            'name': 'durationUnit',
            }
            ),
        choices=[
            ('Años', 'Años'),
            ('Meses', 'Meses'),
            ('Semanas', 'Semanas'),
            ('Días', 'Días'),
        ],
        initial='Seleccionar...',
        error_messages={'required': 'Este campo es obligatorio'}
    )
    project_location = forms.CharField(
        label="Ubicación Geográfica*",
        required=True,
        max_length=150,
        widget=forms.TextInput(attrs={
            'id': 'projectLocation',
            'name': 'projectLocation',
            }
            ),
        error_messages={
            'required': 'Este campo es obligatorio',
            'max_length': 'La ubicación geográfica no puede exceder los 150 caracteres'
        }
    )
    
    staffCount = forms.IntegerField(
        label="Cantidad de Personal*",
        required=True,
        min_value=0,
        widget=forms.NumberInput(attrs={
            'id': 'staffCount',
            'name': 'staffCount',
            }
            ),
        error_messages={
            'required': 'Este campo es obligatorio',
            'min_value': 'La cantidad de personal debe ser mayor a 1',
            'invalid': 'La cantidad de personal debe ser un número entero válido'
        }
    )
    
    project_description = forms.CharField(
        label="Descripción*",
        required=True,
        max_length=255,
        widget=forms.Textarea(attrs={
            'rows': 4,
            'id':'projectDescription',
            'name':'projectDescription'
            }),
        error_messages={
            'required': 'Este campo es obligatorio',
            'max_length': 'La descripción no puede exceder los 255 caracteres'
        }
    )
    
    # riesgos 
    riskDescription = forms.CharField(
        label="Descripción de Riesgo",
        required=True,
        max_length=255,
        widget=forms.TextInput(attrs={
            'id': 'riskDescription1',
            'name': 'risks[0][description]',
            }
        ),
        error_messages={
            'required': 'Este campo es obligatorio',
            'max_length': 'La descripción no puede exceder los 255 caracteres'
            }
        )
    riskMitigation = forms.CharField(
        label="Descripción de Mitigación",
        required=True,
        max_length=255,
        widget=forms.TextInput(attrs={
            'id': 'riskMitigation1',
            'name': 'risks[0][mitigation]',
            }
        ),
        error_messages={
            'required': 'Este campo es obligatorio',
            'max_length': 'La descripción no puede exceder los 255 caracteres'
            }
        )
    
    riskProbability = forms.ChoiceField(
        label="Probabilidad",
        required=True,
        widget=forms.Select(attrs={
            'id': 'riskProbability1',
            'name': 'risks[0][probability]',
            }
            ),
        choices=[
            ('Baja', 'Baja'),
            ('Media', 'Media'),
            ('Alta', 'Alta'),
        ],
        initial='Seleccionar...',
        error_messages={'required': 'Este campo es obligatorio'}
    )
    
    riskImpact = forms.ChoiceField(
        label="Impacto",
        required=True,
        widget=forms.Select(attrs={
            'id': 'riskImpact1',
            'name': 'risks[0][impact]',
            }
            ),
        choices=[
            ('Bajo', 'Bajo'),
            ('Medio', 'Medio'),
            ('Alto', 'Alto'),
            ('Crítico', 'Crítico'),
        ],
        initial='Seleccionar...',
        error_messages={'required': 'Este campo es obligatorio'}
    )