document.addEventListener('DOMContentLoaded', () => {
    const fileSelectBtn = document.getElementById('file-select-btn');
    const changeFileBtn = document.getElementById('change-file-btn');
    const fileDetails = document.getElementById('file-details');
    const selectedFileName = document.getElementById('selected-file-name');
    const selectedFilePathEl = document.getElementById('selected-file-path');
    
    const configForm = document.getElementById('config-form');
    const docTitle = document.getElementById('doc-title');
    const docOutput = document.getElementById('doc-output');
    const pageSize = document.getElementById('page-size');
    const orientation = document.getElementById('orientation');
    const noPageNumbers = document.getElementById('no-page-numbers');
    const noMermaid = document.getElementById('no-mermaid');
    const mermaidTheme = document.getElementById('mermaid-theme');
    const mermaidScale = document.getElementById('mermaid-scale');
    const scaleVal = document.getElementById('scale-val');
    const mermaidSettingsGroup = document.getElementById('mermaid-settings-group');
    
    const pdfEngine = document.getElementById('engine');
    const emojiStrategy = document.getElementById('emoji-strategy');
    const fontOption = document.getElementById('font-option');
    
    const btnCompile = document.getElementById('btn-compile');
    const btnSpinner = document.getElementById('btn-spinner');
    const btnText = document.getElementById('btn-text');
    
    const statusBox = document.getElementById('status-box');
    const statusIconHolder = document.getElementById('status-icon-holder');
    const statusTitle = document.getElementById('status-title');
    const statusMessage = document.getElementById('status-message');
    const successActions = document.getElementById('success-actions');
    const btnOpenPdf = document.getElementById('btn-open-pdf');
    const btnOpenFolder = document.getElementById('btn-open-folder');

    const svgSpinner = `
        <svg class="btn-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="24" height="24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" style="opacity: 0.25;"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" style="opacity: 0.75;"></path>
        </svg>
    `;
    const svgSuccess = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" width="24" height="24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
    `;
    const svgError = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" width="24" height="24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
    `;

    let selectedFilePath = '';
    let generatedPdfPath = '';
    let isConverting = false;

    noMermaid.addEventListener('change', () => {
        if (noMermaid.checked) {
            mermaidSettingsGroup.classList.add('disabled');
        } else {
            mermaidSettingsGroup.classList.remove('disabled');
        }
    });

    mermaidScale.addEventListener('input', (e) => {
        scaleVal.textContent = `${e.target.value}x`;
    });

    async function selectFile() {
        if (isConverting) return;
        
        try {
            const response = await fetch('/api/select-file', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            
            const data = await response.json();
            if (data.success && data.file_path) {
                selectedFilePath = data.file_path;
                
                const parts = selectedFilePath.split(/[\\/]/);
                const filename = parts[parts.length - 1];
                
                selectedFileName.textContent = filename;
                selectedFilePathEl.textContent = selectedFilePath;
                
                fileSelectBtn.classList.add('hidden');
                fileDetails.classList.remove('hidden');
                
                docOutput.placeholder = data.default_output_path;
                
                btnCompile.disabled = false;
                btnText.textContent = "Compile PDF Document";
                
                statusBox.classList.add('hidden');
                successActions.classList.add('hidden');
            }
        } catch (error) {
            console.error("Error selecting file:", error);
            alert("Failed to communicate with local server to select file.");
        }
    }

    fileSelectBtn.addEventListener('click', selectFile);
    changeFileBtn.addEventListener('click', selectFile);

    btnCompile.addEventListener('click', async () => {
        if (!selectedFilePath || isConverting) return;
        
        isConverting = true;
        btnCompile.disabled = true;
        btnSpinner.classList.remove('hidden');
        btnText.textContent = "Compiling...";
        
        statusBox.classList.remove('hidden');
        successActions.classList.add('hidden');
        
        statusIconHolder.className = 'status-icon-container loading';
        statusIconHolder.innerHTML = svgSpinner;
        
        statusTitle.textContent = "Compiling Markdown";
        statusMessage.textContent = "Spawning md2pdf compiler via system Python. Renders Mermaid diagram structures using Playwright Chromium...";

        const payload = {
            file_path: selectedFilePath,
            output_path: docOutput.value.trim() || null,
            title: docTitle.value.trim() || null,
            page_size: pageSize.value,
            orientation: orientation.value,
            no_page_numbers: noPageNumbers.checked,
            no_mermaid: noMermaid.checked,
            mermaid_scale: parseInt(mermaidScale.value),
            mermaid_theme: mermaidTheme.value,
            engine: pdfEngine.value,
            emoji_strategy: emojiStrategy.value,
            font: fontOption.value.trim() || null
        };

        try {
            const response = await fetch('/api/convert', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            const data = await response.json();
            
            if (data.success) {
                generatedPdfPath = data.output_path;
                
                statusIconHolder.className = 'status-icon-container success';
                statusIconHolder.innerHTML = svgSuccess;
                statusTitle.textContent = "Conversion Succeeded!";
                statusMessage.textContent = `PDF document compiled successfully to: ${generatedPdfPath}`;
                
                successActions.classList.remove('hidden');
            } else {
                statusIconHolder.className = 'status-icon-container error';
                statusIconHolder.innerHTML = svgError;
                statusTitle.textContent = "Conversion Failed";
                statusMessage.textContent = data.error || "An execution error occurred in md2pdf-mermaid.";
            }
        } catch (error) {
            console.error("Error during compilation:", error);
            statusIconHolder.className = 'status-icon-container error';
            statusIconHolder.innerHTML = svgError;
            statusTitle.textContent = "Connection Error";
            statusMessage.textContent = "Could not connect to Flask compilation API. Please check your backend terminal.";
        } finally {
            isConverting = false;
            btnCompile.disabled = false;
            btnSpinner.classList.add('hidden');
            btnText.textContent = "Compile PDF Document";
        }
    });

    btnOpenPdf.addEventListener('click', async () => {
        if (!generatedPdfPath) return;
        try {
            await fetch('/api/open-file', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ file_path: generatedPdfPath })
            });
        } catch (error) {
            console.error("Error opening PDF:", error);
        }
    });

    btnOpenFolder.addEventListener('click', async () => {
        if (!generatedPdfPath) return;
        try {
            await fetch('/api/open-folder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ file_path: generatedPdfPath })
            });
        } catch (error) {
            console.error("Error opening directory folder:", error);
        }
    });
});
