/**
 * Limpia todos los mensajes y estilos de error previos
 */
export const clearPreviousErrors = (SELECTORS, CSS_CLASSES) => {
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
export const displayFormErrors = (errorData, SELECTORS, CSS_CLASSES) => {
    clearPreviousErrors(SELECTORS, CSS_CLASSES);

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