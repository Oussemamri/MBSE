# MBSE Frontend

This is the frontend for the MBSE (Model-Based Systems Engineering) web application built with React, TypeScript, Vite, and TailwindCSS.

## Features

- **Authentication**: Complete login/register system with JWT tokens
- **Responsive Design**: TailwindCSS-based responsive UI
- **Type Safety**: Full TypeScript support
- **Protected Routes**: Route-based authentication protection
- **Context API**: Global authentication state management
- **Modern Stack**: React 18, Vite, TypeScript, TailwindCSS

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Backend server running on port 3001

## Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Copy the `.env` file and update if needed:
   ```env
   VITE_API_BASE_URL=http://localhost:3001/api
   ```

## Development

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Build for production**:
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Page-level components
├── hooks/          # Custom React hooks
├── context/        # Global state/context
├── services/       # API calls to backend
├── styles/         # Tailwind config & global CSS
└── main.tsx        # App entry point
```

## Authentication System

The frontend includes a complete authentication system with login/register pages, protected routes, and JWT token management. Users are automatically redirected to the dashboard after successful authentication.
