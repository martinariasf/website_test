document.addEventListener('DOMContentLoaded', function() {
  console.log('HTML Data Extractor initialized');
  
  // Get DOM elements
  const htmlFileInput = document.getElementById('htmlFile');
  const htmlTextArea = document.getElementById('htmlInput');
  const processBtn = document.getElementById('processBtn');
  const clearBtn = document.getElementById('clearBtn');
  const copyBtn = document.getElementById('copyBtn');
  const outputSection = document.getElementById('outputSection');
  const tableBody = document.getElementById('tableBody');
  const copyStatus = document.getElementById('copyStatus');
  
  // Data structure for vehicle information
  const dataFields = {
    'Vehicle & Test Information': {
      'VEH. MAKE/MODEL/BODY STYLE': ['make', 'model', 'body-style', 'vehicle-make', 'vehicle-model'],
      'VEH. MODEL YEAR': ['model-year', 'year', 'vehicle-year'],
      'TEST LABORATORY': ['test-lab', 'laboratory', 'test-laboratory'],
      'DATE OF TEST': ['test-date', 'date-test'],
      'DATE OF REPORT': ['report-date', 'date-report'],
      'LICENCE PLATE': ['license-plate', 'licence-plate', 'plate-number'],
      'CUSTOMER VEH. NO.': ['customer-vehicle-number', 'customer-veh-no', 'vehicle-number'],
      'VIN': ['vin', 'vehicle-identification'],
      'TEST/PROTOCOL NO.': ['test-protocol', 'protocol-number', 'test-number'],
      'TRANSMISSION TYPE': ['transmission', 'transmission-type']
    },
    'Vehicle Systems & Control Units': {
      'Gearbox': ['gearbox', 'transmission-control'],
      'Gearbox-Release (HW / SW)': ['gearbox-release', 'gearbox-hw-sw'],
      'Central Display (HW / SW)': ['central-display', 'display-hw-sw'],
      'Door Module (HW / SW)': ['door-module', 'door-hw-sw'],
      'Body Controller (HW / SW)': ['body-controller', 'bc-hw-sw'],
      'Rearview-System': ['rearview-system', 'rearview'],
      'IDC_C (HW / SW)': ['idc-c', 'idc-c-hw-sw'],
      'IDC_P (HW / SW)': ['idc-p', 'idc-p-hw-sw'],
      'CIVIC_M (HW / SW)': ['civic-m', 'civic-m-hw-sw'],
      'Central Powertrain Controller (CDCC_EV HW / SW)': ['cdcc-ev', 'powertrain-controller'],
      'Ignition Lock (EZS174 HW / SW)': ['ezs174', 'ignition-lock']
    }
  };
  
  // File input handler
  htmlFileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        htmlTextArea.value = e.target.result;
      };
      reader.readAsText(file);
    }
  });
  
  // Process button handler
  processBtn.addEventListener('click', function() {
    const htmlContent = htmlTextArea.value.trim();
    if (!htmlContent) {
      alert('Please upload an HTML file or paste HTML content.');
      return;
    }
    
    try {
      processHTML(htmlContent);
      outputSection.style.display = 'block';
      outputSection.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.error('Error processing HTML:', error);
      alert('Error processing HTML. Please check the file format.');
    }
  });
  
  // Clear button handler
  clearBtn.addEventListener('click', function() {
    htmlFileInput.value = '';
    htmlTextArea.value = '';
    outputSection.style.display = 'none';
    tableBody.innerHTML = '';
    copyStatus.style.display = 'none';
  });
  
  // Copy button handler
  copyBtn.addEventListener('click', function() {
    copyTableToClipboard();
  });
  
  // Process HTML content and extract data
  function processHTML(htmlContent) {
    // Create a temporary DOM element to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    // Clear previous results
    tableBody.innerHTML = '';
    copyStatus.style.display = 'none';
    
    // Extract data for each category
    Object.entries(dataFields).forEach(([category, fields]) => {
      Object.entries(fields).forEach(([fieldName, selectors]) => {
        let value = extractValue(tempDiv, selectors);
        addTableRow(category, fieldName, value || '(empty)');
      });
    });
  }
  
  // Extract value from HTML using various selectors
  function extractValue(htmlElement, selectors) {
    for (const selector of selectors) {
      // Try ID selector
      let element = htmlElement.querySelector(`#${selector}`);
      if (element) return getElementText(element);
      
      // Try class selector
      element = htmlElement.querySelector(`.${selector}`);
      if (element) return getElementText(element);
      
      // Try attribute selector
      element = htmlElement.querySelector(`[data-field="${selector}"]`);
      if (element) return getElementText(element);
      
      // Try name attribute
      element = htmlElement.querySelector(`[name="${selector}"]`);
      if (element) return getElementValue(element);
      
      // Try text content search
      const textElements = htmlElement.querySelectorAll('*');
      for (const textElement of textElements) {
        const text = textElement.textContent || '';
        if (text.toLowerCase().includes(selector.toLowerCase().replace('-', ' '))) {
          const parent = textElement.parentElement;
          const nextSibling = textElement.nextElementSibling;
          if (nextSibling) return getElementText(nextSibling);
          if (parent && parent.nextElementSibling) return getElementText(parent.nextElementSibling);
        }
      }
    }
    
    return null;
  }
  
  // Get text content from element
  function getElementText(element) {
    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT') {
      return element.value || element.textContent;
    }
    return element.textContent.trim();
  }
  
  // Get value from input elements
  function getElementValue(element) {
    if (element.value !== undefined) {
      return element.value;
    }
    return element.textContent.trim();
  }
  
  // Add row to the table
  function addTableRow(category, field, value) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${category}</td>
      <td>${field}</td>
      <td>${value}</td>
    `;
    tableBody.appendChild(row);
  }
  
  // Copy table to clipboard in Excel-friendly format
  function copyTableToClipboard() {
    const table = document.getElementById('dataTable');
    const rows = table.querySelectorAll('tr');
    let clipboardText = '';
    
    rows.forEach(row => {
      const cells = row.querySelectorAll('th, td');
      const rowData = Array.from(cells).map(cell => {
        // Escape tabs and newlines, wrap in quotes if necessary
        let text = cell.textContent.trim();
        if (text.includes('\t') || text.includes('\n') || text.includes('"')) {
          text = '"' + text.replace(/"/g, '""') + '"';
        }
        return text;
      });
      clipboardText += rowData.join('\t') + '\n';
    });
    
    // Use the modern Clipboard API if available
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(clipboardText).then(() => {
        showCopySuccess();
      }).catch(err => {
        console.error('Failed to copy: ', err);
        fallbackCopyTextToClipboard(clipboardText);
      });
    } else {
      fallbackCopyTextToClipboard(clipboardText);
    }
  }
  
  // Fallback clipboard copy method
  function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        showCopySuccess();
      } else {
        alert('Failed to copy table. Please select and copy manually.');
      }
    } catch (err) {
      console.error('Fallback copy failed: ', err);
      alert('Copy not supported. Please select and copy the table manually.');
    } finally {
      document.body.removeChild(textArea);
    }
  }
  
  // Show copy success message
  function showCopySuccess() {
    copyStatus.style.display = 'inline';
    setTimeout(() => {
      copyStatus.style.display = 'none';
    }, 3000);
  }
});