@echo off
title MD to PDF Converter Server
setlocal enabledelayedexpansion

echo =========================================
echo MD to PDF with Mermaid Support GUI Setup
echo =========================================
echo.

:: Initialize Python Command variable
set "PYTHON_CMD="

:: 1. Check if a python path has been previously configured and saved
if exist python_path.txt (
    set /p SAVED_PATH=<python_path.txt
    :: Remove quotes if they exist
    set SAVED_PATH=!SAVED_PATH:"=!
    if exist "!SAVED_PATH!" (
        set "PYTHON_CMD=!SAVED_PATH!"
    ) else (
        echo [WARNING] Saved Python path in python_path.txt was not found: !SAVED_PATH!
        del python_path.txt
    )
)

:: 2. Test if default python executable is accessible in current system PATH
if "%PYTHON_CMD%"=="" (
    python --version >nul 2>&1
    if !errorlevel! equ 0 (
        set "PYTHON_CMD=python"
    )
)

:: 3. Scan common standard Windows installation directories if system PATH check failed
if "%PYTHON_CMD%"=="" (
    for %%P in (
        "%LocalAppData%\Programs\Python\Python313\python.exe"
        "%LocalAppData%\Programs\Python\Python312\python.exe"
        "%LocalAppData%\Programs\Python\Python311\python.exe"
        "%LocalAppData%\Programs\Python\Python310\python.exe"
        "C:\Python313\python.exe"
        "C:\Python312\python.exe"
        "C:\Python311\python.exe"
        "C:\Python310\python.exe"
        "C:\Program Files\Python313\python.exe"
        "C:\Program Files\Python312\python.exe"
        "C:\Program Files\Python311\python.exe"
        "C:\Program Files\Python310\python.exe"
        "C:\Program Files (x86)\Python313\python.exe"
        "C:\Program Files (x86)\Python312\python.exe"
        "C:\Program Files (x86)\Python311\python.exe"
        "C:\Program Files (x86)\Python310\python.exe"
    ) do (
        if "%PYTHON_CMD%"=="" (
            if exist "%%~P" (
                set "PYTHON_CMD=%%~P"
            )
        )
    )
)

:: 4. If python is still not found, prompt the user for a custom route location
if "%PYTHON_CMD%"=="" (
    echo [WARNING] Could not automatically locate a Python installation on your machine.
    echo.
    echo Please enter the absolute path to your python.exe or the folder containing it.
    echo (e.g., C:\Python312 or C:\Users\Username\miniconda3)
    echo.
    set /p USER_INPUT="Python folder/executable path: "
    echo.
    
    :: Remove quotes from user input
    set USER_INPUT=!USER_INPUT:"=!
    
    if exist "!USER_INPUT!\python.exe" (
        set "PYTHON_CMD=!USER_INPUT!\python.exe"
    ) else if exist "!USER_INPUT!" (
        :: Check if direct path to file
        set "PYTHON_CMD=!USER_INPUT!"
    )
    
    if not "!PYTHON_CMD!"=="" (
        :: Save configured path for future launches
        echo !PYTHON_CMD!>python_path.txt
        echo Python path configured and saved to python_path.txt.
    ) else (
        echo [ERROR] The path you entered does not exist or is invalid.
        echo Please make sure Python is installed and try again.
        echo.
        pause
        exit /b 1
    )
)

echo Using Python interpreter at: %PYTHON_CMD%
echo.

echo [1/3] Checking/Installing Python dependencies...
"!PYTHON_CMD!" -m pip install --user md2pdf-mermaid flask

echo.
echo [2/3] Verifying Playwright Chromium browser...
"!PYTHON_CMD!" -m playwright install chromium

echo.
echo [3/3] Starting local Flask server...
echo The application page will open automatically in your browser.
echo Press Ctrl+C in this terminal window to stop the server.
echo.

"!PYTHON_CMD!" app.py

if %ERRORLEVEL% neq 0 (
    echo.
    echo Server encountered an error or was stopped.
    pause
)
