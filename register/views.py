from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.utils import timezone
from .forms import RegisterProject, RegisterRisk,RegisterMitigacion,RiskCategory
from shared.models.dss_models import Proyectos, Riesgos,TipoProyecto,Categorias,AccionesMitigacion,CategoriasRiesgos,Categorias
from django.forms import formset_factory



def register(request):
    # Crear formsets para manejar los formularios dinámicos
    #RegisterFormSetRiskMitigacion_set = formset_factory(RegisterFormSetRiskMitigacion, extra=1)
    project_riskSet = formset_factory(RegisterRisk, extra=1)
    project_mitigacionSet = formset_factory(RegisterMitigacion, extra=1)
    project_categorySet = formset_factory(RiskCategory, extra=1)

    if request.method == 'POST':
        project_form = RegisterProject(request.POST)

        # Formsets
        project_risk = project_riskSet(request.POST)
        project_mitigacion = project_mitigacionSet(request.POST)
        project_category = project_categorySet(request.POST)
        #formset = RegisterFormSetRiskMitigacion_set(request.POST)

        if project_form.is_valid() and project_risk.is_valid() and project_category.is_valid():
            try:
                # Guardar proyecto y mostrar datos
                
                proyecto = Proyectos(
                    nombre_proyecto=project_form.cleaned_data['project_name'],
                    tipo_proyecto=project_form.cleaned_data['project_type'],
                    estado_proyecto=project_form.cleaned_data['project_status'],
                    descripcion=project_form.cleaned_data['project_description'],
                    presupuesto=project_form.cleaned_data['project_budget'],
                    moneda=project_form.cleaned_data['project_budget_unit'],
                    duracion_estimada=project_form.cleaned_data['project_duration'],
                    unidad_duracion=project_form.cleaned_data['project_duration_unit'],
                    cantidad_equipo=project_form.cleaned_data['staffCount'],
                    ubicacion_geografica=project_form.cleaned_data['project_location'],
                    fecha_creacion=timezone.now().date()
                )
                proyecto.save()  # Guarda el proyecto en la base de datos
                print(f'Proyecto guardado con ID: {proyecto.proyecto_id}') 
                print('Datos del proyecto:', project_form.cleaned_data)
                
            

                # Imprime los datos de cada formulario en los formsets
                for form in project_risk:
                    if form.is_valid():
                        # Guardar riesgo correctamente, asociándolo al proyecto
                        riesgo = Riesgos(
                            nombre_riesgo=form.cleaned_data['riskDescription'],
                            mitigacion=form.cleaned_data['riskMitigation'],
                            probabilidad=form.cleaned_data['riskProbability'],
                            impacto=form.cleaned_data['riskImpact'],
                            estado_riesgo=form.cleaned_data['riskStatus'],
                            proyecto=proyecto,
                        )
                        riesgo.save()  # Guarda el riesgo en la base de datos

                        print(f'ID del Proyecto: {proyecto.proyecto_id} | Datos del riesgo:', form.cleaned_data)
                    else:
                        print(f'ID del Proyecto: {proyecto.proyecto_id} | Errores en el formulario de riesgo:', form.errors)

                for form in project_category:
                    if form.is_valid():
                        categoria = CategoriasRiesgos(
                            riesgo=riesgo,
                            categoria=form.cleaned_data['riskCategory'],
                        )
                        print('Datos de la categoría de riesgo:', form.cleaned_data)
                        categoria.save()  # Guarda la categoría en la base de datos
                    else:
                        print('Errores en el formulario de categoría:', form.errors)

                """ for form in project_mitigacion:
                    if form.is_valid():
                        print('Datos de la mitigación:', form.cleaned_data)
                    else:
                        print('Errores en el formulario de mitigación:', form.errors) """

            

                return JsonResponse({'status': 'success', 'message': 'Proyecto registrado!'})

            except Exception as e:
                print('Error al guardar datos:', str(e))

        else:
            print('Errores en el formulario de proyecto:', project_form.errors)
            return JsonResponse({'status': 'error', 'errors': project_form.errors}, status=400)

    else:
        # Inicializar los formularios en GET
        project_form = RegisterProject()
        project_risk = project_riskSet()
        project_mitigacion = project_mitigacionSet()
        project_category = project_categorySet()
        #formset = RegisterFormSetRiskMitigacion_set()

        return render(request, 'registrar-proyecto.html', {
            'project_form': project_form,
            #'formset': formset,
            'project_risk': project_risk,
            'project_mitigacion': project_mitigacion,
            'project_category': project_category,
        })