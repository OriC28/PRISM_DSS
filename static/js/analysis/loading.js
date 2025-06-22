//Muestra el estado de carga durante el análisis
export const showLoadingState = (DOM) => {
    DOM.resultsSection.style.display = 'block';
    DOM.resultsContent.innerHTML = `
        <div class="loading-state">
            <div class="loading-spinner"></div>
            <p class="loading-text">Analizando proyecto con IA</p>
            <p class="loading-subtext">Esto puede tomar unos segundos...</p>
        </div>
    `;
};

//Oculta el estado de carga
export const hideLoadingState = (DOM) => {
    DOM.resultsSection.style.display = 'block';
    DOM.resultsContent.innerHTML = '';
    DOM.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start'});
};
