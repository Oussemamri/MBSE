import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [showAfter, setShowAfter] = useState(false);

  // Toggle component for Before/After buttons
  const BeforeAfterToggle: React.FC = () => (
    <div className="flex">
      <button
        onClick={() => setShowAfter(false)}
        className={`px-6 py-3 rounded-l-lg font-semibold transition-all ${!showAfter
            ? 'bg-blue-600 text-white shadow-md'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
      >
        Without Flux
      </button>
      <button
        onClick={() => setShowAfter(true)}
        className={`px-6 py-3 rounded-r-lg font-semibold transition-all ${showAfter
            ? 'bg-blue-600 text-white shadow-md'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
      >
        With Flux
      </button>
    </div>
  );

  // Before/After content component
  const BeforeAfterContent: React.FC = () => (
    <div className="relative">
      {/* Before State */}
      <div className={`transition-all duration-500 ${showAfter ? 'opacity-0 absolute inset-0' : 'opacity-100'}`}>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Problems List */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
              <div className="flex-shrink-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mt-1">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-red-800">No clean way to communicate requirements</h4>
                <p className="text-red-700 text-sm mt-1">Teams struggle with scattered documentation and unclear specifications</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
              <div className="flex-shrink-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mt-1">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-red-800">Everyone is out of sync</h4>
                <p className="text-red-700 text-sm mt-1">Different teams working with outdated information and conflicting requirements</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
              <div className="flex-shrink-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mt-1">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-red-800">Fragile, unscalable spreadsheets</h4>
                <p className="text-red-700 text-sm mt-1">Manual processes that break down as projects grow in complexity</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
              <div className="flex-shrink-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mt-1">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-red-800">Engineering teams working in isolation</h4>
                <p className="text-red-700 text-sm mt-1">Silos that prevent effective collaboration and knowledge sharing</p>
              </div>
            </div>
          </div>

          {/* Before Image */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <img
              src="/before.png"
              alt="Chaotic workflow without Flux"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* After State */}
      <div className={`transition-all duration-500 ${!showAfter ? 'opacity-0 absolute inset-0' : 'opacity-100'}`}>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Benefits List */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
              <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-green-800">Clean, structured requirements communication</h4>
                <p className="text-green-700 text-sm mt-1">Crystal clear specifications that everyone can understand and follow</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
              <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-green-800">Real-time synchronization across teams</h4>
                <p className="text-green-700 text-sm mt-1">Everyone works with the latest information, automatically updated</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
              <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-green-800">Robust, scalable database-driven approach</h4>
                <p className="text-green-700 text-sm mt-1">Enterprise-grade infrastructure that grows with your organization</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
              <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-green-800">Collaborative engineering workflows</h4>
                <p className="text-green-700 text-sm mt-1">Seamless teamwork with integrated tools and shared understanding</p>
              </div>
            </div>
          </div>

          {/* After Image */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <img
              src="/after.png"
              alt="Streamlined workflow with Flux"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-lg flex items-center justify-center">
                <img
                  src="/app_logo.png"
                  alt="Flux Logo"
                  className="h-10 w-10 rounded-lg"
                />
              </div>
              <span className="text-xl font-semibold text-gray-900">Flux</span>
            </div>
            <div className="flex items-center space-x-6">
              <nav className="hidden md:flex space-x-6">
                <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
                <a href="#comparison" className="text-gray-600 hover:text-gray-900">Compare</a>
                <a href="#testimonials" className="text-gray-600 hover:text-gray-900">Testimonials</a>
              </nav>
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Dashboard
                </Link>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Book a Demo
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Emotional Hook */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Flux accelerates design, <span className="underline decoration-blue-500">iteration</span> and verification of complex systems
          </h1>
          <p className="text-xl text-gray-600 mb-4 max-w-4xl mx-auto">
            Meet the Agile Requirements Management Platform. Democratize access to requirements & design parameters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link
              to="/register"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
            >
              Book a Demo
            </Link>
            <Link
              to="/register"
              className="px-8 py-4 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold text-lg"
            >
              Start Free Trial
            </Link>
          </div>

          {/* Company Logos */}
          <div className="mt-16">
            <p className="text-sm text-gray-500 mb-8">Trusted by innovative engineering teams</p>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              <div className="h-8 bg-gray-300 rounded px-6 flex items-center text-gray-600 font-semibold">ACME Corp</div>
              <div className="h-8 bg-gray-300 rounded px-6 flex items-center text-gray-600 font-semibold">TechFlow</div>
              <div className="h-8 bg-gray-300 rounded px-6 flex items-center text-gray-600 font-semibold">Systems Inc</div>
              <div className="h-8 bg-gray-300 rounded px-6 flex items-center text-gray-600 font-semibold">EngineerCo</div>
            </div>
          </div>
        </div>
      </section>

      {/* Emotional Hook Testimonial */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-blue-50 rounded-2xl p-8 border border-blue-200">
            <svg className="h-8 w-8 text-blue-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
            </svg>
            <blockquote className="text-xl text-gray-900 mb-4">
              "Flux is the <strong>requirements management tool of our dreams</strong>. It reflects how we work—fast, iterative, and focused on giving everyone a common, integrated view of our system."
            </blockquote>
            <p className="text-lg text-blue-600 font-semibold">
              <strong>We've had new engineers tell us, unprompted, 'this is the best requirements tool I've ever used'. That says it all.</strong>
            </p>
            <div className="flex items-center justify-center mt-6">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                RM
              </div>
              <div className="ml-3 text-left">
                <p className="font-semibold text-gray-900">Ryan McKenzie</p>
                <p className="text-sm text-gray-500">System Architect</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem-Solution Narrative */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              We needed a tool that could keep up with the pace of modern engineering
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Flux has delivered. Unlike many tools that disrupt workflows or create bottlenecks,
              <strong> Flux integrates successfully with how modern engineering teams operate</strong>.
              It's fast, flexible, and scales with ease.
            </p>
            <p className="text-lg text-gray-500 mt-4">
              In our experience, there's nothing on the market that compares.
            </p>
          </div>
        </div>
      </section>

      {/* Iterate Faster Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Iterate faster. Integrate your design tools with requirements for live V&V tracking.
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              End-to-end traceability of requirements & design parameters from design to release
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Collaborate */}
            <div className="text-center">
              <div className="h-16 w-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Collaborate</h3>
              <p className="text-gray-600">
                Give engineers real ownership of requirements. Help everyone take a system first mindset.
              </p>
            </div>

            {/* Parameterize */}
            <div className="text-center">
              <div className="h-16 w-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Parameterize</h3>
              <p className="text-gray-600">
                Convert text-based requirements into machine readable checks for budgets or actuals.
              </p>
            </div>

            {/* Integrate */}
            <div className="text-center">
              <div className="h-16 w-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a1 1 0 01-1-1V9a1 1 0 011-1h1a2 2 0 100-4H4a1 1 0 01-1-1V4a1 1 0 011-1h3a1 1 0 001-1v-1a2 2 0 012-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Integrate</h3>
              <p className="text-gray-600">
                Drive parameters via API's or integrations for live V&V tracking.
              </p>
            </div>

            {/* Verify */}
            <div className="text-center">
              <div className="h-16 w-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="h-8 w-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Verify</h3>
              <p className="text-gray-600">
                Continuously verify your design on every major design change saving weeks of manual checks.
              </p>
            </div>

            {/* Visual Modeling */}
            <div className="text-center">
              <div className="h-16 w-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="h-8 w-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Visual Modeling</h3>
              <p className="text-gray-600">
                Create complex system architectures with intuitive drag-and-drop interface.
              </p>
            </div>

            {/* Release */}
            <div className="text-center">
              <div className="h-16 w-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Release</h3>
              <p className="text-gray-600">
                Generate reports for regulators with end to end design traceability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Before/After Section - Flow Engineering Style */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Integrate, propagate and manage change in minutes
            </h2>
          </div>

          {/* Toggle Buttons */}
          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-lg shadow-lg p-1 flex">
              <BeforeAfterToggle />
            </div>
          </div>

          {/* Interactive Before/After Content */}
          <BeforeAfterContent />
        </div>
      </section>      {/* Technical Credibility & Before/After */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Before Flux, this meant juggling spreadsheets, duplicate docs, and months of rework.
              <span className="text-blue-600"> Now it just works.</span>
            </h3>
            <p className="text-lg text-gray-600 mb-4">
              With Flux, all your requirements, design targets, and system data actually live in one place.
              That might not sound revolutionary—but if you've ever tried to do this in complex engineering, you know how painful it actually is.
            </p>
            <p className="text-lg text-gray-900 font-semibold">
              I have not found anything comparable to Flux in giving us <strong>flexibility without compromising functionality</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              What engineering teams are saying
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="mb-4">
                <svg className="h-8 w-8 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
                </svg>
              </div>
              <p className="text-gray-600 mb-6 italic">
                "Getting to CI/CD for systems is the dream. Flux is what finally got us there.
                It's not just another tool, it's the backbone of how we build now."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  JS
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-gray-900">John Smith</p>
                  <p className="text-sm text-gray-500">Technical Program Manager</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="mb-4">
                <svg className="h-8 w-8 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
                </svg>
              </div>
              <p className="text-gray-600 mb-6 italic">
                "We needed a tool that could keep up with the pace of our organization, adapt to
                increasing complexity, and remain easy to manage without full time dedicated resources.
                Flux has delivered."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                  AB
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-gray-900">Alice Brown</p>
                  <p className="text-sm text-gray-500">System Engineer</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="mb-4">
                <svg className="h-8 w-8 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
                </svg>
              </div>
              <p className="text-gray-600 mb-6 italic">
                "Unlike many tools that disrupt workflows or create bottlenecks, Flux integrates
                successfully with how modern engineering teams operate. It's fast, flexible, and scales with ease."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                  MJ
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-gray-900">Mike Johnson</p>
                  <p className="text-sm text-gray-500">CEO & Co-Founder</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Competitor Comparison */}
      <section id="comparison" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Flexible but powerful
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Replace the hassle of manually updating spreadsheets or using cumbersome enterprise tools
              by upgrading your workflow with collaborative requirements management that's always up to date, for everyone.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-lg">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900"></th>
                  <th className="text-center py-4 px-6">
                    <div className="text-sm text-gray-500 mb-1">Generic tools that slow you down with 20+ people</div>
                    <div className="font-semibold text-gray-600">Excel / Spreadsheets</div>
                  </th>
                  <th className="text-center py-4 px-6">
                    <div className="text-sm text-blue-600 font-semibold mb-1">Agile and scalable</div>
                    <div className="font-bold text-blue-600">Flux</div>
                  </th>
                  <th className="text-center py-4 px-6">
                    <div className="text-sm text-gray-500 mb-1">Expensive legacy tools</div>
                    <div className="font-semibold text-gray-600">Enterprise Requirements Tools</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6 font-medium text-gray-900">Continuous Verification</td>
                  <td className="text-center py-4 px-6"><span className="text-red-500 text-xl">✗</span></td>
                  <td className="text-center py-4 px-6"><span className="text-green-500 text-xl">✓</span></td>
                  <td className="text-center py-4 px-6"><span className="text-red-500 text-xl">✗</span></td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6 font-medium text-gray-900">Accessible & Collaborative</td>
                  <td className="text-center py-4 px-6"><span className="text-gray-400">—</span></td>
                  <td className="text-center py-4 px-6"><span className="text-green-500 text-xl">✓</span></td>
                  <td className="text-center py-4 px-6"><span className="text-gray-400">—</span></td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6 font-medium text-gray-900">MBSE & Architecture</td>
                  <td className="text-center py-4 px-6"><span className="text-gray-400">—</span></td>
                  <td className="text-center py-4 px-6"><span className="text-green-500 text-xl">✓</span></td>
                  <td className="text-center py-4 px-6"><span className="text-red-500 text-xl">✗</span></td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6 font-medium text-gray-900">Fast, Flexible & Easy</td>
                  <td className="text-center py-4 px-6"><span className="text-gray-400">—</span></td>
                  <td className="text-center py-4 px-6"><span className="text-green-500 text-xl">✓</span></td>
                  <td className="text-center py-4 px-6"><span className="text-red-500 text-xl">✗</span></td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6 font-medium text-gray-900">Onboarding Time</td>
                  <td className="text-center py-4 px-6 text-sm text-gray-600">Instant access</td>
                  <td className="text-center py-4 px-6 text-sm text-blue-600 font-semibold">Instant access & 14 days</td>
                  <td className="text-center py-4 px-6 text-sm text-gray-600">60+ day onboarding plan</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-gray-900">Approx cost (6 editors)</td>
                  <td className="text-center py-4 px-6 text-sm text-gray-600">Free</td>
                  <td className="text-center py-4 px-6 text-sm text-blue-600 font-semibold">$500/mo</td>
                  <td className="text-center py-4 px-6 text-sm text-gray-600">$5000/mo</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Efficiency Benefits & Urgency */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Spend less time chasing down requirements updates and spend more time optimizing your system
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto">
            Flux is the requirements management solution that's <strong>lightweight enough to speed up your workflows</strong>,
            and <strong>rigorous enough to never worry about compliance and traceability again</strong>.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Save dozens of hours</h3>
              <p className="text-gray-600">for each design review</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Automated verification</h3>
              <p className="text-gray-600">from your team & tools</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Identify problems</h3>
              <p className="text-gray-600">before it's too late</p>
            </div>
          </div>

          <div className="mt-12 bg-orange-50 border-l-4 border-orange-400 p-6 rounded-lg text-left max-w-4xl mx-auto">
            <h3 className="font-bold text-orange-800 mb-2 text-lg">⚠️ Catch design misses now and not 90 days from now</h3>
            <p className="text-orange-700">
              Flux helps prevent costly mistakes and get your products to market faster.
              Don't let requirements management become the bottleneck that delays your next breakthrough.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Agile requirements platform for iterative teams
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join innovative engineering teams who are building the future with Flux.
            Start designing better systems today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-lg shadow-lg"
            >
              Book a Demo
            </Link>
            <Link
              to="/register"
              className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-semibold text-lg"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-8 w-8 rounded-lg flex items-center justify-center">
                  <img
                    src="/app_logo.png"
                    alt="Flux Logo"
                    className="h-8 w-8 rounded-lg"
                  />
                </div>
                <span className="text-xl font-semibold">Flux</span>
              </div>
              <p className="text-gray-400 max-w-md">
                The agile requirements management solution for modern engineering teams.
                Fast, flexible, and built for collaboration.
              </p>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Product</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#comparison" className="hover:text-white transition-colors">Compare</a></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Company</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Flux. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
