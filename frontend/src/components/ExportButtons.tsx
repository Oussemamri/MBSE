import React, { useState } from 'react';
import { exportImportService } from '../services/exportImportService';

interface ExportButtonsProps {
  modelId: string;
  modelName?: string;
}

const ExportButtons: React.FC<ExportButtonsProps> = ({ modelId }) => {
  const [isExporting, setIsExporting] = useState<'json' | 'xmi' | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleExportJson = async () => {
    setIsExporting('json');
    setError('');
    setSuccess('');

    try {
      await exportImportService.exportModelJson(modelId);
      setSuccess('Model exported successfully as JSON');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to export model as JSON');
    } finally {
      setIsExporting(null);
      // Clear messages after 3 seconds
      setTimeout(() => {
        setSuccess('');
        setError('');
      }, 3000);
    }
  };

  const handleExportXmi = async () => {
    setIsExporting('xmi');
    setError('');
    setSuccess('');

    try {
      await exportImportService.exportModelXmi(modelId);
      setSuccess('Model exported successfully as XMI');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to export model as XMI');
    } finally {
      setIsExporting(null);
      // Clear messages after 3 seconds
      setTimeout(() => {
        setSuccess('');
        setError('');
      }, 3000);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* JSON Export Button */}
      <button
        onClick={handleExportJson}
        disabled={isExporting !== null}
        className="flex items-center gap-2 px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="Export model as JSON (includes all data)"
      >
        {isExporting === 'json' ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )}
        <span>JSON</span>
      </button>

      {/* XMI Export Button */}
      <button
        onClick={handleExportXmi}
        disabled={isExporting !== null}
        className="flex items-center gap-2 px-3 py-2 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="Export model as SysML XMI (standards-compliant)"
      >
        {isExporting === 'xmi' ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )}
        <span>XMI</span>
      </button>

      {/* Success Message */}
      {success && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{success}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default ExportButtons;
