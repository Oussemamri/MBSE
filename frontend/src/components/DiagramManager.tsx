import React, { useState, useEffect } from 'react';
import { diagramService, type Diagram, type CreateDiagramData } from '../services/diagramService';
import { modelService, type Model } from '../services/modelService';

interface DiagramManagerProps {
  selectedModelId: string;
  onDiagramSelect: (diagram: Diagram) => void;
  selectedDiagramId?: string;
}

const DiagramManager: React.FC<DiagramManagerProps> = ({ 
  selectedModelId, 
  onDiagramSelect,
  selectedDiagramId 
}) => {
  const [diagrams, setDiagrams] = useState<Diagram[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [model, setModel] = useState<Model | null>(null);
  const [createData, setCreateData] = useState<CreateDiagramData>({
    name: '',
    type: 'BDD',
    modelId: selectedModelId
  });

  // Load diagrams when model changes
  useEffect(() => {
    if (selectedModelId) {
      loadDiagrams();
      loadModel();
    }
  }, [selectedModelId]);

  const loadModel = async () => {
    try {
      const modelData = await modelService.getModel(selectedModelId);
      setModel(modelData);
    } catch (error) {
      console.error('Failed to load model:', error);
    }
  };

  const loadDiagrams = async () => {
    try {
      setLoading(true);
      const diagramsData = await diagramService.getModelDiagrams(selectedModelId);
      setDiagrams(diagramsData);
      
      // If no diagram is selected and there are diagrams, select the first one
      if (diagramsData.length > 0 && !selectedDiagramId) {
        onDiagramSelect(diagramsData[0]);
      }
    } catch (error) {
      console.error('Failed to load diagrams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newDiagram = await diagramService.createDiagram({
        ...createData,
        modelId: selectedModelId
      });
      
      setDiagrams(prev => [...prev, newDiagram]);
      setShowCreateForm(false);
      setCreateData({ name: '', type: 'BDD', modelId: selectedModelId });
      onDiagramSelect(newDiagram);
    } catch (error) {
      console.error('Failed to create diagram:', error);
    }
  };

  const handleDelete = async (diagramId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this diagram?')) {
      try {
        await diagramService.deleteDiagram(diagramId);
        setDiagrams(prev => prev.filter(d => d.id !== diagramId));
        
        // If deleted diagram was selected, select another one
        if (selectedDiagramId === diagramId && diagrams.length > 1) {
          const remainingDiagrams = diagrams.filter(d => d.id !== diagramId);
          if (remainingDiagrams.length > 0) {
            onDiagramSelect(remainingDiagrams[0]);
          }
        }
      } catch (error) {
        console.error('Failed to delete diagram:', error);
      }
    }
  };

  const getDiagramIcon = (type: 'BDD' | 'IBD') => {
    if (type === 'BDD') {
      return (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z" />
        </svg>
      );
    }
    return (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    );
  };

  if (!selectedModelId) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-500">Select a model to view diagrams</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Diagrams</h3>
            {model && (
              <p className="text-sm text-gray-600">{model.name}</p>
            )}
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center"
          >
            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Diagram
          </button>
        </div>
      </div>

      {/* Diagrams List */}
      <div className="p-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : diagrams.length === 0 ? (
          <div className="text-center py-8">
            <svg className="h-12 w-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-500 text-sm">No diagrams created yet</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Create your first diagram
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {diagrams.map((diagram) => (
              <div
                key={diagram.id}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedDiagramId === diagram.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => onDiagramSelect(diagram)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded ${diagram.type === 'BDD' ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'}`}>
                      {getDiagramIcon(diagram.type)}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{diagram.name}</h4>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          diagram.type === 'BDD' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-purple-100 text-purple-700'
                        }`}>
                          {diagram.type}
                        </span>
                        <span>{diagram.diagramBlocks.length} blocks</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDelete(diagram.id, e)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Diagram Form */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Create New Diagram</h3>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Diagram Name
                  </label>
                  <input
                    type="text"
                    value={createData.name}
                    onChange={(e) => setCreateData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter diagram name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Diagram Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setCreateData(prev => ({ ...prev, type: 'BDD' }))}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        createData.type === 'BDD'
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <div className="p-2 rounded bg-green-100 text-green-600 mb-2">
                          {getDiagramIcon('BDD')}
                        </div>
                        <span className="font-medium">BDD</span>
                        <span className="text-xs text-gray-500">Block Definition</span>
                      </div>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setCreateData(prev => ({ ...prev, type: 'IBD' }))}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        createData.type === 'IBD'
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <div className="p-2 rounded bg-purple-100 text-purple-600 mb-2">
                          {getDiagramIcon('IBD')}
                        </div>
                        <span className="font-medium">IBD</span>
                        <span className="text-xs text-gray-500">Internal Block</span>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create Diagram
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagramManager;
