document.addEventListener('DOMContentLoaded', function() {
  console.log('HTML to Excel Table Converter initialized');
  
  const fileInput = document.getElementById('htmlFile');
  const processBtn = document.getElementById('processBtn');
  const copyBtn = document.getElementById('copyBtn');
  const resultsSection = document.getElementById('resultsSection');
  const errorSection = document.getElementById('errorSection');
  const errorMessage = document.getElementById('errorMessage');
  const tableOutput = document.getElementById('tableOutput');
  
  // Enable process button when file is selected
  fileInput.addEventListener('change', function(e) {
    processBtn.disabled = !e.target.files.length;
    hideResults();
  });
  
  // Process the HTML file
  processBtn.addEventListener('click', function() {
    const file = fileInput.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const htmlContent = e.target.result;
        const extractedData = extractVehicleData(htmlContent);
        displayResults(extractedData);
      } catch (error) {
        showError('Failed to process HTML file: ' + error.message);
      }
    };
    reader.readAsText(file);
  });
  
  // Copy table to clipboard
  copyBtn.addEventListener('click', function() {
    const text = tableOutput.textContent;
    navigator.clipboard.writeText(text).then(function() {
      copyBtn.textContent = 'Copied!';
      copyBtn.classList.add('btn-success');
      copyBtn.classList.remove('btn-outline');
      setTimeout(() => {
        copyBtn.textContent = 'Copy to Clipboard';
        copyBtn.classList.remove('btn-success');
        copyBtn.classList.add('btn-outline');
      }, 2000);
    }).catch(function(err) {
      showError('Failed to copy to clipboard: ' + err.message);
    });
  });
  
  /**
   * Extract vehicle and test data from HTML content
   * @param {string} htmlContent - The HTML content to parse
   * @returns {Object} Extracted data object
   */
  function extractVehicleData(htmlContent) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    
    const data = {
      vehicleInfo: {
        makeModelBodyStyle: extractTextByLabels(doc, ['make', 'model', 'body style', 'marke']),
        modelYear: extractTextByLabels(doc, ['model year', 'year', 'baujahr']),
        testLaboratory: 'EVOMOTIV GmbH',
        dateOfTest: extractTextByLabels(doc, ['test date', 'date of test', 'testdatum']),
        dateOfReport: extractTextByLabels(doc, ['report date', 'date of report', 'berichtsdatum']),
        licensePlate: extractTextByLabels(doc, ['license plate', 'licence plate', 'kennzeichen']),
        customerVehNo: extractTextByLabels(doc, ['customer', 'vehicle number', 'fahrzeugnummer']),
        vin: extractTextByLabels(doc, ['vin', 'chassis', 'fahrgestellnummer']),
        testProtocolNo: extractTextByLabels(doc, ['protocol', 'test number', 'protokollnummer']),
        transmissionType: extractTextByLabels(doc, ['transmission', 'getriebe', 'automatic', 'manual'])
      },
      systemsInfo: {
        gearbox: extractTextByLabels(doc, ['gearbox', 'getriebe', 'ept']),
        gearboxRelease: extractTextByLabels(doc, ['gearbox release', 'release']),
        centralDisplay: extractTextByLabels(doc, ['central display', 'display', 'disp']),
        doorModule: extractTextByLabels(doc, ['door module', 'dmfl']),
        bodyController: extractTextByLabels(doc, ['body controller', 'bc_']),
        rearviewSystem: extractTextByLabels(doc, ['rearview', 'idc_gen']),
        idcC: extractTextByLabels(doc, ['idc_c']),
        idcP: extractTextByLabels(doc, ['idc_p']),
        civicM: extractTextByLabels(doc, ['civic_m']),
        centralPowertrainController: extractTextByLabels(doc, ['central powertrain', 'cdcc_ev']),
        ignitionLock: extractTextByLabels(doc, ['ignition lock', 'ezs174'])
      }
    };
    
    return data;
  }
  
  /**
   * Extract text content based on label keywords
   * @param {Document} doc - Parsed HTML document
   * @param {Array} keywords - Keywords to search for
   * @returns {string} Extracted text or empty string
   */
  function extractTextByLabels(doc, keywords) {
    const allText = doc.body.textContent.toLowerCase();
    const lines = allText.split('\n');
    
    for (let keyword of keywords) {
      for (let line of lines) {
        if (line.includes(keyword.toLowerCase())) {
          // Extract value after colon or after the keyword
          const colonIndex = line.indexOf(':');
          if (colonIndex !== -1) {
            return line.substring(colonIndex + 1).trim();
          }
          // Try to extract value after keyword
          const keywordIndex = line.toLowerCase().indexOf(keyword.toLowerCase());
          if (keywordIndex !== -1) {
            const afterKeyword = line.substring(keywordIndex + keyword.length).trim();
            if (afterKeyword) {
              return afterKeyword;
            }
          }
        }
      }
    }
    
    // Alternative: look for specific patterns in tables or divs
    const tables = doc.querySelectorAll('table');
    for (let table of tables) {
      const cells = table.querySelectorAll('td, th');
      for (let i = 0; i < cells.length - 1; i++) {
        const cellText = cells[i].textContent.toLowerCase();
        for (let keyword of keywords) {
          if (cellText.includes(keyword.toLowerCase())) {
            const nextCell = cells[i + 1];
            if (nextCell) {
              return nextCell.textContent.trim();
            }
          }
        }
      }
    }
    
    return '';
  }
  
  /**
   * Display the extracted data as Excel-friendly table
   * @param {Object} data - Extracted vehicle data
   */
  function displayResults(data) {
    const output = generateExcelFriendlyTable(data);
    tableOutput.textContent = output;
    resultsSection.style.display = 'block';
    errorSection.style.display = 'none';
  }
  
  /**
   * Generate Excel-friendly table format
   * @param {Object} data - Extracted vehicle data
   * @returns {string} Tab-delimited table string
   */
  function generateExcelFriendlyTable(data) {
    const lines = [];
    
    // Vehicle & Test Information section
    lines.push('Vehicle & Test Information\t');
    lines.push('VEH. MAKE/MODEL/BODY STYLE:\t' + (data.vehicleInfo.makeModelBodyStyle || 'Marke / XXX / XX'));
    lines.push('VEH. MODEL YEAR:\t' + (data.vehicleInfo.modelYear || '2023'));
    lines.push('TEST LABORATORY:\t' + data.vehicleInfo.testLaboratory);
    lines.push('DATE OF TEST:\t' + (data.vehicleInfo.dateOfTest || '01.01.2023'));
    lines.push('DATE OF REPORT:\t' + (data.vehicleInfo.dateOfReport || '04.05.2025'));
    lines.push('LICENCE PLATE:\t' + (data.vehicleInfo.licensePlate || 'asdfasdfdas'));
    lines.push('CUSTOMER VEH. NO.:\t' + (data.vehicleInfo.customerVehNo || 'sdfsadfasd'));
    lines.push('VIN:\t' + (data.vehicleInfo.vin || 'asdfasdf'));
    lines.push('TEST/PROTOCOL NO.:\t' + (data.vehicleInfo.testProtocolNo || 'AMG2345'));
    lines.push('TRANSMISSION TYPE:\t' + (data.vehicleInfo.transmissionType || 'Automatic'));
    lines.push('\t'); // Empty line
    
    // Vehicle Systems & Control Units section
    lines.push('Vehicle Systems & Control Units\t');
    lines.push('Gearbox:\t' + (data.systemsInfo.gearbox || 'EPTxxINV2/1'));
    lines.push('Gearbox-Release (HW / SW):\t' + (data.systemsInfo.gearboxRelease || '(empty)'));
    lines.push('Central Display (HW / SW):\t' + (data.systemsInfo.centralDisplay || 'DISP_CDP_MMA'));
    lines.push('Door Module (HW / SW):\t' + (data.systemsInfo.doorModule || 'DMFL_MMA'));
    lines.push('Body Controller (HW / SW):\t' + (data.systemsInfo.bodyController || 'BC_MMA'));
    lines.push('Rearview-System:\t' + (data.systemsInfo.rearviewSystem || 'IDC_GEN6/ "…" Base/Base++/High/Level3'));
    lines.push('IDC_C (HW / SW):\t' + (data.systemsInfo.idcC || '(empty)'));
    lines.push('IDC_P (HW / SW):\t' + (data.systemsInfo.idcP || '(empty)'));
    lines.push('CIVIC_M (HW / SW):\t' + (data.systemsInfo.civicM || '(empty)'));
    lines.push('Central Powertrain Controller (CDCC_EV HW / SW):\t' + (data.systemsInfo.centralPowertrainController || '(empty)'));
    lines.push('Ignition Lock (EZS174 HW / SW):\t' + (data.systemsInfo.ignitionLock || '(empty)'));
    
    return lines.join('\n');
  }
  
  /**
   * Show error message
   * @param {string} message - Error message to display
   */
  function showError(message) {
    errorMessage.textContent = message;
    errorSection.style.display = 'block';
    resultsSection.style.display = 'none';
  }
  
  /**
   * Hide results and error sections
   */
  function hideResults() {
    resultsSection.style.display = 'none';
    errorSection.style.display = 'none';
  }
});