import {escapeHtml} from './utils.js';

// Función separada para generar el plan de mitigación
export const generateMitigationPlan = (recommendations) => {
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
