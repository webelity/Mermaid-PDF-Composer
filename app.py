import os
import sys
import site
import shutil
import subprocess
import tkinter as tk
from tkinter import filedialog
from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

def get_md2pdf_executable():
    exe_path = shutil.which("md2pdf")
    if exe_path:
        return exe_path
    
    python_dir = os.path.dirname(sys.executable)
    venv_exe = os.path.join(python_dir, "Scripts", "md2pdf.exe")
    if os.path.exists(venv_exe):
        return venv_exe
        
    user_base = site.getuserbase()
    if user_base:
        user_exe = os.path.join(user_base, "Scripts", "md2pdf.exe")
        if os.path.exists(user_exe):
            return user_exe
            
    appdata_roaming = os.environ.get("APPDATA")
    if appdata_roaming:
        python_appdata_dir = os.path.join(appdata_roaming, "Python")
        if os.path.exists(python_appdata_dir):
            try:
                for folder in os.listdir(python_appdata_dir):
                    if folder.startswith("Python"):
                        candidate = os.path.join(python_appdata_dir, folder, "Scripts", "md2pdf.exe")
                        if os.path.exists(candidate):
                            return candidate
            except Exception:
                pass

    return "md2pdf"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/select-file', methods=['POST'])
def select_file():
    try:
        root = tk.Tk()
        root.withdraw()
        root.attributes('-topmost', True)
        
        file_path = filedialog.askopenfilename(
            title="Select Markdown File",
            filetypes=[("Markdown files", "*.md;*.markdown"), ("All files", "*.*")]
        )
        root.destroy()
        
        if file_path:
            file_path = os.path.normpath(file_path)
            return jsonify({
                "success": True, 
                "file_path": file_path,
                "default_output_path": os.path.splitext(file_path)[0] + ".pdf"
            })
        else:
            return jsonify({"success": False, "message": "No file selected"})
            
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/convert', methods=['POST'])
def convert():
    try:
        data = request.json or {}
        input_path = data.get('file_path')
        output_path = data.get('output_path')
        title = data.get('title')
        page_size = data.get('page_size', 'a4')
        orientation = data.get('orientation', 'portrait')
        mermaid_scale = data.get('mermaid_scale', '2')
        mermaid_theme = data.get('mermaid_theme', 'default')
        no_mermaid = data.get('no_mermaid', False)
        no_page_numbers = data.get('no_page_numbers', False)
        emoji_strategy = data.get('emoji_strategy', 'auto')
        engine = data.get('engine', 'html')
        font = data.get('font', 'arial')

        if not input_path or not os.path.exists(input_path):
            return jsonify({"success": False, "error": "Invalid or missing input file path."}), 400

        cmd = [get_md2pdf_executable()]

        if output_path:
            cmd.extend(['-o', os.path.normpath(output_path)])
        else:
            output_path = os.path.splitext(input_path)[0] + ".pdf"
            cmd.extend(['-o', os.path.normpath(output_path)])

        if title:
            cmd.extend(['--title', title])

        cmd.extend(['--page-size', page_size])
        cmd.extend(['--orientation', orientation])

        if no_page_numbers:
            cmd.append('--no-page-numbers')

        if font:
            cmd.extend(['--font', font])

        if no_mermaid:
            cmd.append('--no-mermaid')
        else:
            cmd.extend(['--mermaid-scale', str(mermaid_scale)])
            cmd.extend(['--mermaid-theme', mermaid_theme])

        cmd.extend(['--emoji-strategy', emoji_strategy])
        cmd.extend(['--engine', engine])

        cmd.append(os.path.normpath(input_path))

        print(f"Running command: {' '.join(cmd)}")
        result = subprocess.run(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            shell=True
        )

        if result.returncode == 0:
            return jsonify({
                "success": True,
                "message": "Conversion completed successfully!",
                "output_path": os.path.normpath(output_path)
            })
        else:
            error_msg = result.stderr or result.stdout or "Unknown execution error."
            return jsonify({
                "success": False,
                "error": error_msg,
                "command": ' '.join(cmd)
            }), 500

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/open-file', methods=['POST'])
def open_file():
    try:
        data = request.json or {}
        file_path = data.get('file_path')
        if file_path and os.path.exists(file_path):
            os.startfile(os.path.normpath(file_path))
            return jsonify({"success": True})
        return jsonify({"success": False, "error": "File does not exist."}), 404
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/open-folder', methods=['POST'])
def open_folder():
    try:
        data = request.json or {}
        file_path = data.get('file_path')
        if file_path and os.path.exists(file_path):
            subprocess.run(['explorer', '/select,', os.path.normpath(file_path)])
            return jsonify({"success": True})
        return jsonify({"success": False, "error": "File does not exist."}), 404
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    import webbrowser
    from threading import Timer

    def open_browser():
        webbrowser.open_new("http://127.0.0.1:5000/")

    Timer(1.5, open_browser).start()
    app.run(host="127.0.0.1", port=5000, debug=False)
