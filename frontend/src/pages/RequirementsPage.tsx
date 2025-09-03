import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { requirementService, type Requirement, type CreateRequirementData } from '../services/requirementService';
import { modelService, type Model } from '../services/modelService';
import TraceabilityView from '../components/TraceabilityView';

const RequirementsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'requirements' | 'traceability'>('requirements');
  const [selectedModelId, setSelectedModelId] = useState<string>('');
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingRequirement, setEditingRequirement] = useState<Requirement | null>(null);
  const [formData, setFormData] = useState<CreateRequirementData>({
    title: '',
    description: '',
    priority: 'medium',
    status: 'open',
    modelId: ''
  });

  // Load requirements and models
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [requirementsData, modelsData] = await Promise.all([
        requirementService.getRequirements(),
        modelService.getMyModels()
      ]);
      setRequirements(requirementsData);
      setModels(modelsData);
    } catch (error: any) {
      console.error('Error loading data:', error);
      setError('Failed to load requirements');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingRequirement) {
        // Update existing requirement
        const updated = await requirementService.updateRequirement(editingRequirement.id, formData);
        setRequirements(prev => prev.map(req => req.id === updated.id ? updated : req));
      } else {
        // Create new requirement
        const newRequirement = await requirementService.createRequirement(formData);
        setRequirements(prev => [newRequirement, ...prev]);
      }
      resetForm();
    } catch (error: any) {
      console.error('Error saving requirement:', error);
      setError('Failed to save requirement');
    }
  };

  const handleEdit = (requirement: Requirement) => {
    setEditingRequirement(requirement);
    setFormData({
      title: requirement.title,
      description: requirement.description || '',
      priority: requirement.priority,
      status: requirement.status,
      modelId: requirement.modelId || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this requirement?')) return;

    try {
      await requirementService.deleteRequirement(id);
      setRequirements(prev => prev.filter(req => req.id !== id));
    } catch (error: any) {
      console.error('Error deleting requirement:', error);
      setError('Failed to delete requirement');
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingRequirement(null);
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      status: 'open',
      modelId: ''
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'open': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-3">
          <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
          <span className="text-gray-600">Loading requirements...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link
                to="/dashboard"
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                  Requirements Management
                </h1>
                <p className="text-gray-600">Define and track system requirements</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium flex items-center"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Requirement
            </button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex space-x-1 bg-white/60 backdrop-blur-xl rounded-2xl p-2 shadow-lg border border-white/20 mb-8">
          <button
            onClick={() => setActiveTab('requirements')}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === 'requirements'
                ? 'bg-white text-blue-700 shadow-md'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
            }`}
          >
            Requirements Management
          </button>
          <button
            onClick={() => setActiveTab('traceability')}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === 'traceability'
                ? 'bg-white text-blue-700 shadow-md'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
            }`}
          >
            Traceability Matrix
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{activeTab === 'requirements' ? (
        <>
        {/* Requirements Management Content */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-800 text-sm font-medium">{error}</p>
              </div>
              <button
                onClick={() => setError('')}
                className="text-red-400 hover:text-red-600"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Requirements Table */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">All Requirements ({requirements.length})</h2>
          </div>

          {requirements.length === 0 ? (
            <div className="text-center py-12">
              <svg className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No requirements yet</h3>
              <p className="text-gray-500 mb-6">Get started by creating your first system requirement</p>
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
              >
                Create First Requirement
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Model
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {requirements.map((requirement) => (
                    <tr key={requirement.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {requirement.title}
                          </div>
                          {requirement.description && (
                            <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                              {requirement.description}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(requirement.priority)}`}>
                          {requirement.priority.charAt(0).toUpperCase() + requirement.priority.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(requirement.status)}`}>
                          {requirement.status.replace('_', ' ').charAt(0).toUpperCase() + requirement.status.replace('_', ' ').slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {requirement.model ? (
                          <Link
                            to={`/diagram/${requirement.model.id}`}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            {requirement.model.name}
                          </Link>
                        ) : (
                          <span className="text-gray-400 text-sm">No model</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(requirement.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(requirement)}
                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(requirement.id)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        </>
      ) : (
        /* Traceability Matrix Content */
        <div className="space-y-6">
          {models.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500">
                <p className="text-lg font-medium mb-2">No Models Available</p>
                <p className="text-sm">Create a model with blocks to view traceability matrix.</p>
              </div>
            </div>
          ) : (
            <>
              {/* Model Selection */}
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Model for Traceability Matrix
                </label>
                <select
                  value={selectedModelId}
                  onChange={(e) => setSelectedModelId(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Choose a model...</option>
                  {models.map(model => (
                    <option key={model.id} value={model.id}>
                      {model.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Traceability Matrix */}
              {selectedModelId && (
                <TraceabilityView modelId={selectedModelId} />
              )}
            </>
          )}
        </div>
      )}
      </main>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-8 py-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingRequirement ? 'Edit Requirement' : 'New Requirement'}
                </h3>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter requirement title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  placeholder="Describe the requirement in detail"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Associated Model
                </label>
                <select
                  value={formData.modelId}
                  onChange={(e) => setFormData(prev => ({ ...prev, modelId: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">No model</option>
                  {models.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                >
                  {editingRequirement ? 'Update' : 'Create'} Requirement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequirementsPage;
