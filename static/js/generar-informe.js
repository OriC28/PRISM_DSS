document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const generateReportBtn = document.getElementById('generateReportBtn');
    const reportType = document.getElementById('reportType');
    const timeRange = document.getElementById('timeRange');
    const reportPreview = document.getElementById('reportPreview');
    
    // Actualizar fecha del informe
    document.getElementById('reportDate').textContent = new Date().toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Generar informe PDF
    generateReportBtn.addEventListener('click', function() {
        if (!reportType.value) {
            alert('Por favor seleccione un tipo de informe');
            reportType.focus();
            return;
        }
        
        // Mostrar estado de carga
        const originalText = generateReportBtn.innerHTML;
        generateReportBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generando...';
        generateReportBtn.disabled = true;
        
        // Simular generación de PDF (en una implementación real usaríamos jsPDF)
        setTimeout(() => {
            // Restaurar botón
            generateReportBtn.innerHTML = originalText;
            generateReportBtn.disabled = false;
            
            // Mostrar mensaje de éxito
            alert(`Informe "${getReportTypeName()}" generado exitosamente para el período "${getTimeRangeName()}"`);
            
            // En una implementación real, aquí descargaríamos el PDF
            // downloadPDF();
        }, 1500);
    });
    
    // Cambiar vista previa según tipo de informe
    reportType.addEventListener('change', function() {
        // En una implementación real, actualizaríamos la vista previa según el tipo
        console.log('Tipo de informe seleccionado:', this.value);
    });
    
    // Cambiar vista previa según rango de tiempo
    timeRange.addEventListener('change', function() {
        // En una implementación real, actualizaríamos la vista previa según el rango
        console.log('Rango de tiempo seleccionado:', this.value);
    });
    
    // Helper para obtener nombre del tipo de informe
    function getReportTypeName() {
        const options = reportType.options;
        return options[options.selectedIndex].text;
    }
    
    // Helper para obtener nombre del rango de tiempo
    function getTimeRangeName() {
        const options = timeRange.options;
        return options[options.selectedIndex].text;
    }
    
    // Función para generar PDF (simulada)
    function downloadPDF() {
        // En una implementación real usaríamos jsPDF o similar
        console.log('Generando PDF...');
        
        // Ejemplo básico con jsPDF:
        /*
        const doc = new jsPDF();
        const reportTitle = `Informe PRISM DSS - ${getReportTypeName()}`;
        
        // Agregar contenido al PDF
        doc.text(reportTitle, 10, 10);
        doc.text(`Período: ${getTimeRangeName()}`, 10, 20);
        
        // Guardar PDF
        doc.save(`informe-prism-${new Date().toISOString().slice(0,10)}.pdf`);
        */
    }
});