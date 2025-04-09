document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const analysisForm = document.getElementById('analysisForm');
    const resultsSection = document.getElementById('resultsSection');
    const resultsContent = document.getElementById('resultsContent');
    const cancelBtn = document.getElementById('cancelBtn');
    const exportBtn = document.getElementById('exportBtn');
    
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
    
    // Validación y envío del formulario
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
            // Obtener datos del formulario
            const formData = new FormData(analysisForm);
            const projectData = {
                name: formData.get('projectName'),
                type: formData.get('projectType'),
                use: formData.get('projectUse'),
                budget: formData.get('projectBudget'),
                time: formData.get('projectTime'),
                description: formData.get('projectDescription')
            };
            
            // Generar resultados de análisis simulados
            const analysisResults = generateAnalysisResults(projectData);
            
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
    function generateAnalysisResults(projectData) {
        // Esto es un mock - en una implementación real sería el resultado de la IA
        const riskCategories = [
            {
                name: 'Riesgos Estructurales',
                risks: [
                    {
                        title: 'Diseño inadecuado para el tipo de suelo',
                        probability: 'Alta',
                        impact: 'Crítico',
                        description: 'Según el tipo de proyecto y ubicación, existe alta probabilidad de problemas estructurales si no se realiza un estudio de suelo adecuado.',
                        mitigation: 'Realizar un estudio geotécnico completo antes de iniciar el diseño estructural.'
                    },
                    {
                        title: 'Fallas en materiales de construcción',
                        probability: 'Media',
                        impact: 'Alto',
                        description: 'Uso de materiales de calidad inferior puede comprometer la integridad estructural.',
                        mitigation: 'Implementar controles de calidad estrictos y certificación de proveedores.'
                    }
                ]
            },
            {
                name: 'Riesgos Financieros',
                risks: [
                    {
                        title: 'Sobrecostos por inflación',
                        probability: projectData.type === 'residencial' ? 'Alta' : 'Media',
                        impact: 'Alto',
                        description: 'El presupuesto actual podría ser insuficiente considerando la inflación actual en materiales de construcción.',
                        mitigation: 'Incluir una reserva del 15% para contingencias y establecer contratos con cláusulas de ajuste.'
                    }
                ]
            },
            {
                name: 'Riesgos Logísticos',
                risks: [
                    {
                        title: 'Retrasos en entrega de materiales',
                        probability: 'Alta',
                        impact: 'Medio',
                        description: 'Problemas en la cadena de suministro podrían retrasar la ejecución del proyecto.',
                        mitigation: 'Diversificar proveedores y mantener inventario de seguridad para materiales críticos.'
                    }
                ]
            }
        ];
        
        return {
            project: projectData,
            riskCategories: riskCategories,
            summary: {
                totalRisks: 4,
                highPriority: 2,
                mediumPriority: 1,
                lowPriority: 1
            },
            recommendations: [
                'Realizar estudio de suelo antes de finalizar el diseño estructural.',
                'Asignar un 15% adicional del presupuesto para contingencias.',
                'Establecer un plan de gestión de proveedores alternativos.'
            ]
        };
    }
    
    // Mostrar resultados en la interfaz
    function displayAnalysisResults(results) {
        let html = `
            <div class="analysis-summary">
                <h4>Resumen del Análisis</h4>
                <p>El sistema ha identificado <strong>${results.summary.totalRisks} riesgos potenciales</strong> para su proyecto "${results.project.name}".</p>
                <div class="summary-cards">
                    <div class="summary-card critical">
                        <span>${results.summary.highPriority}</span>
                        <p>Riesgos Críticos/Altos</p>
                    </div>
                    <div class="summary-card medium">
                        <span>${results.summary.mediumPriority}</span>
                        <p>Riesgos Medios</p>
                    </div>
                    <div class="summary-card low">
                        <span>${results.summary.lowPriority}</span>
                        <p>Riesgos Bajos</p>
                    </div>
                </div>
            </div>
            
            <div class="recommendations">
                <h4>Recomendaciones Generales</h4>
                <ul>
                    ${results.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            </div>
        `;
        
        // Añadir categorías de riesgo
        results.riskCategories.forEach(category => {
            if (category.risks.length > 0) {
                html += `
                    <div class="risk-category">
                        <h4>${category.name}</h4>
                        ${category.risks.map(risk => `
                            <div class="risk-item ${getRiskClass(risk)}">
                                <div class="risk-title">
                                    <span>${risk.title}</span>
                                    <span class="risk-probability">Probabilidad: ${risk.probability}</span>
                                </div>
                                <p class="risk-description">${risk.description}</p>
                                <div class="risk-mitigation">
                                    <h5>Medida de Mitigación</h5>
                                    <p>${risk.mitigation}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;
            }
        });
        
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