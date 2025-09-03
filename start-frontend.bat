@echo off
echo Starting MBSE Frontend Server...
echo ================================

cd /d "%~dp0frontend"

echo Checking if node_modules exists...
if not exist "node_modules" (
    echo Installing frontend dependencies...
    npm install
    if errorlevel 1 (
        echo Failed to install dependencies!
        pause
        exit /b 1
    )
)

echo Starting frontend development server...
npm run dev

pause
