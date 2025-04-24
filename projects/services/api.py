from openai import OpenAI
import openai
import requests
from urllib.request import urlopen
from urllib.error import URLError
import json
import os

def check_internet_connection():
    try:
        urlopen('https://www.google.com', timeout=5)
        return True
    except URLError:
        return False

def get_prompt(data: dict, db: str) -> str:

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
    4. Explicar adecuadamente las acciones de mitigación y su relación con los riesgos identificados.

   **Instrucciones críticas:**
    1. **Formato de salida**: Devuelve **únicamente un string JSON válido** (sin `\boxed{{}}`, sin marcas como ```json`, sin comentarios).
    2. **Escape de caracteres**: 
    - Usa comillas dobles (`"`) para strings y escápalas si aparecen dentro de valores (ej: `\"texto\"`).
    3. **Idioma**: Responde únicamente en español.
    - Evita saltos de línea (`\n`) en valores.
    4. **Estructura exigida**:
    {{
        "ProyectoAnalizado": "nombre_del_proyecto",
        "Riesgos": [
            {{
                "Categoria": "categoria_riesgo",
                "Descripcion": "descripcion_del_riesgo",
                "Impacto": "Alto/Medio/Bajo/Crítico",
                "Probabilidad": "X%"
            }}
        ],
        "Mitigaciones": [
            {{
                "RiesgoAsociado": "descripcion_del_riesgo_asociado",
                "Accion": "accion_de_mitigacion"
            }}
        ]
    }}""".format(
            data=json.dumps(data, ensure_ascii=False),
            db=db
        )

    return prompt

def get_IAresponse(form_data: dict, db_data: str) -> dict:
    
    """ if not check_internet_connection():
        raise ConnectionError("No hay conexión a Internet. Por favor, verifica tu conexión.")

    try:
        prompt = get_prompt(form_data, db_data)

        client = OpenAI(
            base_url = "https://openrouter.ai/api/v1",
            api_key = os.getenv('API_KEY')
        )

        completion = client.chat.completions.create(
            timeout=10,
            model="google/gemini-2.0-flash-exp:free",
            messages=[
                {
                    'role': 'user',
                    'content': [
                        {
                            'type': 'text',
                            'text': prompt
                        }
                    ] 
                }
            ],
            response_format={'type': 'json_object'},
            temperature=0.6
        )
        if not completion.choices:
            raise ValueError("No se recibió una respuesta válida de la IA.")
        
        try:
            return json.loads(completion.choices[0].message.content)
        except json.JSONDecodeError:
            raise ValueError("La respuesta de la IA no tiene una estructura válida.")

    except requests.exceptions.Timeout:
        raise ConnectionError("Tiempo de espera agotado al conectar con el servicio de IA.")

    except requests.exceptions.ConnectionError:
        raise ConnectionError("Error de conexión al intentar contactar la API.")

    except openai.NotFoundError as e:
        print(e)
        raise ValueError("El modelo solicitado no está disponible.")

    except Exception as e:
        raise Exception(f"Error en el servicio de IA: {e}") """
    
    response = {
        "ProyectoAnalizado": "Hospital Regional Cusco",
        "Riesgos": [
            {
            "Categoria": "Recursos Humanos",
            "Descripcion": "Conflictos sindicales entre trabajadores que podrían retrasar el proyecto.",
            "Impacto": "Alto",
            "Probabilidad": "30%"
            },
            {
            "Categoria": "Tecnológico",
            "Descripcion": "Inestabilidad geotécnica que podría afectar la construcción del hospital.",
            "Impacto": "Crítico",
            "Probabilidad": "15%"
            },
            {
            "Categoria": "Social",
            "Descripcion": "Protestas comunitarias que podrían retrasar el proyecto.",
            "Impacto": "Alto",
            "Probabilidad": "50%"
            },
            {
            "Categoria": "Legal",
            "Descripcion": "Incumplimiento de normativas de salud y seguridad en la construcción de un hopital.",
            "Impacto": "Crítico",
            "Probabilidad": "50%"
            },
            {
            "Categoria": "Logística",
            "Descripcion": "Retrasos en la entrega de los suministros necesarios para la construcción.",
            "Impacto": "Alto",
            "Probabilidad": "40%"
            },
            {
            "Categoria": "Financiero",
            "Descripcion": "Aumento inesperado en los costos de materiales de construcción.",
            "Impacto": "Alto",
            "Probabilidad": "35%"
            }
        ],
        "Mitigaciones": [
            {
            "RiesgoAsociado": "Conflictos sindicales",
            "Accion": "Capacitar al personal y mantener un diálogo constante con sindicatos."
            },
            {
            "RiesgoAsociado": "Inestabilidad geotécnica",
            "Accion": "Realizar estudios geotécnicos detallados y considerar un diseño redundante."
            },
            {
            "RiesgoAsociado": "Protestas comunitarias",
            "Accion": "Realizar consultas comunitarias y mantener una comunicación transparente con la comunidad."
            },
            {
            "RiesgoAsociado": "Cumplimiento de normativas de salud y seguridad",
            "Accion": "Realizar estrictas inspecciones de salud y seguridad, y formar al personal en estas normativas."
            },
            {
            "RiesgoAsociado": "Retrasos en la entrega de suministros",
            "Accion": "Establecer contratos con múltiples proveedores de suministros para garantizar la entrega oportuna."
            },
            {
            "RiesgoAsociado": "Aumento en los costos de materiales",
            "Accion": "Establecer acuerdos de precios fijos con proveedores para mitigar la variabilidad de costos."
            }
        ]
    }
    return response 