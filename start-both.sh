#!/bin/bash

echo "========================================"
echo "  MBSE Model-Based Systems Engineering"
echo "========================================"
echo ""
echo "Starting both Backend and Frontend servers..."
echo ""

echo "[1/2] Starting Backend Server..."
cd "$(dirname "$0")/backend"

if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "Failed to install backend dependencies!"
        exit 1
    fi
fi

echo "Starting backend in background..."
npm run dev &
BACKEND_PID=$!

echo "Waiting for backend to initialize..."
sleep 3

echo "[2/2] Starting Frontend Server..."
cd "$(dirname "$0")/frontend"

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "Failed to install frontend dependencies!"
        kill $BACKEND_PID
        exit 1
    fi
fi

echo ""
echo "========================================"
echo "  MBSE Application Started Successfully!"
echo "========================================"
echo ""
echo "Backend:  http://localhost:3000"
echo "Frontend: http://localhost:5173 (or next available port)"
echo ""
echo "Press Ctrl+C to stop both servers..."
echo ""

# Start frontend (this will block and show output)
npm run dev

# This will run when frontend is stopped (Ctrl+C)
echo ""
echo "Stopping backend server..."
kill $BACKEND_PID 2>/dev/null
echo "MBSE Application stopped."
