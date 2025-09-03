@echo off
title MBSE Application
echo Starting MBSE Application...

cd /d "%~dp0"

REM Install root dependencies if needed (concurrently)
if not exist "node_modules" (
    echo Installing concurrently...
    npm install
)

REM Install backend dependencies if needed
if not exist "backend\node_modules" (
    echo Installing backend dependencies...
    cd backend && npm install && cd ..
)

REM Install frontend dependencies if needed
if not exist "frontend\node_modules" (
    echo Installing frontend dependencies...
    cd frontend && npm install && cd ..
)

REM Start both servers
echo.
echo ========================================
echo Starting Backend and Frontend servers...
echo ========================================
npm run dev
