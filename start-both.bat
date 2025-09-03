@echo off
title MBSE Application Starter
echo ========================================
echo   MBSE Model-Based Systems Engineering
echo ========================================
echo.
echo Starting both Backend and Frontend servers...
echo.

echo [1/2] Starting Backend Server...
cd /d "%~dp0backend"

if not exist "node_modules" (
    echo Installing backend dependencies...
    call npm install
    if errorlevel 1 (
        echo Failed to install backend dependencies!
        pause
        exit /b 1
    )
)

echo Starting backend in background...
start "MBSE Backend" cmd /k "cd /d "%~dp0backend" && npm run dev"

echo Waiting for backend to initialize...
timeout /t 3 /nobreak >nul

echo [2/2] Starting Frontend Server...
cd /d "%~dp0frontend"

if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
    if errorlevel 1 (
        echo Failed to install frontend dependencies!
        pause
        exit /b 1
    )
)

echo Starting frontend...
start "MBSE Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ========================================
echo   MBSE Application Started Successfully!
echo ========================================
echo.
echo Backend:  http://localhost:3000
echo Frontend: http://localhost:5173 (or next available port)
echo.
echo Both servers are running in separate windows.
echo Close those windows to stop the servers.
echo.
echo Press any key to exit this launcher...
pause >nul
