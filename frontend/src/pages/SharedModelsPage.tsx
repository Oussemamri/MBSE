import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { shareService, type SharedModel } from '../services/shareService';

const SharedModelsPage: React.FC = () => {
  const [sharedModels, setSharedModels] = useState<SharedModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSharedModels();
  }, []);

  const loadSharedModels = async () => {
    try {
      const response = await shareService.getSharedModels();
      setSharedModels(response.sharedModels);
    } catch (error: any) {
      console.error('Error loading shared models:', error);
      setError('Failed to load shared models');
    } finally {
      setIsLoading(false);
    }
  };

  const getPermissionColor = (permission: string) => {
    return permission === 'edit' 
      ? 'bg-blue-100 text-blue-800 border-blue-200' 
      : 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-3">
          <svg 
            className="animate-spin h-8 w-8 text-blue-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="text-lg text-gray-600">Loading shared models...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link 
                to="/dashboard"
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Shared with Me</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {sharedModels.length === 0 ? (
          <div className="text-center py-16">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No shared models</h3>
            <p className="mt-2 text-gray-500">
              Models that others share with you will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sharedModels.map((sharedModel) => (
              <div key={sharedModel.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {sharedModel.model.name}
                      </h3>
                      {sharedModel.model.description && (
                        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                          {sharedModel.model.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPermissionColor(sharedModel.permission)}`}>
                      {sharedModel.permission === 'edit' ? 'Can Edit' : 'View Only'}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="truncate">
                        Shared by {sharedModel.model.user.name || sharedModel.model.user.email}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1M8 7h8m-9 4v10a1 1 0 001 1h8a1 1 0 001-1V11a1 1 0 00-1-1H8a1 1 0 00-1 1z" />
                      </svg>
                      <span>Shared {formatDate(sharedModel.sharedAt)}</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Updated {formatDate(sharedModel.model.updatedAt)}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to={`/diagram/${sharedModel.model.id}`}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 text-center"
                    >
                      Open Diagram
                    </Link>
                    {sharedModel.permission === 'edit' && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-md flex items-center">
                        ✓ Editable
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default SharedModelsPage;
