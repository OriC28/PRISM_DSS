document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const data = JSON.parse(document.getElementById('iaResponseData').textContent);
    const analysisForm = document.getElementById('analysisForm');
    const resultsSection = document.getElementById('resultsSection');
    const resultsContent = document.getElementById('resultsContent');
    const cancelBtn = document.getElementById('cancelBtn');
    const exportBtn = document.getElementById('exportBtn');
    
    console.log(data)
    // Evento para cancelar
    cancelBtn.addEventListener('click', function() {
        if (confirm('¿Estás seguro de que deseas cancelar? Los datos no guardados se perderán.')) {
            window.location.href = 'dashboard.html';
        }
    });
    
    // Evento para exportar resultados
    exportBtn.addEventListener('click', function() {
        // En una implementación real, esto generaría un PDF
        alert('Funcionalidad de exportación se implementará en la versión final');
        // Aquí iría el código para generar el PDF con librerías como jsPDF
    });
    
    analysisForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar campos requeridos
        const requiredFields = analysisForm.querySelectorAll('[required]');
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
        
        // Mostrar estado de carga
        showLoadingState();
        
        // Simular análisis con IA (en una implementación real sería una llamada API)
        setTimeout(() => {
            // Generar resultados de análisis simulados
            const analysisResults = generateAnalysisResults(data);
            
            // Mostrar resultados
            displayAnalysisResults(analysisResults);
        }, 2000);
    });

    // Mostrar estado de carga
    function showLoadingState() {
        resultsSection.style.display = 'block';
        resultsContent.innerHTML = `
            <div class="loading-state">
                <div class="loading-spinner"></div>
                <p class="loading-text">Analizando proyecto con IA</p>
                <p class="loading-subtext">Esto puede tomar unos segundos...</p>
            </div>
        `;
        
        // Scroll a los resultados
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    // Generar resultados de análisis simulados
    function generateAnalysisResults(data) {
        return {
            Proyecto: data.ProyectoAnalizado,
            Riesgos: data.Riesgos,
            Calculos: {
                riesgosTotales: data.Riesgos.length,
                Impacto: data.Riesgos.map(risk => risk.Impacto),
                Probabilidad: data.Riesgos.map(risk => risk.Probabilidad),
            },
            Mitigaciones: data.Mitigaciones
        };
    }
    
    // Mostrar resultados en la interfaz
    function displayAnalysisResults(results) {
        let html = `
            <div class="analysis-summary">
                <h2>Resumen del Análisis</h2>
                <p>El sistema ha identificado <strong>${results.Calculos.riesgosTotales} riesgos potenciales</strong> para su proyecto "${results.Proyecto}".</p><br>
                <div class="summary-cards">
                    ${results.Riesgos.map(risk => 
                        `<div class="summary-card critical">
                            <strong>Categoría:</strong> ${risk.Categoria}<br>
                            <p><strong>Descripción:</strong> ${risk.Descripcion}</p>
                            <strong>Impacto:</strong> ${risk.Impacto}<br>
                            <strong>Probabilidad:</strong> ${risk.Probabilidad}<br>
                        </div>`
                    ).join('')}
                </div>
            </div>
            
            <div class="recommendations">
                <h2>Recomendaciones Generales</h2>
                <ul>
                    ${
                        results.Mitigaciones.map(
                            rec => `<strong>Riesgo Asociado:</strong> ${rec.RiesgoAsociado}<br>
                            <li>${rec.Accion}</li>`
                        ).join('')
                    }
                </ul>
            </div>
        `;
        resultsContent.innerHTML = html;
    }
    
    // Clasificar riesgo según impacto
    function getRiskClass(risk) {
        switch(risk.impact.toLowerCase()) {
            case 'crítico':
                return 'critical';
            case 'alto':
                return 'high';
            case 'medio':
                return 'medium';
            default:
                return 'low';
        }
    }
});