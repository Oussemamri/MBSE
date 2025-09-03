import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                  MBSE Platform
                </h1>
                <p className="text-gray-600 text-sm">Model-Based Systems Engineering</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="text-gray-600">Welcome back, {user?.name}</span>
                  <Link
                    to="/dashboard"
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
                  >
                    Go to Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-6 py-3 text-blue-600 border border-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-200 font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Modern Solution
              </span>
              <br />
              for Model-Based Systems Engineering
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              A comprehensive, extensible and user-friendly MBSE platform to successfully design, 
              analyze, and collaborate on complex systems architecture with powerful visual tools 
              and real-time collaboration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 font-semibold text-lg"
                  >
                    Go to Dashboard
                  </Link>
                  <Link
                    to="/diagram/new"
                    className="px-8 py-4 text-gray-700 border-2 border-gray-300 rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all duration-200 font-semibold text-lg"
                  >
                    Create New Diagram
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 font-semibold text-lg"
                  >
                    Start Designing Now
                  </Link>
                  <Link
                    to="#features"
                    className="px-8 py-4 text-gray-700 border-2 border-gray-300 rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all duration-200 font-semibold text-lg"
                  >
                    Learn More
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-blue-400/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-purple-400/20 rounded-full blur-xl animate-pulse delay-2000"></div>
          <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-indigo-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for MBSE
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform combines powerful diagramming, requirements management, 
              collaboration tools, and seamless export/import capabilities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Diagram Editor */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 group">
              <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">Visual Diagram Editor</h4>
              <p className="text-gray-600 leading-relaxed">
                Create complex system architectures with our intuitive drag-and-drop interface. 
                Add blocks, connect components, and design your systems visually with JointJS-powered canvas.
              </p>
            </div>

            {/* Requirements Management */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 group">
              <div className="h-16 w-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">Requirements Management</h4>
              <p className="text-gray-600 leading-relaxed">
                Define, track, and manage system requirements with full CRUD operations. 
                Link requirements directly to model elements for complete traceability.
              </p>
            </div>

            {/* Collaboration */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 group">
              <div className="h-16 w-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">Team Collaboration</h4>
              <p className="text-gray-600 leading-relaxed">
                Share models with team members, manage permissions, and collaborate in real-time. 
                Work together seamlessly on complex engineering projects.
              </p>
            </div>

            {/* Export/Import */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 group">
              <div className="h-16 w-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 12l3 3m0 0l3-3m-3 3V9" />
                </svg>
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">Export & Import</h4>
              <p className="text-gray-600 leading-relaxed">
                Seamlessly export your models to JSON and XMI formats. Import existing models 
                and continue your work across different platforms and tools.
              </p>
            </div>

            {/* Security */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 group">
              <div className="h-16 w-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">Secure & Reliable</h4>
              <p className="text-gray-600 leading-relaxed">
                Enterprise-grade security with JWT authentication, role-based access control, 
                and secure data storage. Your intellectual property is protected.
              </p>
            </div>

            {/* Modern Technology */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 group">
              <div className="h-16 w-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">Modern Technology</h4>
              <p className="text-gray-600 leading-relaxed">
                Built with cutting-edge technologies: React, TypeScript, Node.js, and PostgreSQL. 
                Fast, responsive, and scalable for teams of any size.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Systems Engineering?
          </h3>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join thousands of engineers who trust our platform for their MBSE needs. 
            Start designing better systems today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 font-semibold text-lg"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 text-white border-2 border-white/30 rounded-xl hover:border-white hover:bg-white/10 transition-all duration-200 font-semibold text-lg backdrop-blur-sm"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-4 mb-4">
                <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">M</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold">MBSE Platform</h4>
                  <p className="text-gray-400">Model-Based Systems Engineering</p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed max-w-md">
                A comprehensive platform for modern systems engineering. 
                Design, collaborate, and manage your systems architecture with confidence.
              </p>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Platform</h5>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/register" className="hover:text-white transition-colors">Get Started</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></li>
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Company</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 MBSE Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
