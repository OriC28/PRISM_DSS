from google.genai import errors
from google import genai
import json
import os

from .check_connection import check_internet_connection
from .get_prompt import get_prompt
from .response_structure import ProjectAnalysis

# Test data for the IA response
response_test = [
    {
        "AnalysisType": "Análisis basado en datos de la base de datos",
        "Riesgos": [
            {
                "Categoria": "Presupuesto",
                "Descripcion": "Desviación presupuestal debido a inflación y costos imprevistos.",
                "Impacto": "Alto",
                "Probabilidad": "70%"
            },
            {
                "Categoria": "Seguridad",
                "Descripcion": "Inseguridad en la zona que impacte la obra y al personal.",
                "Impacto": "Medio",
                "Probabilidad": "50%"
            },
            {
                "Categoria": "Clima",
                "Descripcion": "Condiciones climáticas adversas que retrasen la construcción.",
                "Impacto": "Medio",
                "Probabilidad": "30%"
            }
        ],
        "Mitigaciones": [
            {
                "RiesgoAsociado": "Desviación presupuestal debido a inflación y costos imprevistos.",
                "Accion": "Establecer reservas financieras para cubrir posibles sobrecostos. Realizar un seguimiento continuo del presupuesto y ajustar según sea necesario."
            },
            {
                "RiesgoAsociado": "Inseguridad en la zona que impacte la obra y al personal.",
                "Accion": "Implementar auditorías periódicas de seguridad y coordinar con las autoridades locales para aumentar la vigilancia en la zona."
            },
            {
                "RiesgoAsociado": "Condiciones climáticas adversas que retrasen la construcción.",
                "Accion": "Desarrollar un plan de contingencia que incluya medidas para proteger la obra y al personal en caso de condiciones climáticas extremas. Ajustar el cronograma de trabajo según las previsiones meteorológicas."
            }
        ]
    }
]


def get_IAresponse(form_data: dict, db_data: dict) -> dict:
    """
    This function sends a request to the IA API (Gemini) and returns the response.

    Attributes:
        form_data (dict): The data from the form (sended by the user).
        db_data (dict): The data from the database with similar projects to the one selected by the user.
    """
    check_internet_connection()
    prompt = get_prompt(form_data, db_data)
    
    try:
        client = genai.Client(api_key=os.getenv('API_KEY'))
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt,
            config={
                'response_mime_type': 'application/json',
                'response_schema': list[ProjectAnalysis]
            }
        )
        # Check if the response is empty or not in JSON format
        if not response.text:
            raise ValueError("Respuesta vacía de la IA. Intenta nuevamente.")
        
        if not response.text.startswith('['):
            raise ValueError("La respuesta de la IA no tiene un formato válido.")

        # Parse the response as JSON and return it
        return json.loads(response.text)
 
    except json.JSONDecodeError:
        raise ValueError("Error al decodificar la respuesta de la IA.")
    
    except errors.APIError as e:
        raise ValueError(f"Error de API: {e.code} - {e.message}")
    
    except Exception as e:
        raise ValueError(f"Error inesperado: {str(e)}")