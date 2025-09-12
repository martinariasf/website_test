const N8N_WEBHOOK_URL = 'https://your-n8n-instance.com/webhook/screenshot-to-link';

const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const previewSection = document.getElementById('previewSection');
const previewImage = document.getElementById('previewImage');
const removeBtn = document.getElementById('removeBtn');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.getElementById('btnText');
const loader = document.getElementById('loader');
const resultSection = document.getElementById('resultSection');
const resultLink = document.getElementById('resultLink');
const copyBtn = document.getElementById('copyBtn');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');

let selectedFile = null;

// Upload area click handler
uploadArea.addEventListener('click', () => {
    fileInput.click();
});

// File input change handler
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        handleFile(file);
    }
});

// Drag and drop handlers
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        handleFile(file);
    }
});

// Handle file selection
function handleFile(file) {
    selectedFile = file;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        previewImage.src = e.target.result;
        uploadArea.style.display = 'none';
        previewSection.style.display = 'block';
        submitBtn.disabled = false;
        resultSection.style.display = 'none';
        errorMessage.style.display = 'none';
    };
    reader.readAsDataURL(file);
}

// Remove button handler
removeBtn.addEventListener('click', () => {
    selectedFile = null;
    fileInput.value = '';
    previewImage.src = '';
    uploadArea.style.display = 'block';
    previewSection.style.display = 'none';
    submitBtn.disabled = true;
    resultSection.style.display = 'none';
    errorMessage.style.display = 'none';
});

// Submit button handler
submitBtn.addEventListener('click', async () => {
    if (!selectedFile) return;
    
    // Show loading state
    submitBtn.disabled = true;
    btnText.textContent = 'Processing...';
    loader.style.display = 'block';
    errorMessage.style.display = 'none';
    resultSection.style.display = 'none';
    
    try {
        // Convert file to base64
        const base64 = await fileToBase64(selectedFile);
        
        // Send to n8n webhook
        const response = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                screenshot: base64,
                filename: selectedFile.name,
                mimeType: selectedFile.type
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to process screenshot');
        }
        
        const data = await response.json();
        
        if (data.link) {
            // Show result
            resultLink.value = data.link;
            resultSection.style.display = 'block';
            successMessage.style.display = 'none';
        } else {
            throw new Error('No link received from server');
        }
        
    } catch (error) {
        console.error('Error:', error);
        errorMessage.textContent = error.message || 'An error occurred while processing your screenshot. Please try again.';
        errorMessage.style.display = 'block';
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        btnText.textContent = 'Upload Screenshot';
        loader.style.display = 'none';
    }
});

// Copy button handler
copyBtn.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(resultLink.value);
        successMessage.style.display = 'block';
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 3000);
    } catch (error) {
        console.error('Failed to copy:', error);
    }
});

// Convert file to base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Note: Update N8N_WEBHOOK_URL with your actual n8n webhook endpoint