# Mermaid PDF Composer

[![Python Version](https://img.shields.io/badge/python-3.10%20%7C%203.11%20%7C%203.12-blue)](https://www.python.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Framework](https://img.shields.io/badge/framework-Flask-lightgrey)](https://flask.palletsprojects.com/)

Mermaid-PDF-Composer is a local web utility that allows you to convert Markdown files containing Mermaid diagrams into clean, print-ready PDF documents. It provides a simple, styled interface where you can configure document layouts and compile them directly on your local machine.

Rather than relying on browser file uploads, the application opens a native system file selector. This allows it to read files directly from your workspace and output compiled PDFs locally, avoiding sandbox limitations.

---

## Features

- **Clean Interface**: A dark, styled web interface that lets you configure and run your compilations quickly.
- **Native File Picking**: Triggers native file explorer dialogs so you can select any Markdown file on your system.
- **Mermaid Graph Integration**: Renders flowcharts, sequences, and other Mermaid graphics directly into the generated PDF.
- **Custom Print Layouts**: Set orientation (Portrait/Landscape), standard sizes (A4, Letter, A3), fonts (e.g. Arial), and adjust diagram scale or style themes.
- **Direct Workspace Actions**: Open the compiled PDF or locate it in your file explorer with one click.
- **Completely Local**: No files are uploaded to external services. All processing happens on your machine.

---

## Dependencies

This project requires Python 3.10 or newer. It uses:

- **Flask**: Serves the local control panel.
- **md2pdf-mermaid**: Handles the underlying Markdown parsing and PDF rendering.
- **Playwright**: Controls a headless Chromium instance to draw Mermaid diagrams before they are written to the PDF document.

---

## Setup (Windows)

1. Clone this repository:
   ```bash
   git clone https://github.com/webelity/Mermaid-PDF-Composer.git
   cd Mermaid-PDF-Composer
   ```

2. Double-click the `run.bat` file. This helper script will:
   - Automatically detect your Python executable (checking system PATH and common installation directories).
   - Prompt you to input your custom Python installation folder if it cannot be found, saving your choice to `python_path.txt` for future launches.
   - Install required dependencies and check your Playwright Chromium configuration.
   - Start the local server and automatically open the application in your browser at `http://127.0.0.1:5000/`.

---

## Setup (macOS / Linux / Manual)

1. Install the required Python packages:
   ```bash
   pip install --user md2pdf-mermaid flask
   ```

2. Install the Playwright Chromium browser engine:
   ```bash
   python -m playwright install chromium
   ```

3. Run the application:
   ```bash
   python app.py
   ```

4. Open your browser and navigate to `http://localhost:5000`.

---

## How to Use

1. Click the file selector area on the page. A native file dialog will open. Select your `.md` or `.markdown` file.
2. Adjust configuration options in the settings panel (such as page orientation, scale, themes, or custom titles).
3. Click the compile button. The server will convert your file and save the output PDF in the same directory as the source file.
4. Click "Open PDF" to view the results or "Show in Explorer" to locate the generated file.

---

## License

This project is open-source software licensed under the MIT License.

```text
MIT License

Copyright (c) 2026 Chris Istvan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## Keywords

Markdown to PDF, Mermaid diagrams PDF, Python Markdown compiler, offline PDF renderer, markdown to pdf web GUI, local document conversion, Playwright Chromium PDF, markdown-to-pdf, md2pdf-mermaid, HTML PDF.
