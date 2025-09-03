import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DiagramEditor from '../components/DiagramEditor';
import ShareModal from '../components/ShareModal';
import ExportButtons from '../components/ExportButtons';
import ImportModal from '../components/ImportModal';
import { modelService } from '../services/modelService';

const DiagramPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [diagramData, setDiagramData] = useState<any>(null);
  const [modelName, setModelName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  // Load existing diagram if ID is provided
  useEffect(() => {
    console.log('DiagramPage useEffect - id parameter is:', id);
    const loadDiagram = async () => {
      if (!id || id === 'new' || id === 'undefined') {
        console.log('Setting up new diagram (id is new, undefined, or falsy)');
        setModelName('New Diagram');
        return;
      }

      console.log('Loading existing diagram with id:', id);
      setIsLoading(true);
      try {
        const model = await modelService.getModel(id);
        console.log('Full model data:', model);
        console.log('Diagram data:', model.diagramData);
        setDiagramData(model.diagramData);
        setModelName(model.name);
        console.log('Model loaded successfully:', model.name);
      } catch (error: any) {
        console.error('Error loading diagram:', error);
        setError('Failed to load diagram');
      } finally {
        setIsLoading(false);
      }
    };

    loadDiagram();
  }, [id]);

  // Keyboard shortcut for saving (Ctrl+S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        if (diagramData) {
          handleSave(diagramData);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [diagramData]);

  // Save diagram
  const handleSave = async (diagramJson: any) => {
    console.log('handleSave called with id:', id);
    console.log('id type:', typeof id);
    console.log('id === "new":', id === 'new');
    console.log('!id:', !id);
    console.log('id && id !== "new":', id && id !== 'new');
    
    setIsSaving(true);
    try {
      if (id && id !== 'new' && id !== 'undefined') {
        console.log('Taking UPDATE path for existing model');
        // Update existing model
        await modelService.updateModel(id, {
          name: modelName,
          diagramData: diagramJson
        });
      } else {
        console.log('Taking CREATE path for new model');
        // Create new model
        console.log('Creating new model with data:', { name: modelName, diagramData: diagramJson });
        const newModel = await modelService.createModel({
          name: modelName,
          diagramData: diagramJson
        });
        console.log('Model created successfully:', newModel);
        console.log('New model ID:', newModel.id);
        console.log('Redirecting to:', `/diagram/${newModel.id}`);
        // Redirect to the new model's URL
        navigate(`/diagram/${newModel.id}`, { replace: true });
      }
    } catch (error: any) {
      console.error('Error saving diagram:', error);
      setError('Failed to save diagram');
    } finally {
      setIsSaving(false);
    }
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
          <span className="text-gray-600">Loading diagram...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
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
              <input
                type="text"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                className="text-xl font-semibold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-0 px-0"
                placeholder="Enter diagram name"
              />
              <p className="text-sm text-gray-500">
                {id ? `Model ID: ${id}` : 'Unsaved diagram'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Import Button */}
            <button
              onClick={() => setShowImportModal(true)}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 12l3 3m0 0l3-3m-3 3V9" />
              </svg>
              Import
            </button>

            {/* Export Buttons - Only show for saved models */}
            {id && id !== 'new' && id !== 'undefined' && <ExportButtons modelId={id} />}

            {/* Share Button - Only show for saved models */}
            {id && id !== 'new' && id !== 'undefined' && (
              <button
                onClick={() => setShowShareModal(true)}
                className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Share
              </button>
            )}

            {isSaving && (
              <div className="flex items-center text-blue-600">
                <svg className="animate-spin h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Saving...
              </div>
            )}

            <div className="text-sm text-gray-500">
              Use <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl+S</kbd> to save
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-800 text-sm font-medium">{error}</p>
              <button
                onClick={() => setError('')}
                className="ml-auto text-red-400 hover:text-red-600"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Diagram Editor */}
      <div className="flex-1 overflow-hidden">
        <DiagramEditor
          onSave={handleSave}
          initialData={diagramData}
          modelId={id && id !== 'new' && id !== 'undefined' ? id : undefined}
        />
      </div>

      {/* Share Modal */}
      {id && id !== 'new' && id !== 'undefined' && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          modelId={id}
          modelName={modelName}
        />
      )}

      {/* Import Modal */}
      <ImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
      />
    </div>
  );
};

export default DiagramPage;
