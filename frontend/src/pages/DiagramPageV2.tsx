import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { modelService, type Model } from '../services/modelService';
import { diagramService, type Diagram } from '../services/diagramService';
import DiagramManager from '../components/DiagramManager';
import DiagramEditor from '../components/DiagramEditor';

const DiagramPageV2: React.FC = () => {
  const { id: modelId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [model, setModel] = useState<Model | null>(null);
  const [currentDiagram, setCurrentDiagram] = useState<Diagram | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDiagramManager, setShowDiagramManager] = useState(true);

  useEffect(() => {
    if (!modelId) {
      navigate('/dashboard');
      return;
    }
    
    loadModel();
  }, [modelId, navigate]);

  const loadModel = async () => {
    try {
      setLoading(true);
      const modelData = await modelService.getModel(modelId!);
      setModel(modelData);
      
      // Load diagrams and select the first one if available
      const diagrams = await diagramService.getModelDiagrams(modelId!);
      if (diagrams.length > 0) {
        setCurrentDiagram(diagrams[0]);
      }
    } catch (error: any) {
      console.error('Error loading model:', error);
      if (error.response?.status === 404) {
        setError('Model not found');
      } else {
        setError('Failed to load model');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDiagramSelect = (diagram: Diagram) => {
    setCurrentDiagram(diagram);
  };

  const handleSaveDiagram = async (diagramData: any) => {
    if (!currentDiagram) return;
    
    try {
      // Here we would save the diagram data
      // For now, we'll just log it
      console.log('Saving diagram data:', diagramData);
    } catch (error) {
      console.error('Failed to save diagram:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading model...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
            <svg className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!model) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                  {model.name}
                </h1>
                {currentDiagram && (
                  <p className="text-sm text-gray-600">
                    {currentDiagram.name} ({currentDiagram.type})
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowDiagramManager(!showDiagramManager)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  showDiagramManager
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  <span className="text-sm font-medium">Diagrams</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Diagram Manager Sidebar */}
        {showDiagramManager && (
          <div className="w-80 border-r border-white/20 bg-white/50 backdrop-blur-sm overflow-y-auto">
            <DiagramManager
              selectedModelId={modelId!}
              onDiagramSelect={handleDiagramSelect}
              selectedDiagramId={currentDiagram?.id}
            />
          </div>
        )}

        {/* Diagram Editor */}
        <div className="flex-1 relative">
          {currentDiagram ? (
            <DiagramEditor
              modelId={modelId}
              onSave={handleSaveDiagram}
              initialData={currentDiagram.diagramData}
              currentDiagram={currentDiagram}
              diagramType={currentDiagram.type}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <svg className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Diagram Selected</h3>
                <p className="text-gray-500 mb-4">Create or select a diagram to start editing</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Diagram Type Indicator */}
      {currentDiagram && (
        <div className="fixed bottom-4 right-4 z-30">
          <div className={`px-4 py-2 rounded-full shadow-lg text-sm font-medium ${
            currentDiagram.type === 'BDD'
              ? 'bg-green-100 text-green-700 border border-green-200'
              : 'bg-purple-100 text-purple-700 border border-purple-200'
          }`}>
            {currentDiagram.type === 'BDD' ? 'Block Definition Diagram' : 'Internal Block Diagram'}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagramPageV2;
