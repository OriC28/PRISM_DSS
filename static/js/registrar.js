document.addEventListener('DOMContentLoaded', function() {
    // Elementos DOM principales
    const projectForm = document.getElementById('projectForm');
    const risksContainer = document.getElementById('risksContainer');
    const addRiskBtn = document.getElementById('addRiskButton');
    const cancelBtn = document.getElementById('cancelBtn');
    const generalMessagesDiv = document.getElementById('general-messages');

    // Obtener el elemento de total de formsets
    const totalFormsInput = document.getElementById('id_form-TOTAL_FORMS');
    // Inicializar riskCounter basado en los formularios existentes o 0 si no hay management form
    let riskCounter = totalFormsInput ? parseInt(totalFormsInput.value) || 0 : 0;

    // Función para limpiar errores
    function clearErrors() {
        document.querySelectorAll('.error-message').forEach(span => {
            span.textContent = '';
        });
        document.querySelectorAll('.field-error-input').forEach(input => {
            input.classList.remove('field-error-input');
        });
        if (generalMessagesDiv) {
            generalMessagesDiv.innerHTML = '';
            generalMessagesDiv.classList.remove('alert-danger', 'alert-success');
            generalMessagesDiv.style.display = 'none';
        }
    }

    // Función para mostrar mensajes generales (éxito o error)
    function showGeneralMessage(message, type = 'danger') {
        if (generalMessagesDiv) {
            generalMessagesDiv.innerHTML = message;
            generalMessagesDiv.style.display = 'block';
            generalMessagesDiv.classList.remove('alert-success', 'alert-danger'); // Limpiar existentes
            generalMessagesDiv.classList.add(`alert-${type}`); // Añadir nuevo tipo
            generalMessagesDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // Función para añadir nuevo riesgo
    function addRiskItem() {
        if (!totalFormsInput) {
            console.error("No se encontró el formulario de gestión de riesgos. No se puede añadir un elemento de riesgo.");
            return;
        }

        const currentTotalForms = parseInt(totalFormsInput.value);
        totalFormsInput.value = currentTotalForms + 1;

        const newIndex = currentTotalForms; // Usar currentTotalForms como el nuevo índice
        const riskItem = document.createElement('div');
        riskItem.className = 'risk-item';
        riskItem.dataset.riskIndex = newIndex;

        riskItem.innerHTML = `
            <div class="risk-header">
                <h4>Riesgo #${newIndex + 1}</h4>
                <button type="button" class="btn btn-remove-risk">
                    <i class="fas fa-times"></i> Eliminar
                </button>
            </div>
            <div class="form-grid">
                <div class="form-group">
                    <label for="id_form-${newIndex}-riskDescription">Descripción del Riesgo</label>
                    <input type="text" id="id_form-${newIndex}-riskDescription" name="form-${newIndex}-riskDescription" class="form-control" required>
                    <span class="error-message" id="error-id_form-${newIndex}-riskDescription"></span>
                </div>
                <div class="form-group">
                    <label for="id_form-${newIndex}-riskMitigation">Medidas de Mitigación</label>
                    <select id="id_form-${newIndex}-riskMitigation" name="form-${newIndex}-riskMitigation" class="form-control" required>
                        <option value="" disabled selected>Selecciona una opción</option>
                        <option value="1">Plan de contingencia</option>
                        <option value="2">Seguro adecuado</option>
                        <option value="3">Capacitación del personal</option>
                        <option value="4">Monitoreo constante</option>
                        <option value="5">Reservas financieras</option>
                        <option value="6">Diseño redundante</option>
                        <option value="7">Auditorías periódicas</option>
                        <option value="8">Protocolos de seguridad</option>
                        <option value="9">Tecnología de respaldo</option>
                        <option value="10">Contratos con penalizaciones</option>
                    </select>
                    <span class="error-message" id="error-id_form-${newIndex}-riskMitigation"></span>
                </div>
                <div class="form-group">
                    <label for="id_form-${newIndex}-riskProbability">Probabilidad de Riesgo</label>
                    <input type="number" id="id_form-${newIndex}-riskProbability" name="form-${newIndex}-riskProbability" class="form-control" required min="10" max="90" step="1">
                    <span class="error-message" id="error-id_form-${newIndex}-riskProbability"></span>
                </div>
                <div class="form-group">
                    <label for="id_form-${newIndex}-riskImpact">Impacto de Riesgo</label>
                    <select id="id_form-${newIndex}-riskImpact" name="form-${newIndex}-riskImpact" class="form-control" required>
                        <option value="" disabled selected>Seleccione</option>
                        <option value="Bajo">Bajo</option>
                        <option value="Medio">Medio</option>
                        <option value="Alto">Alto</option>
                        <option value="Crítico">Crítico</option>
                    </select>
                    <span class="error-message" id="error-id_form-${newIndex}-riskImpact"></span>
                </div>
                <div class="form-group">
                    <label for="id_form-${newIndex}-riskStatus">Estado de Riesgo</label>
                    <select id="id_form-${newIndex}-riskStatus" name="form-${newIndex}-riskStatus" class="form-control" required>
                        <option value="" disabled selected>Seleccione</option>
                        <option value="Activo">Activo</option>
                        <option value="Mitigado">Mitigado</option>
                        <option value="Pendiente">Pendiente</option>
                    </select>
                    <span class="error-message" id="error-id_form-${newIndex}-riskStatus"></span>
                </div>
                <div class="form-group">
                    <label for="id_form-${newIndex}-riskCategory">Categoría de Riesgo</label>
                    <select id="id_form-${newIndex}-riskCategory" name="form-${newIndex}-riskCategory" class="form-control" required>
                        <option value="" disabled selected>Seleccione</option>
                        <option value="1">Financiero</option>
                        <option value="2">Legal</option>
                        <option value="3">Técnico</option>
                        <option value="4">Operacional</option>
                        <option value="5">Ambiental</option>
                        <option value="6">Seguridad</option>
                        <option value="7">Calidad</option>
                        <option value="8">Recursos Humanos</option>
                        <option value="9">Tiempo</option>
                        <option value="10">Suministros</option>
                    </select>
                    <span class="error-message" id="error-id_form-${newIndex}-riskCategory"></span>
                </div>
            </div>
        `;

        risksContainer.appendChild(riskItem);
        riskItem.querySelector('.btn-remove-risk').addEventListener('click', function() {
            riskItem.remove();
            reindexRisks();
        });
        riskItem.scrollIntoView({ behavior: 'smooth' });
    }

    // Función para reindexar riesgos
    function reindexRisks() {
        const riskItems = risksContainer.querySelectorAll('.risk-item');
        riskItems.forEach((item, index) => {
            item.querySelector('h4').textContent = `Riesgo #${index + 1}`;
            item.dataset.riskIndex = index; // Actualizar data-risk-index

            // Actualizar todos los atributos de nombre e ID de los campos del formulario
            item.querySelectorAll('[name]').forEach(element => {
                const oldName = element.name;
                // Ejemplo: de 'form-0-riskDescription' a 'form-1-riskDescription'
                element.name = oldName.replace(/form-\d+-/, `form-${index}-`);
            });
            item.querySelectorAll('[id]').forEach(element => {
                const oldId = element.id;
                // Ejemplo: de 'id_form-0-riskDescription' a 'id_form-1-riskDescription'
                element.id = oldId.replace(/id_form-\d+-/, `id_form-${index}-`);
            });
            item.querySelectorAll('[for]').forEach(element => {
                const oldFor = element.htmlFor;
                element.htmlFor = oldFor.replace(/id_form-\d+-/, `id_form-${index}-`);
            });

            // Actualizar IDs de los mensajes de error
            item.querySelectorAll('.error-message').forEach(span => {
                const oldId = span.id;
                // Asegurarse de que el ID del span de error coincida con el ID del input al que se refiere, prefijado con 'error-'
                const inputIdMatch = oldId.match(/id_form-\d+-(.*)/);
                if (inputIdMatch) {
                    const fieldName = inputIdMatch[1];
                    span.id = `error-id_form-${index}-${fieldName}`;
                }
            });
        });

        // Actualizar el conteo de TOTAL_FORMS del formset
        if (totalFormsInput) {
            totalFormsInput.value = riskItems.length;
        }
    }

    // Escuchadores de eventos
    addRiskBtn.addEventListener('click', addRiskItem);

    cancelBtn.addEventListener('click', function() {
        if (confirm('¿Estás seguro de que deseas cancelar? Los datos no guardados se perderán.')) {
            window.location.href = '/dashboard'; // Redirigir al dashboard o a la página adecuada
        }
    });

    // Delegación para eliminar riesgos existentes (para los añadidos dinámicamente y los iniciales)
    risksContainer.addEventListener('click', function(e) {
        if (e.target.closest('.btn-remove-risk')) {
            const riskItem = e.target.closest('.risk-item');
            if (riskItem) {
                riskItem.remove();
                reindexRisks();
            }
        }
    });

    // Manejar el envío del formulario
    projectForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        clearErrors(); // Limpiar todos los errores anteriores

        // Validación básica del lado del cliente (para campos requeridos vacíos antes de AJAX)
        let hasClientSideErrors = false;
        projectForm.querySelectorAll('[required]').forEach(field => {
            // Comprobar si el campo es visible y está vacío
            if (field.offsetParent !== null && !field.value.trim()) {
                field.classList.add('field-error-input');
                // Dirigirse al span de error basado en el ID del campo
                const errorSpanId = `error-${field.id}`;
                const errorSpan = document.getElementById(errorSpanId);
                if (errorSpan) {
                    errorSpan.textContent = 'Este campo es obligatorio.';
                }
                hasClientSideErrors = true;
            }
        });

        if (hasClientSideErrors) {
            showGeneralMessage('Por favor, complete todos los campos requeridos.', 'danger');
            return; // Detener el envío si existen errores del lado del cliente
        }

        // Envío AJAX
        try {
            const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
            const response = await fetch(projectForm.action, {
                method: 'POST',
                body: new FormData(projectForm),
                headers: {
                    'X-CSRFToken': csrftoken,
                    'X-Requested-With': 'XMLHttpRequest' // Importante para is_ajax() de Django
                }
            });

            const data = await response.json();

            if (response.ok && data.status === 'success') {
                showGeneralMessage(data.message, 'success');
                projectForm.reset(); // Limpiar campos del formulario
                risksContainer.innerHTML = ''; // Eliminar todos los elementos de riesgo añadidos dinámicamente
                if (totalFormsInput) {
                    totalFormsInput.value = '0'; // Reiniciar el conteo del formset
                }
                // Opcionalmente, reiniciar formularios iniciales (si los hay) o volver a renderizar
                // Para un reinicio completo, una recarga de página podría ser lo más simple
                setTimeout(() => {
                    window.location.href = '/registrar-proyecto'; // Redirige a un formulario nuevo
                }, 1500);
            } else {
                // Errores de validación del lado del servidor u otros errores del servidor
                // `data.errors` contiene errores de campo específicos
                // `data.message` contiene un mensaje de error general
                throw {
                    status: response.status,
                    errors: data.errors || {}, // Asegurarse de que sea un objeto, incluso si está vacío
                    message: data.message || 'Error desconocido al procesar la solicitud.'
                };
            }
        } catch (error) {
            console.error('Error AJAX:', error);

            if (error.errors && Object.keys(error.errors).length > 0) {
                // Manejar errores específicos de campo
                Object.entries(error.errors).forEach(([fieldId, messages]) => {
                    // Las claves de error de Django coinciden con los IDs de entrada, por ejemplo, 'project_name', 'id_form-0-riskDescription'
                    // Necesitamos apuntar al elemento de entrada y a su correspondiente span de error
                    const inputElement = document.getElementById(fieldId);
                    const errorSpan = document.getElementById(`error-${fieldId}`);

                    if (inputElement) {
                        inputElement.classList.add('field-error-input');
                    }
                    if (errorSpan) {
                        // Asumiendo que 'messages' es un array de strings, unirlos
                        errorSpan.textContent = messages.join(' ');
                    }
                });
                showGeneralMessage(error.message || 'Por favor, corrija los errores en el formulario.', 'danger');
            } else {
                // Manejar mensajes de error generales (por ejemplo, error 500 del servidor, o mensaje del bloque catch)
                showGeneralMessage(error.message || 'Ocurrió un error inesperado. Por favor, inténtelo de nuevo.', 'danger');
            }
        }
    });

    // Inicializar la funcionalidad de eliminación de riesgos existentes si se renderizan inicialmente
    document.querySelectorAll('.risk-item .btn-remove-risk').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.risk-item').remove();
            reindexRisks();
        });
    });

    // Reindexar riesgos existentes al cargar la página para asegurar un estado inicial correcto
    // Esto es importante si Django renderiza formularios iniciales
    reindexRisks();

    // Selecciona el dialog y el botón de ayuda
    const dialog = document.getElementById('dialog');
    const btnHelp = document.getElementById('btn-help');
    const okButton = document.getElementById('ok-button');

    // Abre el modal al hacer clic en el botón de ayuda
    if (btnHelp && dialog) {
        btnHelp.addEventListener('click', function() {
            dialog.showModal();
        });
    }

    // Cierra el modal al hacer clic en el botón "Cerrar"
    if (okButton && dialog) {
        okButton.addEventListener('click', function() {
            dialog.close();
        });
    }
});