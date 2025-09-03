import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PublicRoute from './components/PublicRoute';
import HomeRoute from './components/HomeRoute';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import DiagramPage from './pages/DiagramPage';
import DiagramPageV2 from './pages/DiagramPageV2';
import RequirementsPage from './pages/RequirementsPage';
import SharedModelsPage from './pages/SharedModelsPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Home Page - accessible to all users */}
            <Route 
              path="/" 
              element={
                <HomeRoute>
                  <HomePage />
                </HomeRoute>
              } 
            />

            {/* Public Routes - redirect to dashboard if authenticated */}
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              } 
            />

            {/* Protected Routes - require authentication */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />

            {/* Diagram Editor Routes */}
            <Route 
              path="/diagram/new" 
              element={
                <ProtectedRoute>
                  <DiagramPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/diagram/:id" 
              element={
                <ProtectedRoute>
                  <DiagramPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Enhanced Diagram Editor with Multiple Diagram Types */}
            <Route 
              path="/diagrams/:id" 
              element={
                <ProtectedRoute>
                  <DiagramPageV2 />
                </ProtectedRoute>
              } 
            />

            {/* Requirements Management Route */}
            <Route 
              path="/requirements" 
              element={
                <ProtectedRoute>
                  <RequirementsPage />
                </ProtectedRoute>
              } 
            />

            {/* Shared Models Route */}
            <Route 
              path="/shared" 
              element={
                <ProtectedRoute>
                  <SharedModelsPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
