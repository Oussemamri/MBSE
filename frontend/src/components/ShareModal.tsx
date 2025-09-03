import React, { useState, useEffect } from 'react';
import { shareService, type ModelShare } from '../services/shareService';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  modelId: string;
  modelName: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, modelId, modelName }) => {
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState<'view' | 'edit'>('view');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [shares, setShares] = useState<ModelShare[]>([]);
  const [loadingShares, setLoadingShares] = useState(false);

  // Load existing shares when modal opens
  useEffect(() => {
    if (isOpen) {
      loadShares();
      // Reset form
      setEmail('');
      setPermission('view');
      setError('');
      setSuccess('');
    }
  }, [isOpen, modelId]);

  const loadShares = async () => {
    setLoadingShares(true);
    try {
      const response = await shareService.getModelShares(modelId);
      setShares(response.shares);
    } catch (error: any) {
      console.error('Error loading shares:', error);
    } finally {
      setLoadingShares(false);
    }
  };

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await shareService.shareModel({
        modelId,
        email: email.trim(),
        permission
      });

      setSuccess(response.message);
      setEmail('');
      setPermission('view');
      await loadShares(); // Refresh the shares list
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to share model');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveShare = async (shareId: string) => {
    if (!confirm('Are you sure you want to remove this share?')) {
      return;
    }

    try {
      await shareService.removeShare(shareId);
      await loadShares(); // Refresh the shares list
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to remove share');
    }
  };

  const getPermissionColor = (permission: string) => {
    return permission === 'edit' 
      ? 'bg-blue-100 text-blue-800 border-blue-200' 
      : 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Share "{modelName}"
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Share Form */}
        <form onSubmit={handleShare} className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter user email..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Permission
              </label>
              <select
                value={permission}
                onChange={(e) => setPermission(e.target.value as 'view' | 'edit')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="view">View Only</option>
                <option value="edit">Can Edit</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {success && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-600">{success}</p>
            </div>
          )}

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Sharing...' : 'Share Model'}
            </button>
          </div>
        </form>

        {/* Current Shares */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Current Shares</h3>
          
          {loadingShares ? (
            <div className="flex items-center justify-center py-8">
              <svg className="animate-spin h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
            </div>
          ) : shares.length === 0 ? (
            <p className="text-sm text-gray-500 italic py-8 text-center">
              No shares yet. Start sharing this model by entering an email above.
            </p>
          ) : (
            <div className="space-y-3">
              {shares.map((share) => (
                <div key={share.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">
                          {(share.user.name || share.user.email).charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {share.user.name || 'Unknown User'}
                      </p>
                      <p className="text-sm text-gray-500">{share.user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPermissionColor(share.permission)}`}>
                      {share.permission === 'edit' ? 'Can Edit' : 'View Only'}
                    </span>
                    <button
                      onClick={() => handleRemoveShare(share.id)}
                      className="text-gray-400 hover:text-red-600"
                      title="Remove share"
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

        <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
