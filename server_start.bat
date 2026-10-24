@echo off
setlocal
chcp 65001 >nul
cd /d "%~dp0"

echo ==========================================
echo StudStaz - Backend launcher
echo ==========================================
echo.

if not exist "backend\requirements.txt" (
    echo ERROR: backend\requirements.txt was not found.
    echo Put this BAT file in the project root folder.
    pause
    exit /b 1
)

set "PYTHON_CMD="
set "PYTHON_ARGS="

REM Prefer Python 3.12, then 3.13, because dependencies may not support newer Python.
py -3.12 --version >nul 2>nul
if not errorlevel 1 (
    set "PYTHON_CMD=py"
    set "PYTHON_ARGS=-3.12"
) else (
    py -3.13 --version >nul 2>nul
    if not errorlevel 1 (
        set "PYTHON_CMD=py"
        set "PYTHON_ARGS=-3.13"
    )
)

if not defined PYTHON_CMD (
    echo ERROR: Python 3.12 or 3.13 was not found.
    echo Install Python 3.12 64-bit from https://www.python.org/downloads/release/python-31210/
    echo During installation, enable "Add python.exe to PATH".
    echo Then run this BAT file again.
    pause
    exit /b 1
)

REM Recreate the environment if it was made with another Python version.
if exist ".venv\Scripts\python.exe" (
    ".venv\Scripts\python.exe" -c "import sys; raise SystemExit(0 if sys.version_info[:2] in ((3,12),(3,13)) else 1)" >nul 2>nul
    if errorlevel 1 (
        echo Removing old virtual environment made with an incompatible Python version...
        rmdir /s /q ".venv"
    )
)

if not exist ".venv\Scripts\python.exe" (
    echo Creating virtual environment with Python %PYTHON_ARGS%...
    %PYTHON_CMD% %PYTHON_ARGS% -m venv .venv
    if errorlevel 1 (
        echo ERROR: Could not create virtual environment.
        pause
        exit /b 1
    )
)

echo Installing/checking dependencies...
".venv\Scripts\python.exe" -m pip install --upgrade pip
if errorlevel 1 (
    echo ERROR: Could not update pip.
    pause
    exit /b 1
)

".venv\Scripts\python.exe" -m pip install -r "backend\requirements.txt"
if errorlevel 1 (
    echo ERROR: Dependency installation failed.
    echo Check your internet connection and backend\requirements.txt.
    pause
    exit /b 1
)

if not exist "backend\app\main.py" (
    echo ERROR: backend\app\main.py was not found.
    echo Check that the project files are extracted correctly.
    pause
    exit /b 1
)

echo.
echo Starting StudStaz...
echo Website: http://127.0.0.1:8000
echo Swagger: http://127.0.0.1:8000/docs
echo Press Ctrl+C to stop the server.
echo.

".venv\Scripts\python.exe" -m uvicorn app.main:app --app-dir backend --host 127.0.0.1 --port 8000 --reload
if errorlevel 1 (
    echo.
    echo ERROR: The server stopped with an error.
    pause
)

endlocal
