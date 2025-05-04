document.addEventListener('DOMContentLoaded', function() {
    // Elementos DOM principales
    const projectForm = document.getElementById('projectForm');
    const risksContainer = document.getElementById('risksContainer');
    const addRiskBtn = document.getElementById('addRiskButton');
    const cancelBtn = document.getElementById('cancelBtn');
    
    // Inicializar contador de riesgos basado en la cantidad inicial de formularios
    let riskCounter = document.querySelectorAll('.risk-item').length;

    // Función para agregar un nuevo riesgo
    function addRiskItem() {
        riskCounter++;
        const riskIndex = riskCounter - 1;

        const riskItem = document.createElement('div');
        riskItem.className = 'risk-item';
        riskItem.dataset.riskIndex = riskIndex;

        riskItem.innerHTML = `
            <div class="risk-header">
                <h4>Riesgo #${riskCounter}</h4>
                <button type="button" class="btn btn-remove-risk">
                    <i class="fas fa-times"></i> Eliminar
                </button>
            </div>
            <div class="form-grid">
                <div class="form-group">
                    <label for="form-${riskIndex}-riskDescription">Descripción del Riesgo</label>
                    <input type="text" id="form-${riskIndex}-riskDescription" name="form-${riskIndex}-riskDescription" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="form-${riskIndex}-riskMitigation">Medidas de Mitigación</label>
                    <select id="form-${riskIndex}-riskMitigation" name="form-${riskIndex}-riskMitigation" class="form-control" required>
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
                </div>
                <div class="form-group">
                    <label for="form-${riskIndex}-riskProbability">Probabilidad de Riesgo</label>
                    <input type="number" id="form-${riskIndex}-riskProbability" name="form-${riskIndex}-riskProbability" class="form-control" required 
                        min="10" max="90" step="1">
                </div>
                <div class="form-group">
                    <label for="form-${riskIndex}-riskImpact">Impacto de Riesgo</label>
                    <select id="form-${riskIndex}-riskImpact" name="form-${riskIndex}-riskImpact" class="form-control" required>
                        <option value="" disabled selected>Seleccione</option>
                        <option value="Bajo">Bajo</option>
                        <option value="Medio">Medio</option>
                        <option value="Alto">Alto</option>
                        <option value="Crítico">Crítico</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="form-${riskIndex}-riskStatus">Estado de Riesgo</label>
                    <select id="form-${riskIndex}-riskStatus" name="form-${riskIndex}-riskStatus" class="form-control" required>
                        <option value="" disabled selected>Seleccione</option>
                        <option value="Activo">Activo</option>
                        <option value="Mitigado">Mitigado</option>
                        <option value="Pendiente">Pendiente</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="form-${riskIndex}-riskCategory">Categoría de Riesgo</label>
                    <select id="form-${riskIndex}-riskCategory" name="form-${riskIndex}-riskCategory" class="form-control" required>
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
                </div>
            </div>
        `;

        risksContainer.appendChild(riskItem);

        // Actualizar el total de formularios en el formset
        document.getElementById('id_form-TOTAL_FORMS').value = riskCounter;

        // Agregar evento de eliminación
        const removeBtn = riskItem.querySelector('.btn-remove-risk');
        removeBtn.addEventListener('click', function() {
            riskItem.remove();
            riskCounter--;
            reindexRisks();
        });

        riskItem.scrollIntoView({ behavior: 'smooth' }); // Animación de desplazamiento
    }

    // Función para reindexar los riesgos
    function reindexRisks() {
        const riskItems = risksContainer.querySelectorAll('.risk-item');
        riskItems.forEach((item, index) => {
            item.dataset.riskIndex = index;

            item.querySelectorAll('[name]').forEach(field => {
                const newName = field.getAttribute('name').replace(/form-\d+-/, `form-${index}-`);
                field.setAttribute('name', newName);
            });
            item.querySelectorAll('[id]').forEach(field => {
                const newId = field.getAttribute('id').replace(/form-\d+-/, `form-${index}-`);
                field.setAttribute('id', newId);
            });
            item.querySelectorAll('label').forEach(label => {
                const newFor = label.getAttribute('for').replace(/form-\d+-/, `form-${index}-`);
                label.setAttribute('for', newFor);
            });
        });

        // Actualizar el total de formularios en el formset
        document.getElementById('id_form-TOTAL_FORMS').value = riskItems.length;
    }

    // Evento para agregar riesgo
    addRiskBtn.addEventListener('click', addRiskItem);

    // Evento para cancelar el formulario
    cancelBtn.addEventListener('click', function() {
        if (confirm('¿Estás seguro de que deseas cancelar? Los datos no guardados se perderán.')) {
            window.location.href = '/Dashboard'; // Cambia la URL según tu necesidad
        }
    });

    // Manejador de envío del formulario
    projectForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Validar campos requeridos
        const invalidFields = Array.from(projectForm.querySelectorAll('[required]'))
            .filter(field => !field.value.trim());

        if (invalidFields.length > 0) {
            invalidFields.forEach(field => {
                if (!field.classList.contains('invalid')) {
                    field.style.borderColor = 'var(--danger-color)';
                    field.classList.add('invalid');
                    field.addEventListener('input', function handler() {
                        if (this.value.trim()) {
                            this.style.borderColor = '';
                            this.classList.remove('invalid');
                            this.removeEventListener('input', handler);
                        }
                    });
                }
            });
            alert('Por favor complete todos los campos requeridos.');
            return;
        }

        // Configurar CSRF Token
        const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

        try {
            const response = await fetch(projectForm.action, {
                method: 'POST',
                body: new FormData(projectForm),
                headers: {
                    'X-CSRFToken': csrftoken,
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || 'Error del servidor');

            if (data.status === 'success') {
                alert('Proyecto registrado con éxito!');
                setTimeout(() => window.location.href = '/registrar-proyecto', 1000);
            } else {
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert(`Error: ${error.message}`);
        }
    });

    // Manejador para eliminar riesgos iniciales
    document.querySelectorAll('.btn-remove-risk').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.risk-item').remove();
            riskCounter--;
            reindexRisks();
        });
    });
});