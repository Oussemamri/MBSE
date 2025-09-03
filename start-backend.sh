#!/bin/bash

echo "Starting MBSE Backend Server..."
echo "================================"

cd "$(dirname "$0")/backend"

if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "Failed to install dependencies!"
        exit 1
    fi
fi

echo "Starting backend development server..."
npm run dev
