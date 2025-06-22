// Añadir al inicio del módulo
export const escapeHtml = (text) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
    };

    const escapeAttribute = (value) => {
    return String(value).replace(/"/g, '&quot;');
};

/**
 * Determina la clase CSS para un riesgo basado en su impacto
 * @param {Object} risk - Objeto que representa un riesgo
 * @returns {string} Clase CSS correspondiente al nivel de riesgo
 */
export const getRiskClass = (risk) => {
    let classType = '';
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
export const groupRisksByCategory = (risks) => {
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
export const countRisksByImpact = (risks, impactLevel) => {
    return risks.filter(r => r.Impacto === impactLevel).length;
};
