from pydantic import BaseModel
import enum

# This module defines the data structures for the project analysis, including risks and mitigations.

class Impact(enum.Enum):
    ALTO = "Alto"
    MEDIO = "Medio"
    BAJO = "Bajo"
    CRITICO = "Crítico"

class Probability(enum.Enum):
    MUY_ALTO = "90%"
    BASTANTE_PROBABLE = "70%"
    MEDIANAMENTE_PROBABLE = "50%"
    POCO_PROBABLE = "30%"
    NADA_PROBABLE = "10%"

class Risks(BaseModel):
    Categoria: str
    Descripcion: str
    Impacto: Impact
    Probabilidad: Probability

class Mitigations(BaseModel):
    RiesgoAsociado: str
    Accion: str

class ProjectAnalysis(BaseModel):
    Riesgos: list[Risks]
    Mitigaciones: list[Mitigations]