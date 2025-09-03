@echo off
echo Stopping MBSE Application...
echo ============================

echo Killing Node.js processes (this will stop both backend and frontend)...
taskkill /f /im node.exe 2>nul
taskkill /f /im npm.cmd 2>nul

echo.
echo MBSE Application stopped.
echo All development servers have been terminated.
echo.
pause
