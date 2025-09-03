@echo off
echo Starting MBSE Backend Server...
echo ================================

cd /d "%~dp0backend"

echo Checking if node_modules exists...
if not exist "node_modules" (
    echo Installing backend dependencies...
    npm install
    if errorlevel 1 (
        echo Failed to install dependencies!
        pause
        exit /b 1
    )
)

echo Starting backend development server...
npm run dev

pause
