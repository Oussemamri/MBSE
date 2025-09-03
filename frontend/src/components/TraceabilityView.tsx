import React, { useState, useEffect } from 'react';
import { requirementService } from '../services/requirementService';
import type { TraceabilityMatrix } from '../services/requirementService';

interface TraceabilityViewProps {
  modelId: string;
}

const TraceabilityView: React.FC<TraceabilityViewProps> = ({ modelId }) => {
  const [matrix, setMatrix] = useState<TraceabilityMatrix | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTraceabilityMatrix();
  }, [modelId]);

  const loadTraceabilityMatrix = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await requirementService.getTraceabilityMatrix(modelId);
      setMatrix(data);
    } catch (error) {
      console.error('Error loading traceability matrix:', error);
      setError('Failed to load traceability matrix');
    } finally {
      setLoading(false);
    }
  };

  const toggleLink = async (requirementId: string, blockId: string, isLinked: boolean) => {
    if (!matrix) return;

    try {
      if (isLinked) {
        // Unlink
        await requirementService.unlinkRequirementFromBlock(requirementId, blockId);
      } else {
        // Link - get current block IDs for requirement and add the new one
        const requirement = matrix.matrix.requirements.find(r => r.id === requirementId);
        const currentBlockIds = requirement?.linkedBlocks || [];
        const newBlockIds = [...currentBlockIds, blockId];
        await requirementService.linkRequirementToBlocks(requirementId, newBlockIds, modelId);
      }
      
      // Reload matrix
      await loadTraceabilityMatrix();
    } catch (error) {
      console.error('Error toggling link:', error);
      setError('Failed to update link');
    }
  };

  const isLinked = (requirementId: string, blockId: string): boolean => {
    return matrix?.links.some(link => 
      link.requirementId === requirementId && link.blockId === blockId
    ) || false;
  };

  const getUnlinkedRequirements = () => {
    return matrix?.matrix.requirements.filter(req => req.linkedBlocks.length === 0) || [];
  };

  const getUnlinkedBlocks = () => {
    return matrix?.matrix.blocks.filter(block => block.linkedRequirements.length === 0) || [];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading traceability matrix...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={loadTraceabilityMatrix}
          className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!matrix || (matrix.requirements.length === 0 && matrix.blocks.length === 0)) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>No requirements or blocks found for this model.</p>
        <p className="text-sm mt-2">Create some requirements and blocks to see the traceability matrix.</p>
      </div>
    );
  }

  const unlinkedRequirements = getUnlinkedRequirements();
  const unlinkedBlocks = getUnlinkedBlocks();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Traceability Matrix</h2>
        <button
          onClick={loadTraceabilityMatrix}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Validation Warnings */}
      {(unlinkedRequirements.length > 0 || unlinkedBlocks.length > 0) && (
        <div className="space-y-3">
          {unlinkedRequirements.length > 0 && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">
                ⚠️ Unlinked Requirements ({unlinkedRequirements.length})
              </h3>
              <div className="text-sm text-yellow-700 space-y-1">
                {unlinkedRequirements.map(req => (
                  <div key={req.id}>{req.title}</div>
                ))}
              </div>
            </div>
          )}

          {unlinkedBlocks.length > 0 && (
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <h3 className="font-semibold text-orange-800 mb-2">
                ⚠️ Unlinked Blocks ({unlinkedBlocks.length})
              </h3>
              <div className="text-sm text-orange-700 space-y-1">
                {unlinkedBlocks.map(block => (
                  <div key={block.id}>{block.name} ({block.type})</div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Traceability Matrix Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b border-gray-200 min-w-[200px]">
                  Requirements
                </th>
                {matrix.blocks.map(block => (
                  <th 
                    key={block.id}
                    className="px-2 py-3 text-center text-sm font-semibold text-gray-900 border-b border-gray-200 min-w-[100px]"
                    style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                  >
                    <div className="transform rotate-180">
                      {block.name}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {matrix.requirements.map((requirement, rowIndex) => (
                <tr key={requirement.id} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 border-r border-gray-200">
                    <div className="text-sm font-medium text-gray-900">{requirement.title}</div>
                    {requirement.description && (
                      <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {requirement.description}
                      </div>
                    )}
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        requirement.priority === 'critical' ? 'bg-red-100 text-red-800' :
                        requirement.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        requirement.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {requirement.priority}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        requirement.status === 'completed' ? 'bg-green-100 text-green-800' :
                        requirement.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        requirement.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {requirement.status}
                      </span>
                    </div>
                  </td>
                  {matrix.blocks.map(block => {
                    const linked = isLinked(requirement.id, block.id);
                    return (
                      <td key={block.id} className="px-2 py-3 text-center border-r border-gray-200">
                        <button
                          onClick={() => toggleLink(requirement.id, block.id, linked)}
                          className={`w-6 h-6 rounded transition-colors ${
                            linked 
                              ? 'bg-green-500 text-white hover:bg-green-600' 
                              : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                          }`}
                          title={linked ? 'Click to unlink' : 'Click to link'}
                        >
                          {linked ? '✓' : '○'}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800">Requirements</h3>
          <p className="text-2xl font-bold text-blue-900">{matrix.requirements.length}</p>
          <p className="text-sm text-blue-600">{matrix.links.length} total links</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold text-green-800">Blocks</h3>
          <p className="text-2xl font-bold text-green-900">{matrix.blocks.length}</p>
          <p className="text-sm text-green-600">
            {matrix.blocks.filter(b => b.linkedRequirements.length > 0).length} linked
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="font-semibold text-purple-800">Coverage</h3>
          <p className="text-2xl font-bold text-purple-900">
            {matrix.requirements.length > 0 
              ? Math.round((matrix.requirements.filter(r => matrix.matrix.requirements.find(mr => mr.id === r.id)?.linkedBlocks.length! > 0).length / matrix.requirements.length) * 100)
              : 0}%
          </p>
          <p className="text-sm text-purple-600">requirements linked</p>
        </div>
      </div>
    </div>
  );
};

export default TraceabilityView;
