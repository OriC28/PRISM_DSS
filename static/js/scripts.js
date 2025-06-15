document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const logoutBtn = document.getElementById('logoutBtn');
    const projectsTable = document.getElementById('projectsTable').getElementsByTagName('tbody')[0];

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
    let projectsFromTable = [];
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
    projectsFromTable = readProjectsTableData('projectsTable');
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
            filteredData = readProjectsTableData('projectsTable');
        } else {
            filteredData = projectsFromTable.filter(project =>
                project.name.toLowerCase().includes(searchTerm) ||
                project.location.toLowerCase().includes(searchTerm)
            );
        }
        projectsFromTable = filteredData.slice();
        currentPage = 1;
        renderCurrentPage();
    });

    // Simulate chart data (in a real app, you would use a charting library)
    function simulateCharts() {
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

    simulateCharts();

    // Responsive adjustments
    function handleResize() {
        if (window.innerWidth > 768 && sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
            mainContent.classList.remove('shifted');
        }
    }

    window.addEventListener('resize', handleResize);
});