from django.core.validators import RegexValidator
from django import forms


class FormAnalyze(forms.Form):
    """Form to analyze a project based on its name, type, function, budget, time and description."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        groups = {
            "Residencial": [
                ("Vivienda unifamiliar", "Vivienda unifamiliar"),
                ("Apartamentos", "Apartamentos (Multifamiliar)"),
                ("Conjuntos residenciales", "Conjuntos residenciales"),
            ],
            "Comercial": [
                ("Centro comercial", "Centro comercial"),
                ("Oficinas", "Oficinas"),
                ("Hoteles", "Hoteles"),
            ],
            "Industrial": [
                ("Parque industrial", "Parque industrial"),
                ("Nave industrial", "Nave industrial"),
                ("Almacén logístico", "Almacén logístico"),
                ("Planta de producción", "Planta de producción")
            ],
            "Infraestructura": [
                ("Carretera", "Carretera"),
                ("Puente", "Puente"),
                ("Aeropuerto", "Aeropuerto"),
            ],
            "Institucional": [
                ("Hospital", "Hospital"),
                ("Escuela",  "Escuela"),
                ("Universidad", "Universidad"),
                ("Edificio gubernamental", "Edificio gubernamental"),
                ("Centro comunitario", "Centro comunitario")
            ]
        }
        # Initialize the choices for the project function field
        choices = []

        # Add the group names as choices and the options as sub-choices
        for group_name, options in groups.items():
            choices.append((group_name, []))
            choices.extend(options)
        # Set the choices for the project function field
        self.fields['project_function'].choices = choices


    project_name = forms.CharField(
        label="Nombre de Proyecto",
        required=True,
        max_length=255, 
        min_length=3,
        validators=[
            RegexValidator(
                regex=r'^[a-zA-ZäÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚÂÊÎÔÛâêîôûàèìòùÀÈÌÒÙñÑ0-9-\s]+$',
                message="Sólo se permiten letras, números y guiones."
            )
        ],
        error_messages={
            'required': 'Este campo es obligatorio.', 
            'max_length': 'El nombre del proyecto no puede exceder los 255 caracteres.',
            'min_length': 'El nombre del proyecto debe tener al menos 3 caracteres.'
            }
        )
    project_type = forms.ChoiceField(
        label="Tipo de Proyecto", 
        required=True,
        choices=[
            ('Residencial', 'Residencial'),
            ('Comercial', 'Comercial'),
            ('Industrial', 'Industrial'),
            ('Infraeustructura', 'Infraeustructura'),
            ('Institucional', 'Institucional')
        ],
        initial='Residencial',
        error_messages={
            'required': 'Este campo es obligatorio',
            'invalid_choice': 'Tipo de proyecto no válido.'
        }
    )

    project_function = forms.ChoiceField(
        label="Función o Uso",
        required=True,
        choices=[],
        error_messages={
            'required': 'Este campo es obligatorio',
            'invalid_choice': 'Función o uso no válido.'
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
        validators=[
            RegexValidator(
                regex=r"^[a-zA-ZäÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚÂÊÎÔÛâêîôûàèìòùÀÈÌÒÙñÑ0-9-\s.,:;¬!'\"()[\]{}@#&\+\*\/_]+$",
                message="Sólo se permiten letras, números y guiones."
            )
        ],   
        widget=forms.Textarea,
        error_messages={
            'required': 'Este campo es obligatorio',
            'max_length': 'La descripción no puede exceder los 255 caracteres'
        }
    )

    def clean_project_name(self):
        if self.cleaned_data['project_name'].isnumeric():
            raise forms.ValidationError("El nombre del proyecto no puede ser numérico.")
        return self.cleaned_data['project_name']
    
    def clean_project_function(self):
        if self.cleaned_data['project_function'].isnumeric():
            raise forms.ValidationError("La función del proyecto no puede ser numérico.")
        return self.cleaned_data['project_function']

    def clean_project_description(self):
        if self.cleaned_data['project_description'].isnumeric():
            raise forms.ValidationError("La descripción no puede ser enteramente numérica.")
        return self.cleaned_data['project_description']

    def clean_project_type(self):
        project_type = self.cleaned_data.get("project_type")
        return project_type
    
    def clean(self):
        cleaned_data = super().clean()
        project_name = cleaned_data.get("project_name")
        project_type = cleaned_data.get("project_type")
        project_function = cleaned_data.get("project_function")
        estimate = cleaned_data.get("estimate")
        time = cleaned_data.get("time")
        project_description = cleaned_data.get("project_description")

        if not project_name or not project_type or not project_function or not estimate or not time or not project_description:
            raise forms.ValidationError("Todos los campos son obligatorios.")
