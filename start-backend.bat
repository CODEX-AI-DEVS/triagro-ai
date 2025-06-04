@echo off
:: TriAgro Backend Startup Script for Windows

echo 🌱 Starting TriAgro Plant Disease Detection Backend...

:: Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.8 or higher.
    pause
    exit /b 1
)

:: Check if we're in the right directory
if not exist "backend\app.py" (
    echo ❌ Please run this script from the triagro root directory
    pause
    exit /b 1
)

cd backend

:: Check if virtual environment exists
if not exist "venv" (
    echo 📦 Creating Python virtual environment...
    python -m venv venv
)

:: Activate virtual environment
echo 🔧 Activating virtual environment...
call venv\Scripts\activate.bat

:: Install dependencies
echo 📚 Installing dependencies...
pip install -r requirements.txt

:: Run setup if this is the first time
if not exist ".setup_complete" (
    echo 🚀 Running first-time setup...
    python setup.py
    if errorlevel 1 (
        echo ❌ Setup failed. Please check the error messages above.
        pause
        exit /b 1
    )
    echo. > .setup_complete
    echo ✅ Setup completed successfully!
)

:: Start the backend
echo 🚀 Starting backend server...
echo 📡 Backend will be available at: http://localhost:5001
echo 🔍 Health check: http://localhost:5001/health
echo 📊 Available classes: http://localhost:5001/classes
echo.
echo Press Ctrl+C to stop the server
echo.

python app.py

pause