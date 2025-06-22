import {clearPreviousErrors, displayFormErrors} from './handleErrors.js';
import {showLoadingState, hideLoadingState} from './loading.js';
import {displayAnalysisResults} from './showResult.js';
import {escapeHtml} from './utils.js';

export const handleFormSubmit = async (e, DOM, SELECTORS, CSS_CLASSES) => {
    e.preventDefault();
    clearPreviousErrors(SELECTORS, CSS_CLASSES);

    const formData = new FormData(e.target);

    try {
        showLoadingState(DOM);

        const response = await fetch("/analizar-proyecto/procesar/", { 
            method: "POST",
            headers: {
                "X-CSRFToken": formData.get("csrfmiddlewaretoken"),
                "X-Requested-With": "XMLHttpRequest"
            },
            body: formData,
        });
        
        hideLoadingState(DOM);
        const results = await response.json(); // results = { success: true, data: [{...}] }
        //console.log("Datos recibidos del backend:", results); // Para depuración

        if (!response.ok) {
            if (results.errors || results.non_field_errors) {
                displayFormErrors(results, SELECTORS, CSS_CLASSES);
                return;
            }
            
            // Mostrar errores generales de la respuesta
            if (results.error) {
                DOM.resultsContent.innerHTML = `<div class="alert alert-danger">${escapeHtml(results.error)}</div>`;
                return;
            }
            // Si no es ok y no hay errores formateados, mostrar un error genérico
            DOM.resultsContent.innerHTML = `<div class="alert alert-danger">Error ${response.status}: ${response.statusText}</div>`;
            return;
        }
        
        // Verificar que results.data exista y sea un array antes de pasarlo
        if (results.success && results.data && Array.isArray(results.data)) {
            displayAnalysisResults(results.data, DOM);
        } else {
            console.error("La respuesta del backend no tiene la estructura esperada:", results);
            DOM.resultsContent.innerHTML = `<div class="alert alert-danger">Error: La respuesta del servidor no fue la esperada.</div>`;
        }

    } catch (error) {
        hideLoadingState(DOM);
        console.error("Error en la solicitud fetch:", error);
        
        let errorMessage = "Error al procesar la solicitud. Intenta de nuevo más tarde.";
        
        if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
            errorMessage = "Error de conexión. Verifica tu conexión a internet e inténtalo de nuevo.";
        } 
        // Para otros errores con mensaje
        else if (error.message) {
            errorMessage = error.message;
        }
    
        DOM.resultsContent.innerHTML = `<div class="alert alert-danger">${escapeHtml(errorMessage)}</div>`;
    }
    
};

/**
 * Maneja el evento de cancelación
 */
export const handleCancel = () => {
    if (confirm('¿Estás seguro de que deseas cancelar? Los datos no guardados se perderán.')) {
        window.location.href = '/analizar-proyecto/'; // Ajusta si es necesario
    }
};

