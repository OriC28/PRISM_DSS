let menuToggle;
let sidebar;
let logoutBtn;
let prevbtn;
let nextbtn;
let riskImpactChart;
let risksDistributionChart;
let startItem;
let endItem;
let totalItems;
let lowRisk;
let mediumRisk;
let highRisk;

debugger;
const project_data = JSON.parse(document.currentScript.previousElementSibling.textContent);

let currentPage = 1;
const rowsPerPage = 5;

document.addEventListener('DOMContentLoaded', function() {
    menuToggle = document.getElementById('menuToggle');
    sidebar = document.getElementById('sidebar');
    mainContent = document.getElementById('mainContent');
    logoutBtn = document.getElementById('logoutBtn');
    projectsTable = document.getElementById('projectsTable').getElementsByTagName('tbody')[0];
    riskImpactChart = document.getElementById('riskImpact');
    risksDistributionChart = document.getElementById('risksDistribution');
    lowRisk = Number(document.getElementById('lowRisk').value);
    mediumRisk = Number(document.getElementById('mediumRisk').value);
    highRisk = Number(document.getElementById('highRisk').value);
    prevbtn = document.getElementById('prevPage');
    nextbtn = document.getElementById('nextPage');
    startItem = document.getElementById('startItem');
    endItem = document.getElementById('endItem');
    totalItems = document.getElementById('totalItems');
    
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
        // Controles de paginación
    prevbtn.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            renderCurrentPage();
        }
    });

    nextbtn.addEventListener('click', function() {
        const totalPages = Math.ceil(project_data.length / rowsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderCurrentPage();
        }
    });
    function clearTable(table=projectsTable){
    table.innerHTML = '';
}
function populateTable(data, table=projectsTable){
    clearTable(table);
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
        startDateCell.textContent = project.startDate;

        // End Date
        const endDateCell = row.insertCell(3);
        endDateCell.textContent = project.endDate;

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

        const editBtn = document.createElement('button');
        editBtn.className = 'action-btn';
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.title = 'Editar';

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'action-btn delete';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.title = 'Eliminar';

        actionsCell.appendChild(viewBtn);
           //todavia no se si iran esos botones
            // actionsCell.appendChild(editBtn);
           // actionsCell.appendChild(deleteBtn);
    });
} 
   function getPaginatedData(projects = []) {
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return projects.slice(start, end);
    }

    // Update pagination info
    function updatePaginationInfo(projectsFromTable = []) {
        const startItem = (currentPage - 1) * rowsPerPage + 1;
        const endItem = Math.min(currentPage * rowsPerPage, projectsFromTable.length);
        document.getElementById('startItem').textContent = startItem;
        document.getElementById('endItem').textContent = endItem;
        document.getElementById('totalItems').textContent = projectsFromTable.length;
        document.getElementById('currentPage').textContent = currentPage;
    }

    // Render current page
    function renderCurrentPage(data = []) {
        populateTable(getPaginatedData());
        updatePaginationInfo();
    }


    function drawRiskDistributionChart() {
        new Chart (risksDistributionChart, {
            type: 'pie',
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
    renderCurrentPage(project_data);
});

