import {generateRiskCategories} from './showRisks.js';
import {generateMitigationPlan} from './showMitigation.js';
import {escapeHtml, groupRisksByCategory, countRisksByImpact} from './utils.js';

export const displayAnalysisResults = (analysisDataArray, DOM) => {
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