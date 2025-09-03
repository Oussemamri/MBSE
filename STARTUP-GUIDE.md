# MBSE Application Startup Scripts

This folder contains convenient scripts to run your MBSE application:

## Windows (.bat files)

### `start-both.bat` ⭐ **RECOMMENDED**
- **Double-click this file to start both backend and frontend**
- Automatically installs dependencies if needed
- Opens both servers in separate command windows
- Shows connection URLs when ready
- Most convenient option for development

### `start-backend.bat`
- Starts only the backend server (Express + TypeScript)
- Runs on http://localhost:3000

### `start-frontend.bat` 
- Starts only the frontend server (React + Vite)
- Runs on http://localhost:5173 (or next available port)

### `stop-servers.bat`
- Stops all running Node.js processes
- Use this to stop both servers quickly

## Linux/Mac (.sh files)

### `start-both.sh` ⭐ **RECOMMENDED**
```bash
chmod +x start-both.sh
./start-both.sh
```

### `start-backend.sh`
```bash
chmod +x start-backend.sh
./start-backend.sh
```

### `start-frontend.sh`
```bash
chmod +x start-frontend.sh
./start-frontend.sh
```

## Quick Start Guide

1. **Windows Users**: Double-click `start-both.bat`
2. **Linux/Mac Users**: Run `./start-both.sh`
3. Wait for both servers to start
4. Open your browser to the frontend URL shown
5. Login with your account or register a new one

## Troubleshooting

- **Port conflicts**: If port 5173 is busy, Vite will automatically use 5174, 5175, etc.
- **Dependencies**: Scripts automatically install missing dependencies
- **Stop servers**: Close the command windows or run `stop-servers.bat`
- **Node.js version**: Ensure you have Node.js 20.19+ or 22.12+ installed

## Manual Start (Alternative)

If scripts don't work, you can start manually:

```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm install
npm run dev
```
