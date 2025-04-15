from django.db import connection

def get_data(project_type: str):
    query = """
        SELECT 
            p.nombre_proyecto AS Nombre_de_Proyecto,
            tp.nombre_tipo AS Tipo_de_Proyecto,
            CONCAT(p.presupuesto, ' ', p.moneda) AS Presupuesto,
            CONCAT(p.duracion_estimada, ' ', p.unidad_duracion) AS Duracion_Estimada,
            p.cantidad_equipo AS Personal_Disponible,
            p.descripcion AS Descripcion,
            GROUP_CONCAT(DISTINCT CONCAT(r.nombre_riesgo, ' (Prob: ', r.probabilidad, '%%', ', Impacto: ', r.impacto, ')') SEPARATOR '; ') AS Riesgos_con_Probabilidad_e_Impacto,
            GROUP_CONCAT(DISTINCT am.nombre_mitigacion SEPARATOR ', ') AS Mitigaciones
        FROM 
            dss.proyectos p
        JOIN 
            dss.tipo_proyecto tp ON p.tipo_proyecto = tp.tipo_proyecto_id
        LEFT JOIN 
            dss.riesgos r ON p.proyecto_id = r.proyecto
        LEFT JOIN 
            dss.acciones_mitigacion am ON r.mitigacion = am.mitigacion_id
        WHERE tp.nombre_tipo = %s
        GROUP BY 
            p.proyecto_id
        ORDER BY 
            p.fecha_creacion DESC
        LIMIT 10;
    """
    with connection.cursor() as cursor:
        cursor.execute(query, [project_type])
        results = cursor.fetchall()
        columns = [desc[0] for desc in cursor.description]
        data = [dict(zip(columns, row)) for row in results]

    return data if data else []