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

    // Añadir al inicio del módulo
    const escapeHtml = (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
        };

        const escapeAttribute = (value) => {
        return String(value).replace(/"/g, '&quot;');
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
     * @param {Array} analysisDataArray - Array que contiene el objeto con los resultados del análisis.
     */
    const displayAnalysisResults = (analysisDataArray) => {
        // Validación de datos (mantener la existente)
        if (!Array.isArray(analysisDataArray) || analysisDataArray.length === 0 || typeof analysisDataArray[0] !== 'object' || analysisDataArray[0] === null) {
            console.error('Estructura de datos inválida pasada a displayAnalysisResults:', analysisDataArray);
            DOM.resultsContent.innerHTML = '<div class="alert alert-danger">Error: Los datos recibidos del análisis no tienen el formato esperado o están vacíos.</div>';
            return;
        }

        const analysisObject = analysisDataArray[0];
        const risks = analysisObject.Riesgos || [];
        const recommendations = analysisObject.Mitigaciones || [];
        const riskCategories = groupRisksByCategory(risks);
        const analysisSource = analysisObject.AnalysisType || "Análisis de Riesgos";

        let html = `
            <!-- Sección de resumen ejecutivo -->
            <div class="executive-summary">
                <h3 class="section-title">
                    <i class="fas fa-clipboard-check"></i> Resumen Ejecutivo
                </h3>
                
                <div class="analysis-source">
                    <i class="fas fa-database"></i>${escapeHtml(analysisSource)}
                </div>
                
                <div class="summary-grid">
                    <div class="summary-card total-risks">
                        <h4>Total de Riesgos</h4>
                        <div class="summary-value">${risks.length}</div>
                        <p class="summary-description">Identificados en el proyecto</p>
                    </div>
                    
                    <div class="summary-card critical">
                        <h4>Riesgos Críticos</h4>
                        <div class="summary-value">${countRisksByImpact(risks, 'Crítico')}</div>
                        <p class="summary-description">Requieren atención inmediata</p>
                    </div>
                    
                    <div class="summary-card high">
                        <h4>Riesgos Altos</h4>
                        <div class="summary-value">${countRisksByImpact(risks, 'Alto')}</div>
                        <p class="summary-description">Prioridad alta</p>
                    </div>
                    
                    <div class="summary-card medium">
                        <h4>Riesgos Medios</h4>
                        <div class="summary-value">${countRisksByImpact(risks, 'Medio')}</div>
                        <p class="summary-description">Vigilar periódicamente</p>
                    </div>
                    
                    <div class="summary-card low">
                        <h4>Riesgos Bajos</h4>
                        <div class="summary-value">${countRisksByImpact(risks, 'Bajo')}</div>
                        <p class="summary-description">Bajo impacto</p>
                    </div>
                    
                    <div class="summary-card recommendations">
                        <h4>Acciones Recomendadas</h4>
                        <div class="summary-value">${recommendations.length}</div>
                        <p class="summary-description">Para mitigar riesgos</p>
                    </div>
                </div>
            </div>

            ${generateRiskCategories(riskCategories)}
            ${generateMitigationPlan(recommendations)}
            `;

            DOM.resultsContent.innerHTML = html;
    };
                
    // Función separada para generar categorías de riesgo
    const generateRiskCategories = (riskCategories) => {
        return `
            <div class="risk-categories">
                <h3 class="section-title">
                    <i class="fas fa-layer-group"></i> Riesgos por Categoría
                </h3>
                
                ${riskCategories.map(category => `
                    <div class="category-section">
                        <h4 class="category-title">
                            <span class="category-name">${escapeHtml(category.name)}</span>
                            <span class="risk-count">${category.risks.length} riesgo(s)</span>
                        </h4>
                        
                        <div class="risk-cards">
                            ${category.risks.map(risk => `
                                <div class="risk-card ${getRiskClass(risk)}">
                                    <div class="risk-header">
                                        <h5>${escapeHtml(risk.Descripcion)}</h5>
                                        <div class="risk-meta">
                                            <span class="probability-badge">
                                                <i class="fas fa-chart-line"></i> Probabilidad: ${escapeHtml(risk.Probabilidad)}
                                            </span>
                                        </div>
                                    </div>
                                    <div class="risk-details">
                                        <div class="impact-badge ${getRiskClass(risk)}">
                                            <i class="fas fa-bolt"></i> Impacto: ${escapeHtml(risk.Impacto)}
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    };

    // Función separada para generar el plan de mitigación
    const generateMitigationPlan = (recommendations) => {
        return `
            <div class="mitigation-plan">
                <h3 class="section-title">
                    <i class="fas fa-shield-alt"></i> Plan de Mitigación
                </h3>
                <div class="recommendations-container">
                    ${recommendations.map((mitigacion, index) => `
                        <div class="recommendation-card">
                            <div class="recommendation-header">
                                <span class="recommendation-number">${index + 1}</span>
                                <h4>${escapeHtml(mitigacion.RiesgoAsociado)}</h4>
                            </div>
                            <div class="recommendation-content">
                                <p><strong>Acción recomendada:</strong> ${escapeHtml(mitigacion.Accion)}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    };

    // ==================== MANEJADORES DE EVENTOS ====================

    /**
     * Maneja el evento de cancelación
     */
    const handleCancel = () => {
        if (confirm('¿Estás seguro de que deseas cancelar? Los datos no guardados se perderán.')) {
            window.location.href = 'dashboard.html'; // Ajusta si es necesario
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
    
            const response = await fetch("/analizar-proyecto/procesar/", { // Asegúrate que esta URL sea correcta
                method: "POST",
                headers: {
                    "X-CSRFToken": formData.get("csrfmiddlewaretoken"),
                    "X-Requested-With": "XMLHttpRequest"
                },
                body: formData,
            });
            
            hideLoadingState();
            const results = await response.json(); // results = { success: true, data: [{...}] }
            console.log("Datos recibidos del backend:", results); // Para depuración

            if (!response.ok) {
                if (results.errors || results.non_field_errors) {
                    displayFormErrors(results);
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
                displayAnalysisResults(results.data);
            } else {
                console.error("La respuesta del backend no tiene la estructura esperada:", results);
                DOM.resultsContent.innerHTML = `<div class="alert alert-danger">Error: La respuesta del servidor no fue la esperada.</div>`;
            }

        } catch (error) {
            hideLoadingState();
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