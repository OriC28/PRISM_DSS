from django import forms
from shared.models.dss_models import Proyectos, Riesgos,TipoProyecto,Categorias,AccionesMitigacion,CategoriasRiesgos,Categorias
from django.core.validators import RegexValidator

# Asegúrate de tener SOLO estos campos en tu forms.py
class RegisterProject(forms.Form):
    
        project_name = forms.CharField(
            label="Nombre de Proyecto*",
            required=True,
            max_length=255,
            widget=forms.TextInput(attrs={'id': 'projectName'}),
            validators=[
                RegexValidator(
                    regex=r'^[a-zA-ZäÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚÂÊÎÔÛâêîôûàèìòùÀÈÌÒÙñÑ0-9-\s]+$',
                    message="Sólo se permiten letras, números y guiones."
                    )
                ],
                
            error_messages={
                'required': 'Este campo es obligatorio',
                'max_length': 'El nombre del proyecto no puede exceder los 255 caracteres'
            }
        )
        
        project_type = forms.ModelChoiceField(
        label="Tipo de Proyecto*",
        queryset=TipoProyecto.objects.all(),
        widget=forms.Select(attrs={'id': 'projectType'}),
        initial='1',
        error_messages={
            'required': 'Este campo es obligatorio',
            'invalid_choice': 'Tipo de proyecto no válido.'
        }
        )
        
        """ project_type = forms.ChoiceField(
            label="Tipo de Proyecto*", 
            required=True, 
            widget=forms.Select(attrs={'id': 'projectType'}),
            #queryset=TipoProyecto.objects.all(),
            choices=[
                (1, 'Residencial'),
                (2, 'Comercial'),
                (3, 'Industrial'),
                (4, 'Infraestructura'),
                (5, 'Institucional')
            ],
            error_messages={'required': 'Este campo es obligatorio'}
        ) """
        
        project_status = forms.ChoiceField(
            label="Estado del Proyecto*",
            required=True,
            widget=forms.Select(attrs={'id': 'projectStatus'}),
            choices=[
                ('En planificación', 'En planificación'),
                ('En ejecución', 'En ejecución'),
                ('Suspendido', 'Suspendido'),
                ('Completado', 'Completado'),
            ],
            initial='En planificación',
            error_messages={
            'required': 'Este campo es obligatorio',
            'invalid_choice': 'Estado de proyecto no válido.'
        }
        )
        
        project_budget = forms.FloatField(
            label="Presupuesto*",
            required=True,
            widget=forms.NumberInput(attrs={'id': 'projectBudget', 'min':'0', 'step':"0.01"}),
            validators=[
                RegexValidator(
                    regex=r'^(?!0+(\.0*)?$)[+]?(\d+(\.\d*)?|\.\d+)$',
                    message="Este campo solo puede contener números válidos (enteros)."
                )
            ],
            error_messages={
                'required': 'Este campo es obligatorio',
                'invalid': 'El presupuesto debe ser un número válido'
            }
        )
        
        project_budget_unit = forms.ChoiceField(
            required=True,
            widget=forms.Select(attrs={'id': 'currency'}),
            choices=[
                ('USD', 'USD'),
                ('PEN', 'PEN'),
                ('EUR', 'EUR'),  # Corregí UER por EUR
                ('VES', 'VES'),
                ('MXN', 'MXN'),
                
            ],
            initial='USD',
            error_messages={
                'required': 'Este campo es obligatorio',
                'invalid_choice': 'Tipo de moneda no válido.'
            }
        )
        
        project_duration = forms.IntegerField(
            label="Duración Estimada*",
            required=True,
            min_value=1,
            widget=forms.NumberInput(attrs={'id': 'projectDuration'}),
            validators=[
                RegexValidator(
                    regex=r'^\d+$',
                    message="La duración estimada debe ser un número valido."
                )
            ],
            error_messages={
                'required': 'Este campo es obligatorio',
                'min_value': 'La duración estimada debe ser mayor a 1',
                'invalid': 'La duración estimada debe ser un número entero válido'
            }
        )
        
        project_duration_unit = forms.ChoiceField(
            required=True,
            widget=forms.Select(attrs={'id': 'durationUnit'}),
            choices=[
                ('Años', 'Años'),
                ('Meses', 'Meses'),
                ('Semanas', 'Semanas'),
                ('Días', 'Días'),
            ],
            initial='Años',
            error_messages={
                'required': 'Este campo es obligatorio',
                'invalid_choice': 'Tipo de duración no válido.'
            }
        )
        
        project_location = forms.CharField(
            label="Ubicación Geográfica*",
            required=True,
            max_length=150,
            widget=forms.TextInput(attrs={'id': 'projectLocation'}),
            validators=[
                RegexValidator(
                    regex=r'^[a-zA-ZäÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚÂÊÎÔÛâêîôûàèìòùÀÈÌÒÙñÑ0-9-\s]+$',
                    message="Sólo se permiten letras, números y guiones."
                    )
                ],
                
            error_messages={
                'required': 'Este campo es obligatorio',
                'max_length': 'la Dirección Geográfica no puede exceder los 150 caracteres'
            }
        )
        
        staffCount = forms.IntegerField(
            label="Cantidad de Personal*",
            required=True,
            min_value=0,
            widget=forms.NumberInput(attrs={'id': 'staffCount'}),
            validators=[
                RegexValidator(
                    regex=r'^[1-9]\d*$|^[0-9]\d{1,}$',
                    message="La cantidad de personal debe ser un número entero válido."
                )
            ],
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
            widget=forms.Textarea(attrs={'rows': 4, 'id':'projectDescription'}),
            validators=[
                RegexValidator(
                        regex=r"^[a-zA-ZäÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚÂÊÎÔÛâêîôûàèìòùÀÈÌÒÙñÑ0-9-\s.,:;¬!'\"()[\]{}@#&\+\*\/_]+$",
                        message="Sólo se permiten letras, números y guiones."
                    )
            ], 
            error_messages={
                'required': 'Este campo es obligatorio',
                'max_length': 'La descripción no puede exceder los 255 caracteres'
            }
        )
        class Meta:
            model = Proyectos
            fields = [
                'nombre_proyecto',
                'tipo_proyecto',
                'estado_proyecto',
                'descripcion',
                'presupuesto',
                'moneda',
                'duracion_estimada',
                'unidad_duracion',
                'cantidad_equipo',
                'ubicacion_geografica'
            ]

            def save(self, commit=True):
                # Mapeo manual de campos personalizados al modelo
                instance = super().save(commit=False)
                instance.nombre_proyecto = self.cleaned_data['project_name']
                instance.tipo_proyecto = self.cleaned_data['project_type']
                instance.estado_proyecto = self.cleaned_data['project_status']
                instance.presupuesto = self.cleaned_data['project_budget']
                instance.moneda = self.cleaned_data['project_budget_unit']
                instance.duracion_estimada = self.cleaned_data['project_duration']
                instance.unidad_duracion = self.cleaned_data['project_duration_unit']
                instance.ubicacion_geografica = self.cleaned_data['project_location']
                instance.cantidad_equipo = self.cleaned_data['staffCount']
                instance.descripcion = self.cleaned_data['project_description']

                if commit:
                    instance.save()
                return instance 

        
        
class RegisterRisk(forms.Form):
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
        validators=[
            RegexValidator(
                regex=r"^[a-zA-ZäÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚÂÊÎÔÛâêîôûàèìòùÀÈÌÒÙñÑ0-9-\s.,:;¬!'\"()[\]{}@#&\+\*\/_]+$",
                message="Sólo se permiten letras, números y guiones."
            )
        ],
        error_messages={
            'required': 'Este campo es obligatorio',
            'max_length': 'La descripción no puede exceder los 255 caracteres'
            }
        )
    
    
    riskProbability = forms.IntegerField(
        label="Probabilidad",
        required=True,
        min_value=10,
        max_value=90,
        widget=forms.NumberInput(attrs={
            'id': 'riskProbability1',
            'name': 'risks[0][probability]',
            }
        ),
        validators=[
            RegexValidator(
                regex=r"^(?:100|[1-9]\d)$", # Expresión regular para números del 10 al 100
                message="El valor debe ser un número positivo entre 10 y 100 (inclusive)."
            )
            ],
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
    #nuevos campos
    riskStatus = forms.ChoiceField(
        label="Estado de Riesgo",
        required=True,
        widget=forms.Select(attrs={
            'id': 'riskStatus1',
            'name': 'risks[0][status]',
            }
            ),
        choices=[
            ('Activo', 'Activo'),
            ('Mitigado', 'Mitigado'),
            ('Pendiente', 'Pendiente'),
        ],
        initial='Seleccionar...',
        error_messages={'required': 'Este campo es obligatorio'}
    )
    
    riskCategory = forms.ModelChoiceField(
        label="Categoría de Riesgo",
        queryset=Categorias.objects.all(),
        widget=forms.Select(attrs={
            'id': 'riskCategory1',
            'name': 'risks[0][category]',
            }
            ),
        initial='Seleccionar...',
        error_messages={'required': 'Este campo es obligatorio'}
    )
    
    riskMitigation = forms.ModelChoiceField(
        label="Descripción de Mitigación",
        required=True,
        queryset=AccionesMitigacion.objects.all(),
        widget=forms.Select(attrs={
            'id': 'riskMitigation1',
            'name': 'risks[0][mitigation]',
            }
        ),
        error_messages={
            'required': 'Este campo es obligatorio',
            }
        )
    
    class Meta:
        model = Riesgos  # Modelo al que se mapearán los datos
        fields = [
            'descripcion_riesgo',  # Campo del modelo (no del formulario)
            'probabilidad',
            'impacto',
            'estado_riesgo',
            'categoria',
            'mitigacion'
        ]

    def save(self, proyecto,mitigacion, commit=True):
        # Crear una instancia del modelo Riesgos y mapear los campos
        riesgo = Riesgos(
            proyecto=proyecto,
            descripcion_riesgo=self.cleaned_data['riskDescription'],  # Mapeo manual
            mitigacion= mitigacion,
            probabilidad=self.cleaned_data['riskProbability'],
            impacto=self.cleaned_data['riskImpact'],
            estado_riesgo=self.cleaned_data['riskStatus'],
            categoria=self.cleaned_data['riskCategory']
        )

        if commit:
            riesgo.save()
        return riesgo
    
class RegisterMitigacion(forms.Form):
    riskMitigation = forms.ModelChoiceField(
        label="Descripción de Mitigación",
        required=True,
        queryset=AccionesMitigacion.objects.all(),
        widget=forms.Select(attrs={
            'id': 'riskMitigation1',
            'name': 'risks[0][mitigation]',
            }
        ),
        error_messages={
            'required': 'Este campo es obligatorio',
            }
        )
    
    def save(self,AccionesMitigacion, commit=True):
        # Crear una instancia del modelo Riesgos y mapear los campos
        mitigacion = AccionesMitigacion(
            nombre_mitigacion=self.cleaned_data['riskMitigation'],  # Mapeo manual
        )

        if commit:
            mitigacion.save()
        return mitigacion
    


class RiskCategory(forms.Form): 
    riskCategory = forms.ModelChoiceField(
        label="Categoría de Riesgo",
        queryset=Categorias.objects.all(),
        widget=forms.Select(attrs={
            'id': 'riskCategory1',
            'name': 'risks[0][category]',
            }
            ),
        initial='Seleccionar...',
        error_messages={'required': 'Este campo es obligatorio'}
    )
    
    model = CategoriasRiesgos  # Modelo al que se mapearán los datos
    fields = [
        'riesgo', #el id
        'categoria',
    ] 
    def clean_project_name(self):
        if self.cleaned_data['project_name'].isnumeric():
            raise forms.ValidationError("El nombre del proyecto no puede ser numérico.")
        return self.cleaned_data['project_name']
    
    def save(self, Categorias ,CategoriasRiesgos,Riesgo,commit=True):
        # Crear una instancia del modelo Riesgos y mapear los campos
        CategoriasRiesgos = CategoriasRiesgos(
            riesgo=Riesgo,  # Mapeo manual
            categoria=self.cleaned_data['riskCategory'],  # Mapeo manual
        )

        if commit:
            CategoriasRiesgos.save()
        return CategoriasRiesgos