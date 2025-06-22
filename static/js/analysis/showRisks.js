import {escapeHtml, getRiskClass} from './utils.js';

// Función separada para generar categorías de riesgo
export const generateRiskCategories = (riskCategories) => {
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