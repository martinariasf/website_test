document.addEventListener('DOMContentLoaded', function() {
  console.log('Project Hours Tracker initialized');

  // Global variables
  let projects = JSON.parse(localStorage.getItem('evoProjects')) || [];
  let currentProjectId = null;
  let editingProjectId = null;

  // DOM elements
  const projectsContainer = document.getElementById('projectsContainer');
  const addProjectBtn = document.getElementById('addProjectBtn');
  const projectModal = document.getElementById('projectModal');
  const timeModal = document.getElementById('timeModal');
  const projectForm = document.getElementById('projectForm');
  const timeForm = document.getElementById('timeForm');
  const modalTitle = document.getElementById('modalTitle');

  // Initialize app
  init();

  function init() {
    renderProjects();
    setupEventListeners();
    
    // Set today's date as default
    document.getElementById('entryDate').value = new Date().toISOString().split('T')[0];
  }

  function setupEventListeners() {
    // Project modal events
    addProjectBtn.addEventListener('click', () => openProjectModal());
    document.getElementById('closeModal').addEventListener('click', closeProjectModal);
    document.getElementById('cancelModal').addEventListener('click', closeProjectModal);
    projectForm.addEventListener('submit', handleProjectSubmit);

    // Time modal events
    document.getElementById('closeTimeModal').addEventListener('click', closeTimeModal);
    document.getElementById('cancelTimeModal').addEventListener('click', closeTimeModal);
    timeForm.addEventListener('submit', handleTimeSubmit);

    // Close modals when clicking outside
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) closeProjectModal();
    });
    timeModal.addEventListener('click', (e) => {
      if (e.target === timeModal) closeTimeModal();
    });
  }

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  function openProjectModal(projectId = null) {
    editingProjectId = projectId;
    
    if (projectId) {
      const project = projects.find(p => p.id === projectId);
      modalTitle.textContent = 'Edit Project';
      document.getElementById('projectName').value = project.name || '';
      document.getElementById('projectClient').value = project.client || '';
      document.getElementById('projectDescription').value = project.description || '';
      document.getElementById('hourlyRate').value = project.hourlyRate || '';
    } else {
      modalTitle.textContent = 'Add New Project';
      projectForm.reset();
    }
    
    projectModal.classList.add('active');
  }

  function closeProjectModal() {
    projectModal.classList.remove('active');
    editingProjectId = null;
    projectForm.reset();
  }

  function openTimeModal(projectId) {
    currentProjectId = projectId;
    timeForm.reset();
    document.getElementById('entryDate').value = new Date().toISOString().split('T')[0];
    timeModal.classList.add('active');
  }

  function closeTimeModal() {
    timeModal.classList.remove('active');
    currentProjectId = null;
    timeForm.reset();
  }

  function handleProjectSubmit(e) {
    e.preventDefault();
    
    const projectData = {
      name: document.getElementById('projectName').value.trim(),
      client: document.getElementById('projectClient').value.trim(),
      description: document.getElementById('projectDescription').value.trim(),
      hourlyRate: parseFloat(document.getElementById('hourlyRate').value) || 0
    };

    if (editingProjectId) {
      // Update existing project
      const projectIndex = projects.findIndex(p => p.id === editingProjectId);
      projects[projectIndex] = { ...projects[projectIndex], ...projectData };
    } else {
      // Create new project
      const newProject = {
        id: generateId(),
        ...projectData,
        timeEntries: [],
        createdAt: new Date().toISOString()
      };
      projects.push(newProject);
    }

    saveData();
    renderProjects();
    closeProjectModal();
  }

  function handleTimeSubmit(e) {
    e.preventDefault();
    
    const timeEntry = {
      id: generateId(),
      task: document.getElementById('taskDescription').value.trim(),
      date: document.getElementById('entryDate').value,
      hours: parseFloat(document.getElementById('hoursWorked').value),
      notes: document.getElementById('entryNotes').value.trim(),
      createdAt: new Date().toISOString()
    };

    const project = projects.find(p => p.id === currentProjectId);
    if (project) {
      project.timeEntries.push(timeEntry);
      saveData();
      renderProjects();
      closeTimeModal();
    }
  }

  function deleteProject(projectId) {
    if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      projects = projects.filter(p => p.id !== projectId);
      saveData();
      renderProjects();
    }
  }

  function deleteTimeEntry(projectId, entryId) {
    if (confirm('Delete this time entry?')) {
      const project = projects.find(p => p.id === projectId);
      if (project) {
        project.timeEntries = project.timeEntries.filter(e => e.id !== entryId);
        saveData();
        renderProjects();
      }
    }
  }

  function calculateProjectStats(project) {
    const totalHours = project.timeEntries.reduce((sum, entry) => sum + entry.hours, 0);
    const totalEarnings = totalHours * (project.hourlyRate || 0);
    return { totalHours, totalEarnings };
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-GB');
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  }

  function renderProjects() {
    if (projects.length === 0) {
      projectsContainer.innerHTML = `
        <div class="card card-shadow text-center py-8">
          <h3 class="text-gray mb-4">No Projects Yet</h3>
          <p class="text-gray mb-6">Create your first project to start tracking hours.</p>
          <button class="btn btn-primary" onclick="document.getElementById('addProjectBtn').click()">
            + Create Project
          </button>
        </div>
      `;
      return;
    }

    projectsContainer.innerHTML = projects.map(project => {
      const stats = calculateProjectStats(project);
      const recentEntries = project.timeEntries
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

      return `
        <div class="card card-shadow card-orange">
          <div class="card-header">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="mb-2 text-orange">${project.name || 'Untitled Project'}</h2>
                ${project.client ? `<p class="text-gray mb-0"><strong>Client:</strong> ${project.client}</p>` : ''}
              </div>
              <div class="flex gap-2">
                <button class="btn btn-sm btn-outline" onclick="openProjectModal('${project.id}')">
                  Edit
                </button>
                <button class="btn btn-sm btn-ghost text-error" onclick="deleteProject('${project.id}')">
                  Delete
                </button>
              </div>
            </div>
          </div>
          
          <div class="card-body">
            ${project.description ? `<p class="text-gray mb-4">${project.description}</p>` : ''}
            
            <div class="grid grid-cols-3 gap-4 mb-6">
              <div class="text-center">
                <div class="text-2xl font-bold text-orange">${stats.totalHours}</div>
                <div class="text-sm text-gray uppercase">Total Hours</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-blue">${formatCurrency(stats.totalEarnings)}</div>
                <div class="text-sm text-gray uppercase">Total Earnings</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-gray">${project.timeEntries.length}</div>
                <div class="text-sm text-gray uppercase">Time Entries</div>
              </div>
            </div>

            <div class="flex items-center justify-between mb-4">
              <h4 class="mb-0">Recent Time Entries</h4>
              <button class="btn btn-sm btn-primary" onclick="openTimeModal('${project.id}')">
                + Log Time
              </button>
            </div>

            ${recentEntries.length > 0 ? `
              <div class="space-y-3">
                ${recentEntries.map(entry => `
                  <div class="flex items-center justify-between p-3 bg-light rounded">
                    <div class="flex-1">
                      <div class="font-bold">${entry.task}</div>
                      <div class="text-sm text-gray">
                        ${formatDate(entry.date)} • ${entry.hours}h
                        ${entry.notes ? ` • ${entry.notes}` : ''}
                      </div>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="badge badge-orange">${formatCurrency(entry.hours * (project.hourlyRate || 0))}</span>
                      <button class="btn btn-sm btn-ghost text-error" onclick="deleteTimeEntry('${project.id}', '${entry.id}')">
                        ×
                      </button>
                    </div>
                  </div>
                `).join('')}
              </div>
            ` : `
              <div class="text-center py-6 text-gray">
                <p>No time entries yet. Click "Log Time" to get started.</p>
              </div>
            `}
          </div>
        </div>
      `;
    }).join('');
  }

  function saveData() {
    localStorage.setItem('evoProjects', JSON.stringify(projects));
  }

  // Make functions available globally for onclick handlers
  window.openProjectModal = openProjectModal;
  window.openTimeModal = openTimeModal;
  window.deleteProject = deleteProject;
  window.deleteTimeEntry = deleteTimeEntry;
});