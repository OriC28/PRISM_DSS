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
        exportBtn: document.getElementById('exportBtn'),
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

    // ==================== FUNCIONES DE UTILIDAD ====================

    /**
     * Determina la clase CSS para un riesgo basado en su impacto
     * @param {Object} risk - Objeto que representa un riesgo
     * @returns {string} Clase CSS correspondiente al nivel de riesgo
     */
    const getRiskClass = (risk) => {
        classType = '';
        switch(risk.Impacto.toLowerCase()){
            case 'crítico':
                classType = 'critical';
                break;
            
            case 'alto':
                classType = 'high';
                break;
            
            case 'medio':
                classType = 'medium';
                break;
            
            case 'bajo':
                classType = 'low';
                break;
        }
        return classType;
    };

    /**
     * Agrupa riesgos por categoría
     * @param {Array} risks - Array de riesgos a agrupar
     * @returns {Array} Array de objetos con categorías y sus riesgos
     */
    const groupRisksByCategory = (risks) => {
        if (!risks || !Array.isArray(risks)) return [];

        const categories = risks.reduce((acc, risk) => {
            if (!acc[risk.Categoria]) {
                acc[risk.Categoria] = [];
            }
            acc[risk.Categoria].push(risk);
            return acc;
        }, {});

        return Object.entries(categories).map(([name, risks]) => ({ name, risks }));
    };

    /**
     * Contador de riesgos por nivel de impacto
     * @param {Array} risks - Array de riesgos
     * @param {string} impactLevel - Nivel de impacto a contar
     * @returns {number} Cantidad de riesgos con ese nivel de impacto
     */
    const countRisksByImpact = (risks, impactLevel) => {
        return risks.filter(r => r.Impacto === impactLevel).length;
    };

    // ==================== MANEJO DE ERRORES ====================

    /**
     * Limpia todos los mensajes y estilos de error previos
     */
    const clearPreviousErrors = () => {
        // Eliminar mensajes de error
        document.querySelectorAll(SELECTORS.ERROR_ELEMENTS).forEach(el => el.remove());
        
        // Remover clases de error de inputs
        document.querySelectorAll(SELECTORS.INVALID_INPUTS).forEach(el => {
            el.classList.remove(CSS_CLASSES.ERROR);
            el.style.removeProperty('border-color');
        });
        
        // Ocultar contenedores de errores generales
        const generalErrorContainers = document.querySelectorAll('#non-field-errors, #general-errors');
        generalErrorContainers.forEach(container => {
            container.innerHTML = '';
            container.style.display = 'none';
        });
        
        // Limpiar resaltados temporales
        document.querySelectorAll(SELECTORS.HIGHLIGHTED_ERRORS).forEach(el => {
            el.classList.remove(CSS_CLASSES.HIGHLIGHT_ERROR);
        });
    };

    /**
     * Muestra errores de formulario en la interfaz
     * @param {Object} errorData - Datos de errores del servidor
     */
    const displayFormErrors = (errorData) => {
        clearPreviousErrors();

        // Mostrar errores de campos específicos
        if (errorData.errors) {
            for (const [fieldName, errorList] of Object.entries(errorData.errors)) {
                if (fieldName === '__all__') continue;

                const fieldElement = document.getElementById(`id_${fieldName}`);
                if (fieldElement && errorList.length > 0) {
                    fieldElement.classList.add(CSS_CLASSES.ERROR);
                    
                    const errorElement = document.createElement('div');
                    errorElement.className = `${CSS_CLASSES.ERROR_MESSAGE} text-danger`;
                    errorElement.textContent = errorList[0].message;
                    fieldElement.parentNode.appendChild(errorElement);
                }
            }
        }

        // Mostrar errores generales (non_field_errors)
        if (errorData.non_field_errors) {
            const nonFieldErrorContainer = document.getElementById('non-field-errors') || createNonFieldErrorContainer();
            nonFieldErrorContainer.innerHTML = errorData.non_field_errors.join('<br>');
            nonFieldErrorContainer.style.display = 'block';
        }

        if (errorData.errors || errorData.non_field_errors) {
            scrollToFirstError();
        }
    };

    /**
     * Crea un contenedor para errores generales si no existe
     * @returns {HTMLElement} El contenedor de errores
     */
    const createNonFieldErrorContainer = () => {
        const container = document.createElement('div');
        container.id = 'non-field-errors';
        container.className = 'alert alert-danger';
        container.style.display = 'none';
        document.querySelector('form').prepend(container);
        return container;
    };

    /**
     * Desplaza la vista al primer error encontrado
     */
    const scrollToFirstError = () => {
        DOM.resultsSection.style.display = 'none';
        DOM.resultsContent.innerHTML = '';
        
        const firstErrorElement = document.querySelector(SELECTORS.INVALID_INPUTS) || 
                               document.getElementById('non-field-errors');
        
        if (firstErrorElement) {
            firstErrorElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
            
            // Resaltado temporal
            firstErrorElement.style.transition = 'box-shadow 0.3s';
            firstErrorElement.style.boxShadow = '0 0 0 2px rgba(220, 53, 69, 0.5)';
            
            setTimeout(() => {
                firstErrorElement.style.boxShadow = 'none';
            }, 2000);
        }
    };

    // ==================== MANEJO DE ESTADOS ====================

    /**
     * Muestra el estado de carga durante el análisis
     */
    const showLoadingState = () => {
        DOM.resultsSection.style.display = 'block';
        DOM.resultsContent.innerHTML = `
            <div class="loading-state">
                <div class="loading-spinner"></div>
                <p class="loading-text">Analizando proyecto con IA</p>
                <p class="loading-subtext">Esto puede tomar unos segundos...</p>
            </div>
        `;
    };

    /**
     * Oculta el estado de carga
     */
    const hideLoadingState = () => {
        DOM.resultsSection.style.display = 'block';
        DOM.resultsContent.innerHTML = '';
        DOM.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start'});
    };

    // ==================== VISUALIZACIÓN DE RESULTADOS ====================

    /**
     * Muestra los resultados del análisis en la interfaz
     * @param {Object} results - Resultados del análisis
     */
    const displayAnalysisResults = (results) => {
        const risks = results.Riesgos || [];
        const recommendations = results.Mitigaciones || [];
       
        const riskCategories = groupRisksByCategory(risks);
        const criticalRisksCount = countRisksByImpact(risks, 'Crítico');
        const highRisksCount = countRisksByImpact(risks, 'Alto');
        const mediumRisksCount = countRisksByImpact(risks, 'Medio');
        const lowRisksCount = countRisksByImpact(risks, 'Bajo');

        let html = `
            <div class="analysis-summary">
                <h3>Análisis de Riesgos para: ${results.ProyectoAnalizado}</h3>
                <div class="risk-stats">
                    <p>Total de riesgos identificados: <strong>${risks.length}</strong></p>
                    <div class="risk-counters">
                        <div class="risk-counter critical">
                            <span class="count">${criticalRisksCount}</span>
                            <span class="label">Críticos</span>
                        </div>
                        <div class="risk-counter high">
                            <span class="count">${highRisksCount}</span>
                            <span class="label">Altos</span>
                        </div>
                        <div class="risk-counter medium">
                            <span class="count">${mediumRisksCount}</span>
                            <span class="label">Medios</span>
                        </div>
                        <div class="risk-counter low">
                            <span class="count">${lowRisksCount}</span>
                            <span class="label">Bajos</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="recommendations-section">
                <h4>Plan de Mitigación</h4>
                <div class="recommendations-grid">
                    ${recommendations.map(mitigacion => `
                        <div class="recommendation-card">
                            <h5>${mitigacion.RiesgoAsociado}</h5>
                            <p>${mitigacion.Accion}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        // Añadir categorías de riesgo si existen
        if (riskCategories.length > 0) {
            riskCategories.forEach(category => {
                html += `
                    <div class="risk-category-section">
                        <h4 class="category-title">${category.name}</h4>
                        <div class="risk-cards">
                            ${category.risks.map(risk => `
                                <div class="risk-card ${getRiskClass(risk)}">
                                    <div class="risk-header">
                                        <h5>${risk.Descripcion}</h5>
                                        <span class="risk-probability">Probabilidad: ${risk.Probabilidad}</span>
                                    </div>
                                    <div class="risk-details">
                                        <div class="impact-badge ${getRiskClass(risk)}">
                                            Impacto: ${risk.Impacto}
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            });
        }
        
        DOM.resultsContent.innerHTML = html;
    };

    // ==================== MANEJADORES DE EVENTOS ====================

    /**
     * Maneja el evento de cancelación
     */
    const handleCancel = () => {
        if (confirm('¿Estás seguro de que deseas cancelar? Los datos no guardados se perderán.')) {
            window.location.href = 'dashboard.html';
        }
    };
    
    /**
     * Maneja el evento de exportación (placeholder)
     */
    const handleExport = () => {
        alert('Funcionalidad de exportación se implementará en la versión final');
    };

    /**
     * Maneja el envío del formulario de análisis
     * @param {Event} e - Evento de submit
     */
    
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        clearPreviousErrors();
    
        const formData = new FormData(e.target);
    
        try {
            showLoadingState();
    
            const response = await fetch("/analizar-proyecto/procesar/", {
                method: "POST",
                headers: {
                    "X-CSRFToken": formData.get("csrfmiddlewaretoken"),
                    "X-Requested-With": "XMLHttpRequest"
                },
                body: formData,
            });
            
            hideLoadingState();
    
            const results = await response.json();
    
            if (!response.ok) {
                if (results.errors || results.non_field_errors) {
                    displayFormErrors(results);
                    return;
                }
                
                // Mostrar errores generales de la respuesta
                if (results.error) {
                    DOM.resultsContent.innerHTML = `<div class="alert alert-danger">${results.error}</div>`;
                    return;
                }
            }
            
            displayAnalysisResults(results.data);
        } catch (error) {
            hideLoadingState();
            
            let errorMessage = "Error al procesar la solicitud";
            
            // Solo manejar errores de red (cuando ni siquiera llega al backend)
            if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
                errorMessage = "Error de conexión. Verifica tu internet.";
            } 
            // Para respuestas del backend (incluyendo ConnectionError de Django)
            else if (error.response?.data?.errors) {
                errorMessage = error.response.data.errors.join(", ");
            }
            // Para otros errores con mensaje
            else if (error.message) {
                errorMessage = error.message;
            }
        
            DOM.resultsContent.innerHTML = `<div class="alert alert-danger">${errorMessage}</div>`;
        }
        
    };

    // ==================== INICIALIZACIÓN ====================

    /**
     * Inicializa el módulo y configura los event listeners
     */
    const init = () => {
        if (DOM.cancelBtn) DOM.cancelBtn.addEventListener('click', handleCancel);
        if (DOM.exportBtn) DOM.exportBtn.addEventListener('click', handleExport);
        if (DOM.analysisForm) DOM.analysisForm.addEventListener('submit', handleFormSubmit);
    };

    // Exponer métodos públicos si es necesario
    return {
        init
    };
})();

// Inicializar el módulo cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', RiskAnalysisModule.init);