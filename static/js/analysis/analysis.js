
import {handleFormSubmit, handleCancel} from './handleEvents.js';
/**
 * Módulo principal para el análisis de riesgos de proyectos
 * Maneja el formulario de análisis, visualización de resultados y errores
 */
const RiskAnalysisModule = (function() {
    // Elementos del DOM
    const DOM = {
        resultsSection: document.getElementById('resultsSection'),
        resultsContent: document.getElementById('resultsContent'),
        cancelBtn: document.getElementById('cancelBtn'),
        analysisForm: document.getElementById('analysisForm')
    };

    // Clases CSS utilizadas
    const CSS_CLASSES = {
        ERROR: 'is-invalid',
        ERROR_MESSAGE: 'error-message',
        FIELD_ERROR: 'field-error',
        HIGHLIGHT_ERROR: 'highlight-error'
    };

    // Selectores CSS
    const SELECTORS = {
        ERROR_ELEMENTS: `.${CSS_CLASSES.ERROR_MESSAGE}, .${CSS_CLASSES.FIELD_ERROR}`,
        INVALID_INPUTS: `.${CSS_CLASSES.ERROR}`,
        HIGHLIGHTED_ERRORS: `.${CSS_CLASSES.HIGHLIGHT_ERROR}`
    };

    /**
     * Inicializa el módulo y configura los event listeners
     */
    const init = () => {
        if (DOM.cancelBtn) DOM.cancelBtn.addEventListener('click', handleCancel);
        if (DOM.analysisForm) DOM.analysisForm.addEventListener('submit', (e) => {
            handleFormSubmit(e, DOM, SELECTORS, CSS_CLASSES);});
    };

    // Exponer métodos públicos si es necesario
    return {
        init
    };
})();

// Inicializar el módulo cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', RiskAnalysisModule.init);