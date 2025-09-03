import React, { useState, useEffect } from 'react';
import { linkService, type Link } from '../services/linkService';
import { requirementService, type Requirement } from '../services/requirementService';

interface BlockLinksProps {
  modelId: string;
  blockId: string;
  onLinkCreated?: () => void;
}

const BlockLinks: React.FC<BlockLinksProps> = ({ modelId, blockId, onLinkCreated }) => {
  const [links, setLinks] = useState<Link[]>([]);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [selectedRequirementId, setSelectedRequirementId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingLink, setIsCreatingLink] = useState(false);

  // Load existing links for this block
  useEffect(() => {
    loadBlockLinks();
  }, [modelId, blockId]);

  const loadBlockLinks = async () => {
    try {
      const response = await linkService.getBlockLinks(modelId, blockId);
      setLinks(response.links);
    } catch (error) {
      console.error('Error loading block links:', error);
    }
  };

  // Load available requirements when dialog opens
  const openLinkDialog = async () => {
    setIsLoading(true);
    try {
      const requirements = await requirementService.getRequirements();
      
      // Filter out already linked requirements
      const linkedRequirementIds = links.map(link => link.requirementId);
      const availableRequirements = requirements.filter(
        (req: Requirement) => !linkedRequirementIds.includes(req.id)
      );
      
      setRequirements(availableRequirements);
      setShowLinkDialog(true);
    } catch (error) {
      console.error('Error loading requirements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createLink = async () => {
    if (!selectedRequirementId) return;

    setIsCreatingLink(true);
    try {
      await linkService.createLink({
        modelId,
        blockId,
        requirementId: selectedRequirementId
      });
      
      await loadBlockLinks(); // Refresh links
      setShowLinkDialog(false);
      setSelectedRequirementId('');
      onLinkCreated?.();
    } catch (error) {
      console.error('Error creating link:', error);
    } finally {
      setIsCreatingLink(false);
    }
  };

  const deleteLink = async (linkId: string) => {
    if (!confirm('Are you sure you want to remove this link?')) return;

    try {
      await linkService.deleteLink(linkId);
      await loadBlockLinks(); // Refresh links
    } catch (error) {
      console.error('Error deleting link:', error);
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'open': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="mt-6 border-t border-gray-200 pt-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-medium text-gray-900">Linked Requirements</h4>
        <button
          onClick={openLinkDialog}
          disabled={isLoading}
          className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Loading...' : '+ Link Requirement'}
        </button>
      </div>

      {links.length === 0 ? (
        <p className="text-sm text-gray-500 italic">No requirements linked to this block.</p>
      ) : (
        <div className="space-y-3">
          {links.map((link) => (
            <div key={link.id} className="p-3 bg-gray-50 rounded-lg border">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h5 className="text-sm font-medium text-gray-900 truncate">
                    {link.requirement.title}
                  </h5>
                  {link.requirement.description && (
                    <p className="mt-1 text-xs text-gray-600 line-clamp-2">
                      {link.requirement.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    {link.requirement.priority && (
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(link.requirement.priority)}`}>
                        {link.requirement.priority}
                      </span>
                    )}
                    {link.requirement.status && (
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(link.requirement.status)}`}>
                        {link.requirement.status.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => deleteLink(link.id)}
                  className="ml-2 p-1 text-gray-400 hover:text-red-600"
                  title="Remove link"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Link Dialog */}
      {showLinkDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Link Requirement</h3>
            
            {requirements.length === 0 ? (
              <p className="text-sm text-gray-600 mb-4">
                No available requirements to link. All requirements are either already linked to this block or none exist.
              </p>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Requirement
                  </label>
                  <select
                    value={selectedRequirementId}
                    onChange={(e) => setSelectedRequirementId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Choose a requirement...</option>
                    {requirements.map((requirement) => (
                      <option key={requirement.id} value={requirement.id}>
                        {requirement.title} ({requirement.priority || 'medium'})
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowLinkDialog(false);
                  setSelectedRequirementId('');
                }}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              {requirements.length > 0 && (
                <button
                  onClick={createLink}
                  disabled={!selectedRequirementId || isCreatingLink}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isCreatingLink ? 'Linking...' : 'Create Link'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlockLinks;
