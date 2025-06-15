from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.utils import timezone
from .forms import RegisterProject, RegisterRisk, RegisterMitigacion, RiskCategory
from shared.models.dss_models import Proyectos, Riesgos, TipoProyecto, Categorias, AccionesMitigacion, CategoriasRiesgos, Categorias
from django.forms import formset_factory



def register(request):
    project_riskSet = formset_factory(RegisterRisk, extra=0)
    # project_mitigacionSet = formset_factory(RegisterMitigacion, extra=1) # Not used in template, keep for future if needed
    # project_categorySet = formset_factory(RiskCategory, extra=1) # Not used in template as a separate formset, riskCategory is part of RegisterRisk

    if request.method == 'POST':
        project_form = RegisterProject(request.POST)
        project_risk = project_riskSet(request.POST)
        # project_mitigacion = project_mitigacionSet(request.POST)
        # project_category = project_categorySet(request.POST)

        if project_form.is_valid() and project_risk.is_valid():
            try:
                # Save project
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
                proyecto.save()

                # Save risks
                for form in project_risk:
                    if form.is_valid():
                        riesgo = Riesgos(
                            nombre_riesgo=form.cleaned_data['riskDescription'], # Usar descripcion_riesgo para el modelo Riesgos
                            mitigacion=form.cleaned_data['riskMitigation'], # ModelChoiceField ya devuelve la instancia
                            probabilidad=form.cleaned_data['riskProbability'],
                            impacto=form.cleaned_data['riskImpact'],
                            estado_riesgo=form.cleaned_data['riskStatus'],
                            proyecto=proyecto,
                        )
                        riesgo.save()

                        # For riskCategory, since it's part of RegisterRisk, you'd save it here.
                        # Assuming riskCategory in RegisterRisk maps directly to a field in Riesgos or through another relation.
                        # If CategoriasRiesgos is needed:
                        categoria_riesgo_instance = CategoriasRiesgos(
                            riesgo=riesgo,
                            categoria=form.cleaned_data['riskCategory'] # ModelChoiceField ya devuelve la instancia
                        )
                        categoria_riesgo_instance.save()

            except Exception as e:
                print('Error al guardar datos:', str(e))
                return JsonResponse({'status': 'error', 'message': f'Error al guardar datos: {str(e)}'}, status=500)

            return JsonResponse({'status': 'success', 'message': 'Proyecto registrado correctamente!'})

        else:
            # Collect all errors from both the main form and the formset
            errors = {}
            if project_form.errors:
                # Django form.errors directly provides a dictionary where values are lists of strings
                for field, field_errors_list in project_form.errors.items():
                    errors[field] = field_errors_list # Assign the list of error messages directly

            if project_risk.errors:
                # Iterate through each form in the formset to get its errors
                for i, form_errors in enumerate(project_risk.errors):
                    if form_errors: # Check if there are errors for this specific form
                        for field, messages in form_errors.items():
                            # The key for formset errors will be like 'id_form-0-riskDescription'
                            errors[f'id_form-{i}-{field}'] = messages # Assign the list of error messages directly

            print('Validation Errors:', errors)
            return JsonResponse({'status': 'error', 'errors': errors, 'message': 'Por favor, corrija los errores en el formulario.'}, status=400)

    else:
        project_form = RegisterProject()
        project_risk = project_riskSet() # Initialize an empty formset for GET requests

        return render(request, 'registrar-proyecto.html', {
            'project_form': project_form,
            'project_risk': project_risk,
        })