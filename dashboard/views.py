import datetime
from django.shortcuts import render
from shared.models.dss_models import Proyectos, Riesgos
# Create your views here.
def dashboard(request):
    projects = Proyectos.objects.all()
    risks = Riesgos.objects.all()
    finish_dates = {}
    finish_date = ""
    for project in projects:
        #Risk filtering
        #risks[str(project.proyecto_id)] = Riesgos.objects.filter(proyecto=project).values('riesgo_id', 'nombre_riesgo', 'estado_riesgo', 'probabilidad', 'impacto', 'mitigacion__nombre_mitigacion')
        #Finish dates calculation
        if project.unidad_duracion.lower() == 'dias':
            finish_date = project.fecha_creacion + datetime.timedelta(days=project.duracion_estimada)
        elif project.unidad_duracion.lower() == 'meses':
            finish_date = project.fecha_creacion + datetime.timedelta(days=project.duracion_estimada * 30)
        elif project.unidad_duracion.lower() == 'años':
            finish_date = project.fecha_creacion + datetime.timedelta(days=project.duracion_estimada * 365)
        
        finish_dates[str(project.proyecto_id)] = finish_date

    context = {
        'projects': projects,
        'finish_dates': finish_dates,
        'risks': risks
    }
    #print (projects.values())
    return render(request, 'dashboard.html', context=context)