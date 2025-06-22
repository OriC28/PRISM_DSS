let projectsFromTable = JSON.parse(document.getElementById('projects-json').textContent);
let projectTypes = JSON.parse(document.getElementById('types-json').textContent);
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const logoutBtn = document.getElementById('logoutBtn');
    const projectsTable = document.getElementById('projectsTable').getElementsByTagName('tbody')[0];
    const riskImpactChart = document.getElementById('riskImpact');
    const risksDistributionChart = document.getElementById('risksDistribution');
    

    const data = document.querySelector('#risk-data').dataset;
    const lowRisk = data.lowRisks;
    const mediumRisk = data.mediumRisks;
    const highRisk = data.highRisks;

    //Dialog Close Button
    document.getElementById('ok-button').addEventListener('click', function() {
        document.getElementById('dialog').close();
    });

    // Toggle Sidebar
    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
        mainContent.classList.toggle('shifted');
    });

    // Logout Functionality
    logoutBtn.addEventListener('click', function() {
        alert('Sesión cerrada con éxito');
        window.location.href = 'login.html';
    });

    // Pagination variables
    let currentPage = 1;
    const rowsPerPage = 5;

    // Function to clear the table
    function clearTable() {
        projectsTable.innerHTML = '';
    }

    // Function to populate the table with paginated data
    function populateTable(data) {
        clearTable();
        data.forEach(project => {
            const row = projectsTable.insertRow();

            // Name
            const nameCell = row.insertCell(0);
            nameCell.textContent = project.name;

            // Location
            const locationCell = row.insertCell(1);
            locationCell.textContent = project.location;

            // Start Date
            const startDateCell = row.insertCell(2);
            const startDateFormatted = new Date(project.startDate).toLocaleDateString();
            startDateCell.textContent = startDateFormatted;

            // End Date
            const endDateCell = row.insertCell(3);
            const endDateFormatted = new Date(project.endDate).toLocaleDateString();
            endDateCell.textContent = endDateFormatted;

            // Risks
            const risksCell = row.insertCell(4);
            risksCell.textContent = project.risks;

            // Status
            const statusCell = row.insertCell(5);
            const statusSpan = document.createElement('span');
            let status = "";
            
            switch(project.status) {
                case 'Finalizado':
                    status = 'active';
                    break;
                case 'Atrasado':
                    status = 'delayed';
                    break;
                default:
                    status = 'pending'
                    statusSpan.textContent = 'Activo';
            }
            statusSpan.textContent = project.status;
            statusSpan.className = `status ${status}`;
            statusCell.appendChild(statusSpan);

            // Actions
            const actionsCell = row.insertCell(6);
            const viewBtn = document.createElement('button');
            viewBtn.className = 'action-btn';
            viewBtn.innerHTML = '<i class="fas fa-eye"></i>';
            viewBtn.title = 'Ver detalles';
            
            viewBtn.addEventListener('click', function() {
                const dialog = document.getElementById('dialog');
                const modalContent = document.getElementById('dialog-content');
                modalContent.innerHTML = '';

                function truncateText(text, maxLength = 55) {
                    if (typeof text !== 'string') text = String(text ?? '');
                    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
                }
                // Helper para crear y añadir un campo
                function addField(label, value) {
                    const p = document.createElement('p');
                    const strong = document.createElement('strong');
                    strong.textContent = label + ': ';
                    p.appendChild(strong);
                    p.appendChild(document.createTextNode(truncateText(value)));
                    modalContent.appendChild(p);
                }
                
                addField('Nombre', project.name);
                addField('Ubicación', project.location);
                addField('Fecha de Inicio', new Date(project.startDate).toLocaleDateString());
                addField('Fecha de Fin', new Date(project.endDate).toLocaleDateString());
                addField('Riesgos', project.risks);
                addField('Estado', project.status);
                addField('Descripción', project.description || 'No disponible');
                addField('Tipo de Proyecto', project.type);
                addField('Presupuesto', project.budget);
                addField('Cantidad de Empleados', project.employees_quantity);
                dialog.showModal();
            });
            actionsCell.appendChild(viewBtn);
        });
    }
    // Function to read projects from table and return as array of objects
    function readProjectsTableData(tableId) {
        const table = document.getElementById(tableId);
        const rows = table.querySelectorAll('tbody tr');
        const data = [];

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            const obj = {};
            obj.name = cells[0]?.textContent.trim();
            obj.location = cells[1]?.textContent.trim();
            obj.startDate = cells[2]?.textContent.trim();
            obj.endDate = cells[3]?.textContent.trim();
            obj.risks = Number(cells[4]?.textContent.trim());
            const statusText = cells[5]?.textContent.trim();
            obj.status =  statusText;
            data.push(obj);
        });
        return data;
    }

    // Get projects from table, clear table, and use for pagination

    function refreshProjectsFromTable() {
        projectsFromTable = readProjectsTableData('projectsTable');
        clearTable();
    }

    // Function to get paginated data
    function getPaginatedData() {
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return projectsFromTable.slice(start, end);
    }

    // Update pagination info
    function updatePaginationInfo() {
        const startItem = (currentPage - 1) * rowsPerPage + 1;
        const endItem = Math.min(currentPage * rowsPerPage, projectsFromTable.length);
        document.getElementById('startItem').textContent = startItem;
        document.getElementById('endItem').textContent = endItem;
        document.getElementById('totalItems').textContent = projectsFromTable.length;
        document.getElementById('currentPage').textContent = currentPage;
    }

    // Render current page
    function renderCurrentPage() {
        populateTable(getPaginatedData());
        updatePaginationInfo();
    }

    // Inicializar: obtener los proyectos de la tabla inicial y luego usar projectsFromTable para paginar
    let initialProjects = projectsFromTable;
    clearTable();
    renderCurrentPage();

    // Controles de paginación
    document.getElementById('prevPage').addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            renderCurrentPage();
        }
    });

    document.getElementById('nextPage').addEventListener('click', function() {
        const totalPages = Math.ceil(projectsFromTable.length / rowsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderCurrentPage();
        }
    });

    // Búsqueda: filtra projectsFromTable y pagina sobre ese resultado
    document.getElementById('projectSearch').addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        let filteredData;
        if (searchTerm === '') {
            filteredData = initialProjects.slice();
        } else {
            filteredData = initialProjects.filter(project =>
                project.name.toLowerCase().includes(searchTerm) ||
                project.location.toLowerCase().includes(searchTerm)
            );
        }
        projectsFromTable = filteredData.slice();
        currentPage = 1;
        renderCurrentPage();
    });

    // Simulate chart data (in a real app, you would use a charting library)
    function drawRiskDistributionChart() {
        labelsUsed = [];
        datasetsUsed = [];
        for (const type of projectTypes) {
            labelsUsed.push(type.type);
            datasetsUsed.push(type.count);
        }
        new Chart (risksDistributionChart, {
            type: 'pie',
            data: {
                labels: labelsUsed,
                datasets: [{
                    label: 'Riesgos por Categoría',
                    data: datasetsUsed,
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(99, 193, 255, 0.2)',
                        'rgba(255, 99, 242, 0.2)'
                    ],
                    borderColor: [
                        'rgba(75, 192, 192, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgb(99, 193, 255)',
                        'rgb(255, 99, 242)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {

            }
        })
    }
    function drawImpactChart() {
        new Chart (riskImpactChart, {
            type: 'bar',
            data: {
                labels: ['Bajo', 'Medio', 'Alto'],
                datasets: [{
                    label: 'Impacto de Riesgos',
                    data: [lowRisk, mediumRisk, highRisk],
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(255, 99, 132, 0.2)'
                    ],
                    borderColor: [
                        'rgba(75, 192, 192, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(255, 99, 132, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        })
    }
    function nullCharts() {
        document.getElementById('risksByCategoryChart').innerHTML =
            `<div style="text-align: center; padding-top: 120px;">
                <i class="fas fa-chart-pie" style="font-size: 3rem; color: #ccc;"></i>
                <p>Gráfico de riesgos por categoría</p>
            </div>`;

        document.getElementById('riskImpactChart').innerHTML =
            `<div style="text-align: center; padding-top: 120px;">
                <i class="fas fa-chart-bar" style="font-size: 3rem; color: #ccc;"></i>
                <p>Gráfico de impacto de riesgos</p>
            </div>`;
    }
    try{
        drawImpactChart();
        drawRiskDistributionChart();
    }
    catch(e){
        nullCharts();

    }
    // Responsive adjustments
    function handleResize() {
        if (window.innerWidth > 768 && sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
            mainContent.classList.remove('shifted');
        }
    }

    window.addEventListener('resize', handleResize);
});