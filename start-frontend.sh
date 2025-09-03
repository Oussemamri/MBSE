#!/bin/bash

echo "Starting MBSE Frontend Server..."
echo "================================"

cd "$(dirname "$0")/frontend"

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "Failed to install dependencies!"
        exit 1
    fi
fi

echo "Starting frontend development server..."
npm run dev
