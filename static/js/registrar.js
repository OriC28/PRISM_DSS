document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const projectForm = document.getElementById('projectForm');
    const risksContainer = document.getElementById('risksContainer');
    const addRiskBtn = document.getElementById('addRiskBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    
    // Contador de riesgos
    let riskCounter = 1;
    
    // Función para agregar un nuevo riesgo
    function addRiskItem() {
        riskCounter++;
        const riskId = riskCounter;
        
        const riskItem = document.createElement('div');
        riskItem.className = 'risk-item';
        riskItem.dataset.riskId = riskId;
        
        riskItem.innerHTML = `
            <div class="risk-header">
                <h4>Riesgo #${riskId}</h4>
                <button type="button" class="btn btn-remove-risk">
                    <i class="fas fa-times"></i> Eliminar
                </button>
            </div>
            <div class="form-grid">
                <div class="form-group">
                    <label for="riskDescription${riskId}">Descripción del Riesgo</label>
                    <input type="text" id="riskDescription${riskId}" name="risks[${riskId-1}][description]">
                </div>
                
                <div class="form-group">
                    <label for="riskMitigation${riskId}">Medidas de Mitigación</label>
                    <input type="text" id="riskMitigation${riskId}" name="risks[${riskId-1}][mitigation]">
                </div>
                
                <div class="form-group">
                    <label for="riskProbability${riskId}">Probabilidad</label>
                    <select id="riskProbability${riskId}" name="risks[${riskId-1}][probability]">
                        <option value="baja">Baja</option>
                        <option value="media">Media</option>
                        <option value="alta">Alta</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="riskImpact${riskId}">Impacto</label>
                    <select id="riskImpact${riskId}" name="risks[${riskId-1}][impact]">
                        <option value="bajo">Bajo</option>
                        <option value="medio">Medio</option>
                        <option value="alto">Alto</option>
                        <option value="critico">Crítico</option>
                    </select>
                </div>
            </div>
        `;
        
        risksContainer.appendChild(riskItem);
        
        // Agregar evento al botón de eliminar
        const removeBtn = riskItem.querySelector('.btn-remove-risk');
        removeBtn.addEventListener('click', function() {
            riskItem.remove();
        });
        
        // Scroll to the new risk
        riskItem.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Evento para agregar riesgo
    addRiskBtn.addEventListener('click', addRiskItem);
    
    // Evento para cancelar
    cancelBtn.addEventListener('click', function() {
        if (confirm('¿Estás seguro de que deseas cancelar? Los datos no guardados se perderán.')) {
            window.location.href = 'dashboard.html';
        }
    });
    
    // Validación y envío del formulario
    projectForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar campos requeridos
        const requiredFields = projectForm.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = 'var(--danger-color)';
                isValid = false;
                
                // Resetear el estilo cuando el usuario corrija
                field.addEventListener('input', function() {
                    if (field.value.trim()) {
                        field.style.borderColor = '';
                    }
                });
            }
        });
        
        if (!isValid) {
            alert('Por favor complete todos los campos requeridos.');
            return;
        }
        
        // Recolectar datos del formulario
        const formData = new FormData(projectForm);
        const projectData = {
            basicInfo: {},
            risks: []
        };
        
        // Procesar datos básicos
        formData.forEach((value, key) => {
            if (key.startsWith('risks')) {
                // Procesaremos los riesgos después
                return;
            }
            projectData.basicInfo[key] = value;
        });
        
        // Procesar riesgos
        const riskItems = risksContainer.querySelectorAll('.risk-item');
        riskItems.forEach(item => {
            const riskId = item.dataset.riskId;
            const description = document.getElementById(`riskDescription${riskId}`).value;
            
            // Solo agregar riesgos con descripción
            if (description.trim()) {
                projectData.risks.push({
                    description: description,
                    mitigation: document.getElementById(`riskMitigation${riskId}`).value,
                    probability: document.getElementById(`riskProbability${riskId}`).value,
                    impact: document.getElementById(`riskImpact${riskId}`).value
                });
            }
        });
        
        // Aquí normalmente harías una llamada API para guardar los datos
        console.log('Datos del proyecto:', projectData);
        
        // Simular envío exitoso
        alert('Proyecto registrado con éxito!');
        projectForm.reset();
        
        // Redirigir al dashboard después de 1 segundo
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    });
    
    // Manejar el botón de eliminar del riesgo inicial
    const initialRemoveBtn = document.querySelector('.btn-remove-risk');
    if (initialRemoveBtn) {
        initialRemoveBtn.addEventListener('click', function() {
            const riskItem = this.closest('.risk-item');
            riskItem.remove();
        });
    }
});