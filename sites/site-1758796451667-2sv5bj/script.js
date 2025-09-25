document.addEventListener('DOMContentLoaded', function() {
  console.log('FMVSS 111 Test Report Generator initialized');
  
  // Application state
  const appState = {
    isLoggedIn: false,
    editMode: false,
    templateLoaded: false,
    reportData: {}
  };
  
  // DOM elements
  const elements = {
    pinModal: document.getElementById('pinModal'),
    pinInput: document.getElementById('pinInput'),
    submitPin: document.getElementById('submitPin'),
    pinError: document.getElementById('pinError'),
    main: document.getElementById('main'),
    fileInput: document.getElementById('fileInput'),
    loadTemplate: document.getElementById('loadTemplate'),
    reportSection: document.getElementById('reportSection'),
    reportContent: document.getElementById('reportContent'),
    testDataSection: document.getElementById('testDataSection'),
    editModeToggle: document.getElementById('editModeToggle'),
    editModeStatus: document.getElementById('editModeStatus'),
    saveReport: document.getElementById('saveReport'),
    exportReport: document.getElementById('exportReport')
  };
  
  // PIN authentication
  const CORRECT_PIN = '1234';
  
  function initializeApp() {
    // PIN modal event listeners
    elements.submitPin.addEventListener('click', handlePinSubmit);
    elements.pinInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        handlePinSubmit();
      }
    });
    
    // File upload event listeners
    elements.fileInput.addEventListener('change', handleFileSelect);
    elements.loadTemplate.addEventListener('click', handleTemplateLoad);
    
    // Edit mode toggle
    elements.editModeToggle.addEventListener('click', toggleEditMode);
    
    // Save and export
    elements.saveReport.addEventListener('click', saveReport);
    elements.exportReport.addEventListener('click', exportReport);
    
    // Focus on PIN input
    elements.pinInput.focus();
  }
  
  function handlePinSubmit() {
    const enteredPin = elements.pinInput.value.trim();
    
    if (enteredPin === CORRECT_PIN) {
      appState.isLoggedIn = true;
      elements.pinModal.classList.remove('active');
      elements.main.style.display = 'block';
      elements.pinError.style.display = 'none';
      console.log('Access granted');
    } else {
      elements.pinError.style.display = 'block';
      elements.pinInput.value = '';
      elements.pinInput.focus();
      
      // Add shake animation
      elements.pinInput.style.animation = 'shake 0.5s';
      setTimeout(() => {
        elements.pinInput.style.animation = '';
      }, 500);
    }
  }
  
  function handleFileSelect() {
    const file = elements.fileInput.files[0];
    if (file && file.type === 'text/html') {
      elements.loadTemplate.disabled = false;
      console.log('HTML file selected:', file.name);
    } else {
      elements.loadTemplate.disabled = true;
      if (file) {
        showAlert('Please select a valid HTML file.', 'error');
      }
    }
  }
  
  function handleTemplateLoad() {
    const file = elements.fileInput.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
      const htmlContent = e.target.result;
      loadTemplate(htmlContent);
    };
    reader.readAsText(file);
  }
  
  function loadTemplate(htmlContent) {
    try {
      // Create a temporary container to parse HTML safely
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      
      // Extract body content or use full content
      const bodyContent = tempDiv.querySelector('body');
      const contentToLoad = bodyContent ? bodyContent.innerHTML : htmlContent;
      
      // Load content into report area
      elements.reportContent.innerHTML = contentToLoad;
      
      // Show report sections
      elements.reportSection.style.display = 'block';
      elements.testDataSection.style.display = 'block';
      
      // Show control buttons
      elements.editModeToggle.style.display = 'block';
      elements.saveReport.style.display = 'block';
      elements.exportReport.style.display = 'block';
      
      appState.templateLoaded = true;
      
      // Make imported content editable on click (when in edit mode)
      makeContentClickable();
      
      showAlert('Template loaded successfully!', 'success');
      console.log('Template loaded successfully');
      
    } catch (error) {
      console.error('Error loading template:', error);
      showAlert('Error loading template. Please check the file format.', 'error');
    }
  }
  
  function makeContentClickable() {
    const reportElements = elements.reportContent.querySelectorAll('p, span, div, td, h1, h2, h3, h4, h5, h6');
    
    reportElements.forEach(element => {
      // Skip elements that are already input fields or buttons
      if (element.tagName.toLowerCase() === 'input' || 
          element.tagName.toLowerCase() === 'button' ||
          element.tagName.toLowerCase() === 'script') {
        return;
      }
      
      element.addEventListener('click', function() {
        if (appState.editMode) {
          makeElementEditable(element);
        }
      });
      
      element.style.cursor = 'pointer';
      element.title = 'Click to edit when in edit mode';
    });
  }
  
  function makeElementEditable(element) {
    if (element.isContentEditable) return; // Already editable
    
    const originalContent = element.textContent;
    element.contentEditable = true;
    element.style.backgroundColor = '#fff3e0';
    element.style.border = '2px dashed var(--evo-orange)';
    element.style.padding = '4px';
    element.focus();
    
    // Save on blur or Enter key
    const saveEdit = () => {
      element.contentEditable = false;
      element.style.backgroundColor = '';
      element.style.border = '';
      element.style.padding = '';
      
      // Store changes in app state
      const fieldId = generateFieldId(element);
      appState.reportData[fieldId] = element.textContent;
      
      showAlert('Field updated', 'info');
    };
    
    element.addEventListener('blur', saveEdit, { once: true });
    element.addEventListener('keypress', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        element.blur();
      }
    }, { once: true });
  }
  
  function generateFieldId(element) {
    // Generate a unique ID based on element content and position
    const text = element.textContent.substring(0, 20).replace(/\s+/g, '_');
    const tagName = element.tagName.toLowerCase();
    return `${tagName}_${text}_${Date.now()}`;
  }
  
  function toggleEditMode() {
    appState.editMode = !appState.editMode;
    
    if (appState.editMode) {
      elements.editModeToggle.textContent = 'Exit Edit Mode';
      elements.editModeToggle.className = 'btn btn-secondary btn-sm';
      elements.editModeStatus.textContent = 'Edit Mode';
      elements.editModeStatus.className = 'badge badge-orange';
      
      // Enable form fields
      const editableFields = document.querySelectorAll('.editable');
      editableFields.forEach(field => {
        if (field.tagName.toLowerCase() === 'select') {
          field.disabled = false;
        } else {
          field.readOnly = false;
        }
        field.style.backgroundColor = '#fff3e0';
      });
      
      showAlert('Edit mode enabled. Click any field to edit.', 'info');
    } else {
      elements.editModeToggle.textContent = 'Enable Edit Mode';
      elements.editModeToggle.className = 'btn btn-outline btn-sm';
      elements.editModeStatus.textContent = 'View Mode';
      elements.editModeStatus.className = 'badge badge-gray';
      
      // Disable form fields
      const editableFields = document.querySelectorAll('.editable');
      editableFields.forEach(field => {
        if (field.tagName.toLowerCase() === 'select') {
          field.disabled = true;
        } else {
          field.readOnly = true;
        }
        field.style.backgroundColor = '';
      });
      
      // Save current form data
      saveFormData();
      showAlert('Edit mode disabled. Data saved.', 'info');
    }
  }
  
  function saveFormData() {
    const editableFields = document.querySelectorAll('.editable');
    editableFields.forEach(field => {
      const fieldName = field.getAttribute('data-field');
      if (fieldName) {
        appState.reportData[fieldName] = field.value;
      }
    });
  }
  
  function saveReport() {
    if (!appState.templateLoaded) {
      showAlert('No template loaded to save.', 'error');
      return;
    }
    
    // Save current form data
    saveFormData();
    
    // Create save data object
    const saveData = {
      timestamp: new Date().toISOString(),
      templateContent: elements.reportContent.innerHTML,
      formData: appState.reportData,
      metadata: {
        version: '1.0.0',
        generator: 'FMVSS 111 Test Report Generator'
      }
    };
    
    // Download as JSON file
    const downloadBlob = new Blob([JSON.stringify(saveData, null, 2)], {
      type: 'application/json'
    });
    
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(downloadBlob);
    downloadLink.download = `fmvss111_report_${formatDate(new Date())}.json`;
    downloadLink.click();
    
    showAlert('Report saved successfully!', 'success');
  }
  
  function exportReport() {
    if (!appState.templateLoaded) {
      showAlert('No template loaded to export.', 'error');
      return;
    }
    
    // Create complete HTML document
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>FMVSS 111 Test Report - ${formatDate(new Date())}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
    .header { text-align: center; margin-bottom: 30px; }
    .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="header">
    <h1>FMVSS 111 Test Report</h1>
    <p>Generated on: ${new Date().toLocaleString()}</p>
  </div>
  
  ${elements.reportContent.innerHTML}
  
  <div class="footer">
    <p>© Evomotiv GmbH 2025 - FMVSS 111 Test Report Generator</p>
  </div>
</body>
</html>`;
    
    // Download as HTML file
    const downloadBlob = new Blob([fullHtml], {
      type: 'text/html'
    });
    
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(downloadBlob);
    downloadLink.download = `fmvss111_report_${formatDate(new Date())}.html`;
    downloadLink.click();
    
    showAlert('Report exported as HTML!', 'success');
  }
  
  function showAlert(message, type) {
    // Create alert element
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} fade-in`;
    alertDiv.textContent = message;
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '9999';
    alertDiv.style.minWidth = '300px';
    
    document.body.appendChild(alertDiv);
    
    // Remove after 3 seconds
    setTimeout(() => {
      alertDiv.style.opacity = '0';
      setTimeout(() => {
        if (alertDiv.parentNode) {
          alertDiv.parentNode.removeChild(alertDiv);
        }
      }, 300);
    }, 3000);
  }
  
  function formatDate(date) {
    return date.toISOString().split('T')[0].replace(/-/g, '');
  }
  
  // Add CSS for shake animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }
  `;
  document.head.appendChild(style);
  
  // Initialize the application
  initializeApp();
});