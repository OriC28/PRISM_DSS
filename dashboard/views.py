import datetime
from django.shortcuts import render
from django.utils.html import escape
from shared.models.dss_models import Proyectos, Riesgos, TipoProyecto
# Create your views here.
def dashboard(request):
    projects = Proyectos.objects.all()
    risks = Riesgos.objects.all()
    types = TipoProyecto.objects.all()
    projects_json_parsed_data = []
    types_dict = {}
    for project in projects:
        parsed_data = {}
        parsed_data['name'] = escape(project.nombre_proyecto)
        parsed_data['location'] = escape(project.ubicacion_geografica)
        parsed_data['startDate'] = project.fecha_creacion

        #Finish date calculation based on duration
        if project.unidad_duracion == 'dias':
            finish_date = project.fecha_creacion + datetime.timedelta(days=project.duracion_estimada)
        elif project.unidad_duracion == 'meses':
            finish_date = project.fecha_creacion + datetime.timedelta(days=project.duracion_estimada * 30)
        elif project.unidad_duracion == 'años':
            finish_date = project.fecha_creacion + datetime.timedelta(days=project.duracion_estimada * 365)

        parsed_data['endDate'] = finish_date
        parsed_data['risks'] = risks.filter(proyecto=project.proyecto_id).count()
        parsed_data['status'] = escape(project.estado_proyecto)
        
        type = types.filter(tipo_proyecto_id=project.tipo_proyecto_id).first().nombre_tipo
        if types_dict.get(type) is None:
            types_dict[type] = 1
        else:
            types_dict[type] = types_dict[type] + 1 
        projects_json_parsed_data.append(parsed_data)
    
    sorted_types = sorted_types = [
    {"type": escape(k), "count": v}
    for k, v in sorted(types_dict.items(), key=lambda item: item[1], reverse=True)[:5]
    ]
    context = {
        'projects': projects,
        'risks': risks,
        'projects_json' : projects_json_parsed_data,
        'project_types': sorted_types
    }
    #print (projects.values())
    return render(request, 'dashboard.html', context=context)