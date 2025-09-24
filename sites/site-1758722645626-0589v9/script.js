document.addEventListener('DOMContentLoaded', function() {
  console.log('Excel Vergleichstool initialisiert');
  
  // DOM-Elemente
  const file1Input = document.getElementById('file1');
  const file2Input = document.getElementById('file2');
  const compareBtn = document.getElementById('compare-btn');
  const downloadBtn = document.getElementById('download-btn');
  const loadingDiv = document.getElementById('loading');
  const resultsDiv = document.getElementById('results');
  const file1Info = document.getElementById('file1-info');
  const file2Info = document.getElementById('file2-info');
  const file1Name = document.getElementById('file1-name');
  const file2Name = document.getElementById('file2-name');
  const differencesCount = document.getElementById('differences-count');
  const summary = document.getElementById('summary');
  const differencesContainer = document.getElementById('differences-table-container');
  const file1Preview = document.getElementById('file1-preview');
  const file2Preview = document.getElementById('file2-preview');
  
  // Tab-System
  const tabs = document.querySelectorAll('.tab');
  const tabPanels = document.querySelectorAll('.tab-panel');
  
  let file1Data = null;
  let file2Data = null;
  let comparisonResult = null;
  
  // Event Listeners
  file1Input.addEventListener('change', handleFile1Change);
  file2Input.addEventListener('change', handleFile2Change);
  compareBtn.addEventListener('click', compareFiles);
  downloadBtn.addEventListener('click', downloadReport);
  
  // Tab-Navigation
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const targetTab = this.dataset.tab;
      switchTab(targetTab);
    });
  });
  
  // Datei 1 Handler
  function handleFile1Change(event) {
    const file = event.target.files[0];
    if (file) {
      file1Name.textContent = file.name;
      file1Info.classList.remove('d-none');
      readExcelFile(file, 1);
    }
  }
  
  // Datei 2 Handler
  function handleFile2Change(event) {
    const file = event.target.files[0];
    if (file) {
      file2Name.textContent = file.name;
      file2Info.classList.remove('d-none');
      readExcelFile(file, 2);
    }
  }
  
  // Excel-Datei lesen (Vereinfacht für Demo)
  function readExcelFile(file, fileNumber) {
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        // In einer echten Implementierung würde hier eine Excel-Parsing-Bibliothek wie SheetJS verwendet
        // Für die Demo simulieren wir Excel-Daten
        const simulatedData = generateSimulatedExcelData(file.name, fileNumber);
        
        if (fileNumber === 1) {
          file1Data = simulatedData;
        } else {
          file2Data = simulatedData;
        }
        
        checkIfReadyToCompare();
        
      } catch (error) {
        console.error('Fehler beim Lesen der Datei:', error);
        showAlert('Fehler beim Lesen der Excel-Datei. Stellen Sie sicher, dass es sich um eine gültige Excel-Datei handelt.', 'error');
      }
    };
    reader.readAsArrayBuffer(file);
  }
  
  // Simulierte Excel-Daten für Demo
  function generateSimulatedExcelData(filename, fileNumber) {
    const baseData = [
      ['Name', 'Alter', 'Stadt', 'Gehalt'],
      ['Max Mustermann', 30, 'Berlin', 50000],
      ['Anna Schmidt', 25, 'München', 45000],
      ['Peter Weber', 35, 'Hamburg', 55000],
      ['Lisa Meyer', 28, 'Köln', 48000],
      ['Tom Fischer', 32, 'Frankfurt', 52000]
    ];
    
    // Für Datei 2 einige Unterschiede einbauen
    if (fileNumber === 2) {
      const modifiedData = JSON.parse(JSON.stringify(baseData));
      modifiedData[1][1] = 31; // Alter geändert
      modifiedData[2][3] = 47000; // Gehalt geändert
      modifiedData[3][2] = 'Dresden'; // Stadt geändert
      modifiedData.push(['Michael Lang', 29, 'Stuttgart', 49000]); // Neue Zeile
      return modifiedData;
    }
    
    return baseData;
  }
  
  // Prüfen ob beide Dateien geladen sind
  function checkIfReadyToCompare() {
    if (file1Data && file2Data) {
      compareBtn.disabled = false;
      compareBtn.classList.add('pulse');
    }
  }
  
  // Dateien vergleichen
  function compareFiles() {
    if (!file1Data || !file2Data) {
      showAlert('Bitte laden Sie beide Excel-Dateien hoch.', 'warning');
      return;
    }
    
    loadingDiv.classList.remove('d-none');
    resultsDiv.classList.add('d-none');
    compareBtn.disabled = true;
    
    // Simulation der Verarbeitung
    setTimeout(() => {
      performComparison();
      loadingDiv.classList.add('d-none');
      resultsDiv.classList.remove('d-none');
      downloadBtn.classList.remove('d-none');
      compareBtn.disabled = false;
    }, 2000);
  }
  
  // Vergleich durchführen
  function performComparison() {
    const differences = [];
    const maxRows = Math.max(file1Data.length, file2Data.length);
    const maxCols = Math.max(
      ...file1Data.map(row => row.length),
      ...file2Data.map(row => row.length)
    );
    
    for (let row = 0; row < maxRows; row++) {
      for (let col = 0; col < maxCols; col++) {
        const value1 = file1Data[row] ? file1Data[row][col] : undefined;
        const value2 = file2Data[row] ? file2Data[row][col] : undefined;
        
        if (value1 !== value2) {
          differences.push({
            row: row + 1,
            col: col + 1,
            columnName: getColumnName(col),
            value1: value1 || '(leer)',
            value2: value2 || '(leer)',
            type: getDifferenceType(value1, value2)
          });
        }
      }
    }
    
    comparisonResult = {
      differences: differences,
      file1Data: file1Data,
      file2Data: file2Data,
      totalRows1: file1Data.length,
      totalRows2: file2Data.length
    };
    
    displayResults();
  }
  
  // Spalten-Name generieren (A, B, C, ...)
  function getColumnName(colIndex) {
    let result = '';
    while (colIndex >= 0) {
      result = String.fromCharCode(65 + (colIndex % 26)) + result;
      colIndex = Math.floor(colIndex / 26) - 1;
    }
    return result;
  }
  
  // Art des Unterschieds bestimmen
  function getDifferenceType(value1, value2) {
    if (value1 === undefined) return 'Neu hinzugefügt';
    if (value2 === undefined) return 'Entfernt';
    return 'Geändert';
  }
  
  // Ergebnisse anzeigen
  function displayResults() {
    const { differences, file1Data, file2Data } = comparisonResult;
    
    // Anzahl Unterschiede
    differencesCount.textContent = `${differences.length} Unterschiede`;
    
    // Zusammenfassung
    summary.innerHTML = `
      <div class="grid grid-cols-3 gap-4">
        <div class="text-center">
          <h4 class="text-orange">${differences.length}</h4>
          <p class="text-small">Unterschiede gefunden</p>
        </div>
        <div class="text-center">
          <h4 class="text-blue">${file1Data.length}</h4>
          <p class="text-small">Zeilen in Datei 1</p>
        </div>
        <div class="text-center">
          <h4 class="text-gray">${file2Data.length}</h4>
          <p class="text-small">Zeilen in Datei 2</p>
        </div>
      </div>
    `;
    
    // Unterschiede-Tabelle
    displayDifferencesTable();
    
    // Datei-Vorschauen
    displayFilePreview(file1Data, file1Preview, 1);
    displayFilePreview(file2Data, file2Preview, 2);
  }
  
  // Unterschiede-Tabelle anzeigen
  function displayDifferencesTable() {
    if (comparisonResult.differences.length === 0) {
      differencesContainer.innerHTML = `
        <div class="alert alert-success">
          <strong>Keine Unterschiede gefunden!</strong> Die beiden Excel-Dateien sind identisch.
        </div>
      `;
      return;
    }
    
    let tableHTML = `
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Position</th>
            <th>Spalte</th>
            <th>Datei 1</th>
            <th>Datei 2</th>
            <th>Typ</th>
          </tr>
        </thead>
        <tbody>
    `;
    
    comparisonResult.differences.forEach(diff => {
      const typeClass = {
        'Geändert': 'badge-orange',
        'Neu hinzugefügt': 'badge-blue',
        'Entfernt': 'badge-gray'
      }[diff.type] || 'badge-gray';
      
      tableHTML += `
        <tr>
          <td>${diff.columnName}${diff.row}</td>
          <td>${diff.columnName}</td>
          <td class="${diff.type === 'Neu hinzugefügt' ? 'bg-light' : 'bg-orange opacity-25'}">${diff.value1}</td>
          <td class="${diff.type === 'Entfernt' ? 'bg-light' : 'bg-blue opacity-25'}">${diff.value2}</td>
          <td><span class="badge ${typeClass}">${diff.type}</span></td>
        </tr>
      `;
    });
    
    tableHTML += '</tbody></table>';
    differencesContainer.innerHTML = tableHTML;
  }
  
  // Datei-Vorschau anzeigen
  function displayFilePreview(data, container, fileNumber) {
    if (!data || data.length === 0) {
      container.innerHTML = '<div class="alert alert-warning">Keine Daten vorhanden</div>';
      return;
    }
    
    let tableHTML = '<table class="table table-bordered"><thead><tr>';
    
    // Header-Zeile
    if (data[0]) {
      data[0].forEach((cell, colIndex) => {
        tableHTML += `<th>${cell || ''}</th>`;
      });
    }
    tableHTML += '</tr></thead><tbody>';
    
    // Daten-Zeilen (ohne Header)
    for (let rowIndex = 1; rowIndex < data.length; rowIndex++) {
      const row = data[rowIndex];
      tableHTML += '<tr>';
      
      row.forEach((cell, colIndex) => {
        const isHighlighted = isHighlightedCell(rowIndex, colIndex, fileNumber);
        const highlightClass = isHighlighted ? (fileNumber === 1 ? 'bg-orange opacity-25' : 'bg-blue opacity-25') : '';
        tableHTML += `<td class="${highlightClass}">${cell || ''}</td>`;
      });
      
      tableHTML += '</tr>';
    }
    
    tableHTML += '</tbody></table>';
    container.innerHTML = tableHTML;
  }
  
  // Prüfen ob eine Zelle hervorgehoben werden soll
  function isHighlightedCell(row, col, fileNumber) {
    if (!comparisonResult) return false;
    
    return comparisonResult.differences.some(diff => {
      return diff.row === row + 1 && diff.col === col + 1;
    });
  }
  
  // Tab wechseln
  function switchTab(targetTab) {
    // Alle Tabs deaktivieren
    tabs.forEach(tab => tab.classList.remove('active'));
    tabPanels.forEach(panel => panel.classList.remove('active'));
    
    // Aktiven Tab und Panel aktivieren
    const activeTab = document.querySelector(`[data-tab="${targetTab}"]`);
    const activePanel = document.getElementById(`tab-${targetTab}`);
    
    if (activeTab && activePanel) {
      activeTab.classList.add('active');
      activePanel.classList.add('active');
    }
  }
  
  // Bericht herunterladen
  function downloadReport() {
    if (!comparisonResult) return;
    
    let reportContent = 'Excel-Dateien Vergleichsbericht\n';
    reportContent += '================================\n\n';
    reportContent += `Datum: ${new Date().toLocaleDateString('de-DE')}\n`;
    reportContent += `Zeit: ${new Date().toLocaleTimeString('de-DE')}\n\n`;
    reportContent += `Datei 1: ${file1Name.textContent}\n`;
    reportContent += `Datei 2: ${file2Name.textContent}\n\n`;
    reportContent += `Anzahl Unterschiede: ${comparisonResult.differences.length}\n\n`;
    
    if (comparisonResult.differences.length > 0) {
      reportContent += 'Gefundene Unterschiede:\n';
      reportContent += '------------------------\n';
      
      comparisonResult.differences.forEach((diff, index) => {
        reportContent += `${index + 1}. Position ${diff.columnName}${diff.row}:\n`;
        reportContent += `   Datei 1: ${diff.value1}\n`;
        reportContent += `   Datei 2: ${diff.value2}\n`;
        reportContent += `   Typ: ${diff.type}\n\n`;
      });
    } else {
      reportContent += 'Keine Unterschiede gefunden. Die Dateien sind identisch.\n';
    }
    
    // Datei herunterladen
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Excel-Vergleich-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  
  // Alert anzeigen
  function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} mt-4`;
    alertDiv.innerHTML = `<strong>Hinweis:</strong> ${message}`;
    
    const container = document.querySelector('.container');
    container.insertBefore(alertDiv, container.firstChild);
    
    setTimeout(() => {
      if (alertDiv.parentNode) {
        alertDiv.parentNode.removeChild(alertDiv);
      }
    }, 5000);
  }
  
  // Smooth Scrolling für interne Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});