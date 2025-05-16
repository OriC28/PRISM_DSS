from google.genai import errors
from google import genai
import json
import os

from .check_connection import check_internet_connection
from .get_prompt import get_prompt
from .response_structure import ProjectAnalysis


def get_IAresponse(form_data: dict, db_data: str) -> dict:
    """
    This function sends a request to the IA API (Gemini) and returns the response.

    Attributes:
        form_data (dict): The data from the form (sended by the user).
        db_data (str): The data from the database with similar projects to the one selected by the user.
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

        if not response.text:
            raise ValueError("Respuesta vacía de la IA. Intenta nuevamente.")
        
        if not response.text.startswith('['):
            raise ValueError("La respuesta de la IA no tiene un formato válido.")
        
        return json.loads(response.text)

    except json.JSONDecodeError:
        raise ValueError("Error al decodificar la respuesta de la IA.")
    
    except errors.APIError as e:
        raise ValueError(f"Error de API: {e.code} - {e.message}")
    
    except Exception as e:
        raise ValueError(f"Error inesperado: {str(e)}")