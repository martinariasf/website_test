document.addEventListener('DOMContentLoaded', function() {
  console.log('XML to Vehicle Test Data Table Converter initialized');
  
  const xmlFileInput = document.getElementById('xmlFile');
  const processBtn = document.getElementById('processBtn');
  const copyBtn = document.getElementById('copyBtn');
  const resultsSection = document.getElementById('resultsSection');
  const errorSection = document.getElementById('errorSection');
  const errorMessage = document.getElementById('errorMessage');
  const tableBody = document.getElementById('tableBody');
  const xmlPreview = document.getElementById('xmlPreview');
  
  let currentXmlDoc = null;
  
  // Enable process button when file is selected
  xmlFileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    processBtn.disabled = !file;
    hideResults();
  });
  
  // Process XML file
  processBtn.addEventListener('click', function() {
    const file = xmlFileInput.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const xmlText = e.target.result;
        xmlPreview.value = xmlText;
        
        const parser = new DOMParser();
        currentXmlDoc = parser.parseFromString(xmlText, 'text/xml');
        
        // Check for parsing errors
        const parserError = currentXmlDoc.querySelector('parsererror');
        if (parserError) {
          throw new Error('Invalid XML format');
        }
        
        extractAndDisplayData();
        hideError();
        showResults();
        
      } catch (error) {
        console.error('Error processing XML:', error);
        showError('Failed to process XML file: ' + error.message);
        hideResults();
      }
    };
    
    reader.onerror = function() {
      showError('Failed to read file');
    };
    
    reader.readAsText(file);
  });
  
  // Copy table functionality
  copyBtn.addEventListener('click', function() {
    const table = document.getElementById('dataTable');
    const range = document.createRange();
    range.selectNode(table);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    
    try {
      document.execCommand('copy');
      copyBtn.textContent = 'Copied!';
      copyBtn.classList.add('btn-success');
      copyBtn.classList.remove('btn-outline');
      
      setTimeout(() => {
        copyBtn.textContent = 'Copy Table';
        copyBtn.classList.remove('btn-success');
        copyBtn.classList.add('btn-outline');
      }, 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
    
    window.getSelection().removeAllRanges();
  });
  
  function extractAndDisplayData() {
    if (!currentXmlDoc) return;
    
    // Clear previous results
    tableBody.innerHTML = '';
    
    // Extract vehicle and test information
    const data = {
      // Vehicle Information
      vehicleMake: getXmlValue(['VehicleMake', 'Make', 'Manufacturer']),
      vehicleModel: getXmlValue(['VehicleModel', 'Model']),
      bodyStyle: getXmlValue(['BodyStyle', 'Body', 'VehicleType']),
      modelYear: getXmlValue(['ModelYear', 'Year', 'VehicleYear']),
      
      // Test Information
      testLaboratory: getXmlValue(['TestLaboratory', 'Laboratory', 'TestingFacility']) || 'EVOMOTIV GmbH',
      testDate: getXmlValue(['TestDate', 'DateOfTest']),
      reportDate: getXmlValue(['ReportDate', 'DateOfReport']),
      
      // Vehicle Identification
      licensePlate: getXmlValue(['LicensePlate', 'PlateNumber', 'RegistrationNumber']),
      customerVehicleNo: getXmlValue(['CustomerVehicleNumber', 'CustomerVehNo', 'VehicleNumber']),
      vin: getXmlValue(['VIN', 'ChassisNumber', 'VehicleIdentificationNumber']),
      testProtocolNo: getXmlValue(['TestProtocolNumber', 'ProtocolNumber', 'TestNumber']),
      transmissionType: getXmlValue(['TransmissionType', 'Transmission']),
      
      // Vehicle Systems & Control Units
      gearbox: getXmlValue(['Gearbox', 'TransmissionControl']),
      gearboxRelease: getXmlValue(['GearboxRelease', 'GearboxHW', 'GearboxSW']),
      centralDisplay: getXmlValue(['CentralDisplay', 'DisplayUnit']),
      doorModule: getXmlValue(['DoorModule', 'DMFL']),
      bodyController: getXmlValue(['BodyController', 'BC']),
      rearviewSystem: getXmlValue(['RearviewSystem', 'IDC']),
      idcC: getXmlValue(['IDC_C']),
      idcP: getXmlValue(['IDC_P']),
      civicM: getXmlValue(['CIVIC_M']),
      centralPowertrainController: getXmlValue(['CentralPowertrainController', 'CDCC_EV']),
      ignitionLock: getXmlValue(['IgnitionLock', 'EZS174'])
    };
    
    // Build the table
    addTableSection('Vehicle & Test Information');
    addTableRow('VEH. MAKE/MODEL/BODY STYLE:', formatVehicleInfo(data.vehicleMake, data.vehicleModel, data.bodyStyle));
    addTableRow('VEH. MODEL YEAR:', data.modelYear || '(empty)');
    addTableRow('TEST LABORATORY:', data.testLaboratory);
    addTableRow('DATE OF TEST:', formatDate(data.testDate) || '(empty)');
    addTableRow('DATE OF REPORT:', formatDate(data.reportDate) || '(empty)');
    addTableRow('LICENCE PLATE:', data.licensePlate || '(empty)');
    addTableRow('CUSTOMER VEH. NO.:', data.customerVehicleNo || '(empty)');
    addTableRow('VIN:', data.vin || '(empty)');
    addTableRow('TEST/PROTOCOL NO.:', data.testProtocolNo || '(empty)');
    addTableRow('TRANSMISSION TYPE:', data.transmissionType || '(empty)');
    
    addTableSection('Vehicle Systems & Control Units');
    addTableRow('Gearbox:', data.gearbox || '(empty)');
    addTableRow('Gearbox-Release (HW / SW):', data.gearboxRelease || '(empty)');
    addTableRow('Central Display (HW / SW):', data.centralDisplay || '(empty)');
    addTableRow('Door Module (HW / SW):', data.doorModule || '(empty)');
    addTableRow('Body Controller (HW / SW):', data.bodyController || '(empty)');
    addTableRow('Rearview-System:', data.rearviewSystem || '(empty)');
    addTableRow('IDC_C (HW / SW):', data.idcC || '(empty)');
    addTableRow('IDC_P (HW / SW):', data.idcP || '(empty)');
    addTableRow('CIVIC_M (HW / SW):', data.civicM || '(empty)');
    addTableRow('Central Powertrain Controller (CDCC_EV HW / SW):', data.centralPowertrainController || '(empty)');
    addTableRow('Ignition Lock (EZS174 HW / SW):', data.ignitionLock || '(empty)');
  }
  
  function getXmlValue(possibleTags) {
    for (const tag of possibleTags) {
      // Try different namespace prefixes and no prefix
      const selectors = [
        tag,
        `vdx3\\:${tag}`,
        `*[*|${tag}]`,
        `[localName="${tag}"]`
      ];
      
      for (const selector of selectors) {
        try {
          const element = currentXmlDoc.querySelector(selector);
          if (element && element.textContent.trim()) {
            return element.textContent.trim();
          }
        } catch (e) {
          // Try getElementsByTagName as fallback
          const elements = currentXmlDoc.getElementsByTagName(tag);
          if (elements.length > 0 && elements[0].textContent.trim()) {
            return elements[0].textContent.trim();
          }
        }
      }
    }
    return null;
  }
  
  function addTableSection(title) {
    const row = tableBody.insertRow();
    const cell = row.insertCell();
    cell.colSpan = 2;
    cell.textContent = title;
    cell.style.fontWeight = 'bold';
    cell.style.backgroundColor = '#f8f7f8';
    cell.style.padding = '8px';
    cell.style.textAlign = 'center';
  }
  
  function addTableRow(label, value) {
    const row = tableBody.insertRow();
    const labelCell = row.insertCell();
    const valueCell = row.insertCell();
    
    labelCell.textContent = label;
    valueCell.textContent = value;
    
    labelCell.style.fontWeight = 'bold';
    labelCell.style.padding = '6px';
    labelCell.style.borderRight = '2px solid #ccc';
    labelCell.style.backgroundColor = '#f0f0f0';
    labelCell.style.width = '300px';
    
    valueCell.style.padding = '6px';
    valueCell.style.minWidth = '200px';
  }
  
  function formatVehicleInfo(make, model, bodyStyle) {
    const parts = [make || 'XXX', model || 'XXX', bodyStyle || 'XX'];
    return parts.join(' / ');
  }
  
  function formatDate(dateStr) {
    if (!dateStr) return null;
    
    try {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
      }
    } catch (e) {
      // Return original string if parsing fails
    }
    return dateStr;
  }
  
  function showResults() {
    resultsSection.style.display = 'block';
  }
  
  function hideResults() {
    resultsSection.style.display = 'none';
  }
  
  function showError(message) {
    errorMessage.textContent = message;
    errorSection.style.display = 'block';
  }
  
  function hideError() {
    errorSection.style.display = 'none';
  }
});