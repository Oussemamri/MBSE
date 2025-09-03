import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { exportImportService, type ExportData } from '../services/exportImportService';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [modelName, setModelName] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [importPreview, setImportPreview] = useState<ExportData | null>(null);

  const handleFileSelect = async (file: File) => {
    if (!file.type.includes('json')) {
      setError('Please select a valid JSON file');
      return;
    }

    try {
      setError('');
      const jsonData = await exportImportService.readFileAsJson(file);
      
      // Validate basic structure
      if (!jsonData.diagram || !jsonData.diagram.diagramData) {
        throw new Error('Invalid MBSE export file format');
      }

      setSelectedFile(file);
      setImportPreview(jsonData);
      setModelName(jsonData.diagram.name ? `${jsonData.diagram.name} (Imported)` : 'Imported Model');
    } catch (error: any) {
      setError(error.message || 'Failed to read file');
      setSelectedFile(null);
      setImportPreview(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleImport = async () => {
    if (!selectedFile || !importPreview || !modelName.trim()) {
      setError('Please provide a model name');
      return;
    }

    setIsImporting(true);
    setError('');

    try {
      const response = await exportImportService.importModelJson({
        modelName: modelName.trim(),
        importData: importPreview
      });

      // Navigate to the imported model
      navigate(`/diagram/${response.model.id}`);
      onClose();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to import model');
    } finally {
      setIsImporting(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setModelName('');
    setError('');
    setImportPreview(null);
    setDragActive(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Import Model
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* File Upload Area */}
        {!selectedFile && (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-lg font-medium text-gray-900 mb-2">
              Drop your JSON file here
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Or click to browse files
            </p>
            <input
              type="file"
              accept=".json"
              onChange={handleFileInput}
              className="hidden"
              id="file-input"
            />
            <label
              htmlFor="file-input"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
            >
              Choose File
            </label>
          </div>
        )}

        {/* File Preview */}
        {selectedFile && importPreview && (
          <div className="space-y-6">
            {/* Selected File Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Selected File</h3>
                  <p className="text-sm text-gray-600">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Import Preview */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Import Preview</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Original Name:</span>
                  <p className="font-medium">{importPreview.metadata.modelName}</p>
                </div>
                <div>
                  <span className="text-gray-600">Author:</span>
                  <p className="font-medium">{importPreview.metadata.originalAuthor}</p>
                </div>
                <div>
                  <span className="text-gray-600">Requirements:</span>
                  <p className="font-medium">{importPreview.requirements?.length || 0}</p>
                </div>
                <div>
                  <span className="text-gray-600">Links:</span>
                  <p className="font-medium">{importPreview.links?.length || 0}</p>
                </div>
              </div>
              {importPreview.diagram.description && (
                <div className="mt-3">
                  <span className="text-gray-600">Description:</span>
                  <p className="text-sm mt-1">{importPreview.diagram.description}</p>
                </div>
              )}
            </div>

            {/* Model Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Model Name
              </label>
              <input
                type="text"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter a name for the imported model"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                disabled={isImporting || !modelName.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isImporting ? 'Importing...' : 'Import Model'}
              </button>
            </div>
          </div>
        )}

        {error && !selectedFile && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportModal;
