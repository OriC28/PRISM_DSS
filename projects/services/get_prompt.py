import json

def get_prompt(data: dict, db_data: dict) -> str:
    """
    Set the prompt for the Gemini API based on the data provided by the user and the database's projects.

    Attributes:
        data (dict): The data provided by the user by the frontend.
        db_data (dict): The data from the database, which contains the similar projects.
    """

    # Convert db_data (dict) to string 
    db_data = json.loads(db_data)

    prompt = f"""Analiza el proyecto ingresado por el usuario, este tiene los siguientes
    datos de entrada: {data} y además, compáralo con los proyectos almacenados en la base de datos: {db_data}. 

    Ten en consideración que si el JSON proporcionado (los proyectos de la base de datos) es vacío (es decir, igual a []), debes analizar el proyecto solo con el conocimiento general de la IA sobre riesgos típicos para este tipo de proyectos y sus respectivas mitigaciones.

    En contraste, si el JSON proporcionado (los proyectos de la base de datos) no es vacío (es decir, distinto a []), identifica todos los riesgos potenciales basados en las coincidencias en Tipo/Función/Presupuesto/Duración/Descripción con proyectos históricos. Luego, genera mitigaciones basadas en estrategias aplicadas en proyectos similares de la base de datos.

    Asegúrate de:
    1. Si varios proyectos tienen los mismos riesgos, agrúpalos y genera una mitigiación común para todos ellos. (Esto para evitar repetir riesgos y mitigaciones).
    2. Que cada riesgo tenga al menos una mitigación asociada.
    3. Si no hay riesgos o mitigaciones, devuelve arrays vacíos.
    4. Explicar adecuadamente las acciones de mitigación y su relación con los riesgos identificados.
    5. Especifica en un texto si el análisis fue realizado en base a los datos de la base de datos o con el conocimiento general de la IA (tipo de análisis).
    6. Dale prioridad al analisis basado en los datos de la base de datos que te proporciono, si no es posible haz un análisis con tu conocimiento general.
    7. En los riesgos y mitigaciones basados en la base de datos, incluye el nombre del proyecto de la base de datos al que te refieres.
    """
    return prompt