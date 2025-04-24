from django import forms
from django.core.validators import RegexValidator

class FormAnalyze(forms.Form):
    project_name = forms.CharField(
        label="Nombre de Proyecto",
        required=True,
        max_length=255, 
        min_length=3,
        validators=[
            RegexValidator(
                regex=r'^[a-zA-ZäÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚÂÊÎÔÛâêîôûàèìòùÀÈÌÒÙ00-9-\s]+$',
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
            ('Infraestructura', 'Infraeustructura'),
            ('Institucional', 'Institucional')
        ],
        initial='Residencial',
        error_messages={
            'required': 'Este campo es obligatorio',
            'invalid_choice': 'Tipo de proyecto no válido.'
        }
    )

    project_function = forms.CharField(
        label="Función o Uso", 
        required=True,
        max_length=100,
        min_length=4,
        validators=[
            RegexValidator(
                regex=r'^[a-zA-ZäÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚÂÊÎÔÛâêîôûàèìòùÀÈÌÒÙ0\s]+$',
                message="La función del proyecto debe contener solo letras."
            )
        ],
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
        validators=[
            RegexValidator(
                regex=r"^[a-zA-ZäÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚÂÊÎÔÛâêîôûàèìòùÀÈÌÒÙ0-9-\s.,:;¬!'\"()[\]{}@#&\+\*\/_]+$",
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
