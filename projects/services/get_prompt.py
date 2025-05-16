import json

def get_prompt(data: dict, db: dict) -> str:

    # Convertir el diccionario a JSON y luego a string para asegurar la codificación correcta.
    db = json.loads(db)
    db = json.dumps(db, ensure_ascii=False)

    prompt = """Analiza el proyecto ingresado por el usuario, este tiene los siguientes
    datos de entrada: {data} y además, compáralo con los proyectos almacenados en la base de datos: {db}. 

    Ten en consideración que si {db} es vacío, debes analizar el proyecto solo con el conocimiento general de la IA sobre riesgos típicos para este tipo de proyectos y sus respectivas mitigaciones.

    En contraste, si {db} no es vacío, identifica todos los riesgos potenciales basados en las coincidencias en Tipo/Función/Presupuesto/Duración/Descripción con proyectos históricos. Luego, genera mitigaciones basadas en estrategias aplicadas en proyectos similares de la base de datos.

    Asegúrate de:
    1. No repetir riesgos o mitigaciones.
    2. Que cada riesgo tenga al menos una mitigación asociada.
    3. Si no hay riesgos o mitigaciones, devuelve arrays vacíos.
    4. Explicar adecuadamente las acciones de mitigación y su relación con los riesgos identificados."""

    return prompt