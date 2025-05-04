document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const logoutBtn = document.getElementById('logoutBtn');
    
    // Toggle Sidebar
    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
        mainContent.classList.toggle('shifted');
    });
    
    // Logout Functionality
    logoutBtn.addEventListener('click', function() {
        // Here you would typically make an API call to logout
        // For now, we'll just show an alert
        alert('Sesión cerrada con éxito');
        // Redirect to login page
        window.location.href = 'login.html';
    });
    
    // Sample data for projects table
    const projectsData = [
        {
            name: "Torre Residencial Miraflores",
            location: "Lima, Perú",
            startDate: "15/03/2024",
            endDate: "30/11/2025",
            risks: 5,
            status: "active"
        },
        {
            name: "Centro Comercial San Isidro",
            location: "Lima, Perú",
            startDate: "10/01/2024",
            endDate: "15/08/2024",
            risks: 2,
            status: "active"
        },
        {
            name: "Hospital Regional Cusco",
            location: "Cusco, Perú",
            startDate: "05/02/2023",
            endDate: "20/12/2024",
            risks: 8,
            status: "delayed"
        },
        {
            name: "Edificio de Oficinas La Molina",
            location: "Lima, Perú",
            startDate: "01/06/2024",
            endDate: "01/06/2025",
            risks: 3,
            status: "active"
        },
        {
            name: "Puente de Chosica",
            location: "Lima, Perú",
            startDate: "15/09/2023",
            endDate: "30/05/2024",
            risks: 7,
            status: "pending"
        },
        {
            name: "Condominio Playas de Asia",
            location: "Cañete, Perú",
            startDate: "01/04/2024",
            endDate: "15/12/2025",
            risks: 4,
            status: "active"
        },
        {
            name: "Terminal Terrestre Norte",
            location: "Lima, Perú",
            startDate: "10/03/2023",
            endDate: "30/09/2024",
            risks: 6,
            status: "delayed"
        }
    ];
    
    // Populate projects table
    const projectsTable = document.getElementById('projectsTable').getElementsByTagName('tbody')[0];
    
    function populateTable(data) {
        projectsTable.innerHTML = '';
        
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
            statusSpan.className = `status ${project.status}`;
            
            switch(project.status) {
                case 'active':
                    statusSpan.textContent = 'Activo';
                    break;
                case 'delayed':
                    statusSpan.textContent = 'Atrasado';
                    break;
                case 'pending':
                    statusSpan.textContent = 'Pendiente';
                    break;
                default:
                    statusSpan.textContent = 'Activo';
            }
            
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
            actionsCell.appendChild(editBtn);
            actionsCell.appendChild(deleteBtn);
        });
    }
    
    // Initialize table with all data
    //populateTable(projectsData);
    
    // Pagination variables
    let currentPage = 1;
    const rowsPerPage = 5;
    
    // Update pagination info
    function updatePaginationInfo() {
        const startItem = (currentPage - 1) * rowsPerPage + 1;
        const endItem = Math.min(currentPage * rowsPerPage, projectsData.length);
        
        document.getElementById('startItem').textContent = startItem;
        document.getElementById('endItem').textContent = endItem;
        document.getElementById('totalItems').textContent = projectsData.length;
        document.getElementById('currentPage').textContent = currentPage;
    }
    
    // Pagination controls
    document.getElementById('prevPage').addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            updatePaginationInfo();
            // In a real app, you would fetch data for the new page
        }
    });
    
    document.getElementById('nextPage').addEventListener('click', function() {
        const totalPages = Math.ceil(projectsData.length / rowsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            updatePaginationInfo();
            // In a real app, you would fetch data for the new page
        }
    });
    
    // Initialize pagination info
    updatePaginationInfo();
    
    // Search functionality
    document.getElementById('projectSearch').addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        
        if (searchTerm === '') {
            populateTable(projectsData);
            return;
        }
        
        const filteredData = projectsData.filter(project => 
            project.name.toLowerCase().includes(searchTerm) || 
            project.location.toLowerCase().includes(searchTerm)
        );
        
        populateTable(filteredData);
    });
    
    // In a real application, you would fetch this data from an API
   // document.getElementById('activeProjects').textContent = projectsData.filter(p => p.status === 'active').length;
    //document.getElementById('highRisks').textContent = projectsData.reduce((acc, project) => acc + (project.risks > 5 ? 1 : 0), 0);
   // document.getElementById('delayedProjects').textContent = projectsData.filter(p => p.status === 'delayed').length;
    
    // Simulate chart data (in a real app, you would use a library like Chart.js)
    function simulateCharts() {
        const risksByCategoryData = {
            'Estructural': 12,
            'Financiero': 8,
            'Logístico': 15,
            'Legal': 5,
            'Ambiental': 7
        };
        
        const riskImpactData = {
            'Bajo': 10,
            'Medio': 15,
            'Alto': 8,
            'Crítico': 5
        };
        
        // This is just a simulation - in a real app, you would use a charting library
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