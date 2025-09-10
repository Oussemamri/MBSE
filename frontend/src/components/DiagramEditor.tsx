import React, { useEffect, useRef, useState } from 'react';
import * as joint from 'jointjs';
import BlockLinks from './BlockLinks';
import { linkService } from '../services/linkService';
import blockService from '../services/blockService';
import { requirementService } from '../services/requirementService';
import { diagramService, type Diagram } from '../services/diagramService';
import type { Block as ApiBlock, BlockType } from '../services/blockService';
import type { Requirement } from '../services/requirementService';

interface Block {
  id: string;
  name: string;
  description: string;
  x: number;
  y: number;
  type?: BlockType;
  parentId?: string | null;
}

interface DiagramEditorProps {
  onSave?: (diagramData: any) => void;
  initialData?: any;
  modelId?: string;
  currentDiagram?: Diagram;
  diagramType?: 'BDD' | 'IBD';
}

const DiagramEditor: React.FC<DiagramEditorProps> = ({
  onSave,
  initialData,
  modelId,
  currentDiagram,
  diagramType = 'BDD'
}) => {
  const paperRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<joint.dia.Graph | null>(null);
  const paperInstanceRef = useRef<joint.dia.Paper | null>(null);

  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [showSidePanel, setShowSidePanel] = useState(false);
  const [blockLinks, setBlockLinks] = useState<{ [blockId: string]: number }>({});
  const [modelBlocks, setModelBlocks] = useState<ApiBlock[]>([]);
  const [isLoadingBlocks, setIsLoadingBlocks] = useState(false);
  const [modelRequirements, setModelRequirements] = useState<Requirement[]>([]);
  const [blockRequirements, setBlockRequirements] = useState<string[]>([]);
  const [isLoadingRequirements, setIsLoadingRequirements] = useState(false);

  // Initialize JointJS
  useEffect(() => {
    console.log('DiagramEditor useEffect - initializing JointJS');

    if (!paperRef.current) {
      console.log('No paper ref available');
      return;
    }

    // Wait for the next frame to ensure layout is complete
    const initializeJointJS = () => {
      const container = paperRef.current;
      if (!container) return;

      console.log('paperRef.current:', container);

      // Get actual container dimensions
      const containerRect = container.getBoundingClientRect();
      const width = Math.max(containerRect.width, 800);
      const height = Math.max(containerRect.height, 600);

      console.log('Container rect:', containerRect);
      console.log('Using dimensions:', width, 'x', height);

      console.log('Creating JointJS graph and paper...');
      // Create graph and paper
      const graph = new joint.dia.Graph();
      const paper = new joint.dia.Paper({
        el: container,
        model: graph,
        width: width,
        height: height,
        gridSize: 10,
        drawGrid: true,
        background: {
          color: '#f8f9fa'
        },
        interactive: {
          linkMove: false,
          labelMove: false,
          arrowheadMove: false,
          vertexMove: false,
          vertexAdd: false,
          vertexRemove: false,
          useLinkTools: false
        }
      });

      console.log('Setting graph and paper refs...');
      graphRef.current = graph;
      paperInstanceRef.current = paper;
      console.log('JointJS initialized successfully');
      console.log('Final paper dimensions:', width, 'x', height);

      // Load initial data if provided
      if (initialData) {
        console.log('Loading initial data:', initialData);
        try {
          // Clear the graph first
          graph.clear();

          // Restore the diagram from JSON data
          if (initialData.cells && Array.isArray(initialData.cells)) {
            // Process each cell in the saved data
            initialData.cells.forEach((cellData: any) => {
              try {
                if (cellData.type === 'standard.Rectangle') {
                  // Recreate rectangle elements
                  const rect = new joint.shapes.standard.Rectangle({
                    id: cellData.id,
                    position: cellData.position,
                    size: cellData.size,
                    attrs: cellData.attrs,
                    description: cellData.description
                  });
                  graph.addCell(rect);
                } else if (cellData.type === 'standard.Link') {
                  // Recreate link elements
                  const link = new joint.shapes.standard.Link({
                    id: cellData.id,
                    source: cellData.source,
                    target: cellData.target,
                    attrs: cellData.attrs
                  });
                  graph.addCell(link);
                } else {
                  // Try to restore other element types using fromJSON
                  console.log('Unknown cell type, trying fromJSON:', cellData.type);
                  graph.fromJSON({ cells: [cellData] });
                }
              } catch (error) {
                console.error('Error restoring cell:', cellData, error);
              }
            });
            console.log('Successfully restored', initialData.cells.length, 'cells');
          } else {
            // Fallback to direct fromJSON if data structure is different
            graph.fromJSON(initialData);
          }
        } catch (error) {
          console.error('Error loading initial data:', error);
          // Clear graph on error to prevent corruption
          graph.clear();
        }
      }

      // Handle element selection
      paper.on('element:pointerclick', (elementView: joint.dia.ElementView) => {
        const element = elementView.model as joint.dia.Element;
        const attrs = element.attributes;
        const elementId = element.id as string;

        // Try to find corresponding API block
        const apiBlock = modelBlocks.find(b => b.id === elementId);

        const selectedBlockData = {
          id: elementId,
          name: attrs.attrs?.text?.text || attrs.attrs?.label?.text || 'Untitled Block',
          description: attrs.description || '',
          x: attrs.position?.x || 0,
          y: attrs.position?.y || 0,
          type: apiBlock?.type || 'COMPONENT',
          parentId: apiBlock?.parentId || null
        };

        setSelectedBlock(selectedBlockData);
        setShowSidePanel(true);

        // Load requirements for this block
        loadBlockRequirements(elementId);
      });

      // Handle blank area click
      paper.on('blank:pointerclick', () => {
        setSelectedBlock(null);
        setShowSidePanel(false);
      });
    };

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(initializeJointJS);

    return () => {
      if (paperInstanceRef.current) {
        paperInstanceRef.current.remove();
      }
    };
  }, []); // Initialize only once

  // Handle data loading separately
  useEffect(() => {
    if (initialData && graphRef.current) {
      console.log('Loading data into existing graph:', initialData);
      try {
        // Clear the graph first
        graphRef.current.clear();

        // Restore the diagram from JSON data
        if (initialData.cells && Array.isArray(initialData.cells)) {
          // Process each cell in the saved data
          initialData.cells.forEach((cellData: any) => {
            try {
              if (cellData.type === 'standard.Rectangle') {
                // Recreate rectangle elements
                const rect = new joint.shapes.standard.Rectangle({
                  id: cellData.id,
                  position: cellData.position,
                  size: cellData.size,
                  attrs: cellData.attrs,
                  description: cellData.description
                });
                graphRef.current!.addCell(rect);
              } else if (cellData.type === 'standard.Link') {
                // Recreate link elements
                const link = new joint.shapes.standard.Link({
                  id: cellData.id,
                  source: cellData.source,
                  target: cellData.target,
                  attrs: cellData.attrs
                });
                graphRef.current!.addCell(link);
              } else {
                // Try to restore other element types using fromJSON
                console.log('Unknown cell type, trying fromJSON:', cellData.type);
                graphRef.current!.fromJSON({ cells: [cellData] });
              }
            } catch (error) {
              console.error('Error restoring cell:', cellData, error);
            }
          });
          console.log('Successfully restored', initialData.cells.length, 'cells to existing graph');
        } else {
          // Fallback to direct fromJSON if data structure is different
          graphRef.current.fromJSON(initialData);
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
        // Clear graph on error to prevent corruption
        graphRef.current.clear();
      }
    }
  }, [initialData]);

  // Load model blocks from API
  useEffect(() => {
    if (modelId && modelId !== 'undefined' && modelId !== 'new') {
      loadModelBlocks();
      loadModelRequirements();
    }
  }, [modelId]);

  // Load requirements from API
  const loadModelRequirements = async () => {
    if (!modelId) return;

    setIsLoadingRequirements(true);
    try {
      const requirements = await requirementService.getModelRequirements(modelId);
      setModelRequirements(requirements);
    } catch (error) {
      console.error('Error loading requirements:', error);
    } finally {
      setIsLoadingRequirements(false);
    }
  };

  // Load requirements linked to a specific block
  const loadBlockRequirements = async (blockId: string) => {
    if (!modelId) return;

    try {
      const response = await linkService.getModelLinks(modelId);
      const blockLinks = response.links
        .filter(link => link.blockId === blockId)
        .map(link => link.requirementId);
      setBlockRequirements(blockLinks);
    } catch (error) {
      console.error('Error loading block requirements:', error);
      setBlockRequirements([]);
    }
  };

  // Update block requirements
  const updateBlockRequirements = async (requirementIds: string[]) => {
    if (!selectedBlock || !modelId) return;

    try {
      // First, remove all existing links for this block
      const currentResponse = await linkService.getModelLinks(modelId);
      const currentBlockLinks = currentResponse.links.filter(link => link.blockId === selectedBlock.id);

      for (const link of currentBlockLinks) {
        await linkService.deleteLink(link.id);
      }

      // Then add new links
      for (const reqId of requirementIds) {
        await linkService.createLink({
          modelId,
          blockId: selectedBlock.id,
          requirementId: reqId
        });
      }

      setBlockRequirements(requirementIds);

      // Refresh block link counts
      const response = await linkService.getModelLinks(modelId);
      const linkCounts: { [blockId: string]: number } = {};
      response.links.forEach(link => {
        linkCounts[link.blockId] = (linkCounts[link.blockId] || 0) + 1;
      });
      setBlockLinks(linkCounts);
    } catch (error) {
      console.error('Error updating block requirements:', error);
    }
  };

  // Load block link counts if modelId is available
  useEffect(() => {
    const loadBlockLinkCounts = async () => {
      if (!modelId || modelId === 'undefined' || modelId === 'new') {
        return;
      }

      try {
        const response = await linkService.getModelLinks(modelId);
        const linkCounts: { [blockId: string]: number } = {};

        response.links.forEach(link => {
          linkCounts[link.blockId] = (linkCounts[link.blockId] || 0) + 1;
        });

        setBlockLinks(linkCounts);
      } catch (error) {
        console.error('Error loading block link counts:', error);
      }
    };

    loadBlockLinkCounts();
  }, [modelId]);

  // Create a new block
  const createBlock = async () => {
    console.log('createBlock called');
    console.log('graphRef.current:', graphRef.current);

    if (!graphRef.current) {
      console.log('No graph reference available');
      return;
    }

    console.log('Creating new block...');
    const position = { x: 100 + Math.random() * 200, y: 100 + Math.random() * 200 };

    const rect = new joint.shapes.standard.Rectangle({
      position,
      size: { width: 120, height: 60 },
      attrs: {
        body: {
          fill: 'rgba(59, 130, 246, 0.1)',
          stroke: '#3b82f6',
          strokeWidth: 2,
          rx: 8,
          ry: 8
        },
        text: {
          text: 'New Block',
          fontSize: 12,
          fontFamily: 'Arial, sans-serif',
          fill: '#1f2937',
          textWrap: {
            width: 110,
            height: 50,
            ellipsis: true
          }
        }
      },
      description: ''
    });

    console.log('Adding block to graph...');
    graphRef.current.addCell(rect);
    console.log('Block added successfully');

    // Save new block to API if we have a modelId
    if (modelId && modelId !== 'undefined' && modelId !== 'new') {
      try {
        const newBlock = await blockService.createBlock({
          name: 'New Block',
          type: 'COMPONENT',
          modelId: modelId
        });

        // Update local state
        setModelBlocks(prev => [...(prev || []), newBlock]);

        // Update the JointJS element ID to match the API block ID
        rect.set('id', newBlock.id);
      } catch (error) {
        console.error('Error saving new block to API:', error);
      }
    }
  };

  // Load blocks from API
  const loadModelBlocks = async () => {
    if (!modelId) return;

    setIsLoadingBlocks(true);
    try {
      const blocks = await blockService.getModelBlocks(modelId);
      setModelBlocks(blocks || []);
    } catch (error) {
      console.error('Error loading blocks:', error);
    } finally {
      setIsLoadingBlocks(false);
    }
  };

  // Save block to API
  const saveBlockToAPI = async (blockData: Block) => {
    if (!modelId) return;

    try {
      // Check if block exists in API
      const existingApiBlock = modelBlocks.find(b => b.id === blockData.id);

      if (existingApiBlock) {
        // Update existing block
        const updatedBlock = await blockService.updateBlock(blockData.id, {
          name: blockData.name,
          description: blockData.description || undefined,
          type: blockData.type,
          parentId: blockData.parentId || undefined
        });

        // Update local state
        setModelBlocks(prev => (prev || []).map(b => b.id === updatedBlock.id ? updatedBlock : b));
      } else {
        // Create new block
        const newBlock = await blockService.createBlock({
          name: blockData.name,
          description: blockData.description || undefined,
          type: blockData.type || 'COMPONENT',
          modelId: modelId,
          parentId: blockData.parentId || undefined
        });

        // Add to local state
        setModelBlocks(prev => [...(prev || []), newBlock]);
      }
    } catch (error) {
      console.error('Error saving block:', error);
    }
  };

  // Update selected block
  const updateSelectedBlock = async (field: keyof Block, value: string | null) => {
    if (!selectedBlock || !graphRef.current) return;

    const element = graphRef.current.getCell(selectedBlock.id) as joint.dia.Element;
    if (!element) return;

    const updatedBlock = { ...selectedBlock, [field]: value };
    setSelectedBlock(updatedBlock);

    // Update JointJS element
    if (field === 'name') {
      element.attr('text/text', value);
    }

    // Save to API
    await saveBlockToAPI(updatedBlock);
  };

  // Helper function for parent ID updates
  const updateBlockParent = async (parentId: string | null) => {
    if (!selectedBlock) return;

    const updatedBlock = { ...selectedBlock, parentId };
    setSelectedBlock(updatedBlock);

    // Save to API
    await saveBlockToAPI(updatedBlock);
  };

  // Connect blocks
  const connectMode = useRef(false);
  const firstElement = useRef<string | null>(null);

  const toggleConnectMode = () => {
    connectMode.current = !connectMode.current;
    firstElement.current = null;

    if (!paperInstanceRef.current) return;

    if (connectMode.current) {
      paperInstanceRef.current.on('element:pointerclick', handleConnectClick);
    } else {
      paperInstanceRef.current.off('element:pointerclick', handleConnectClick);
    }
  };

  const handleConnectClick = (elementView: joint.dia.ElementView) => {
    if (!graphRef.current) return;

    const elementId = elementView.model.id as string;

    if (!firstElement.current) {
      firstElement.current = elementId;
      // Visual feedback
      elementView.model.attr('body/stroke', '#ef4444');
      elementView.model.attr('body/strokeWidth', 3);
    } else if (firstElement.current !== elementId) {
      // Create link
      const link = new joint.shapes.standard.Link({
        source: { id: firstElement.current },
        target: { id: elementId },
        attrs: {
          line: {
            stroke: '#6b7280',
            strokeWidth: 2,
            targetMarker: {
              type: 'path',
              d: 'M 10 -5 0 0 10 5 z',
              fill: '#6b7280'
            }
          }
        }
      });

      graphRef.current.addCell(link);

      // Reset
      const firstEl = graphRef.current.getCell(firstElement.current);
      if (firstEl) {
        firstEl.attr('body/stroke', '#3b82f6');
        firstEl.attr('body/strokeWidth', 2);
      }

      firstElement.current = null;
      connectMode.current = false;
      paperInstanceRef.current?.off('element:pointerclick', handleConnectClick);
    }
  };

  // Save diagram
  const handleSave = () => {
    if (onSave && graphRef.current) {
      const currentDiagramData = graphRef.current.toJSON();
      onSave(currentDiagramData);
    }
  };

  // Delete selected block
  const deleteSelectedBlock = () => {
    if (!selectedBlock || !graphRef.current) return;

    const element = graphRef.current.getCell(selectedBlock.id);
    if (element) {
      element.remove();
      setSelectedBlock(null);
      setShowSidePanel(false);
    }
  };

  return (
    <div className="flex h-full bg-gray-50 overflow-hidden">
      {/* Toolbar */}
      <div className="w-64 bg-white shadow-lg border-r border-gray-200 p-4 flex flex-col flex-shrink-0">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Diagram Tools</h3>

        <div className="space-y-3">
          <button
            onClick={createBlock}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Block
          </button>

          <button
            onClick={toggleConnectMode}
            className={`w-full px-4 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center ${connectMode.current
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-green-600 text-white hover:bg-green-700'
              }`}
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            {connectMode.current ? 'Cancel Connect' : 'Connect Blocks'}
          </button>

          <button
            onClick={handleSave}
            className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            Save Diagram
          </button>

          {selectedBlock && (
            <button
              onClick={deleteSelectedBlock}
              className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Block
            </button>
          )}
        </div>

        {connectMode.current && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Connect Mode:</strong> Click on two blocks to connect them.
            </p>
          </div>
        )}
      </div>

      {/* Canvas */}
      <div className="flex-1 relative bg-gray-100 min-w-0">
        <div
          ref={paperRef}
          className="w-full h-full absolute inset-0"
          style={{
            minHeight: '600px',
            minWidth: '400px'
          }}
        />
      </div>

      {/* Side Panel */}
      {showSidePanel && selectedBlock && (
        <div className="w-72 max-w-xs bg-white shadow-lg border-l border-gray-200 p-4 flex-shrink-0 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-semibold text-gray-900 truncate">Block Properties</h3>
              {blockLinks[selectedBlock.id] && (
                <p className="text-sm text-blue-600 mt-1">
                  {blockLinks[selectedBlock.id]} requirement{blockLinks[selectedBlock.id] !== 1 ? 's' : ''} linked
                </p>
              )}
            </div>
            <button
              onClick={() => setShowSidePanel(false)}
              className="text-gray-400 hover:text-gray-600 flex-shrink-0 ml-2"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Block Name
              </label>
              <input
                type="text"
                value={selectedBlock.name}
                onChange={(e) => updateSelectedBlock('name', e.target.value)}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter block name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={selectedBlock.description}
                onChange={(e) => updateSelectedBlock('description', e.target.value)}
                rows={3}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Enter block description"
              />
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Block Type
                </label>
                <select
                  value={selectedBlock.type || 'COMPONENT'}
                  onChange={(e) => updateSelectedBlock('type', e.target.value)}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="COMPONENT">Component</option>
                  <option value="SUBSYSTEM">Subsystem</option>
                  <option value="FUNCTION">Function</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parent Block
                </label>
                <select
                  value={selectedBlock.parentId || ''}
                  onChange={(e) => updateBlockParent(e.target.value || null)}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">No Parent</option>
                  {modelBlocks
                    .filter(block => block.id !== selectedBlock.id) // Don't show self
                    .map(block => (
                      <option key={block.id} value={block.id}>
                        {block.name}
                      </option>
                    ))
                  }
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  X Position
                </label>
                <input
                  type="number"
                  value={Math.round(selectedBlock.x)}
                  readOnly
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Y Position
                </label>
                <input
                  type="number"
                  value={Math.round(selectedBlock.y)}
                  readOnly
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded bg-gray-50"
                />
              </div>
            </div>

            {/* Requirements Section */}
            <div className="border-t pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Linked Requirements
              </label>
              {isLoadingRequirements ? (
                <div className="text-sm text-gray-500">Loading requirements...</div>
              ) : modelRequirements.length === 0 ? (
                <div className="text-sm text-gray-500">No requirements found for this model</div>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {modelRequirements.map(requirement => {
                    const isLinked = blockRequirements.includes(requirement.id);
                    return (
                      <label key={requirement.id} className="flex items-start space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={isLinked}
                          onChange={(e) => {
                            const newRequirements = e.target.checked
                              ? [...blockRequirements, requirement.id]
                              : blockRequirements.filter(id => id !== requirement.id);
                            updateBlockRequirements(newRequirements);
                          }}
                          className="mt-0.5 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate">{requirement.title}</div>
                          {requirement.description && (
                            <div className="text-gray-500 text-xs truncate">{requirement.description}</div>
                          )}
                          <div className="flex space-x-1 mt-1">
                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${requirement.priority === 'critical' ? 'bg-red-100 text-red-800' :
                                requirement.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                                  requirement.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-green-100 text-green-800'
                              }`}>
                              {requirement.priority}
                            </span>
                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${requirement.status === 'completed' ? 'bg-green-100 text-green-800' :
                                requirement.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                  requirement.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                              }`}>
                              {requirement.status}
                            </span>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
              <div className="text-xs text-gray-500 mt-2">
                {blockRequirements.length} of {modelRequirements.length} requirements linked
              </div>
            </div>

            {/* Block Links Section */}
            {modelId && (
              <div className="border-t pt-4">
                <BlockLinks
                  modelId={modelId}
                  blockId={selectedBlock.id}
                  onLinkCreated={async () => {
                    // Refresh block link counts when a link is created
                    if (modelId) {
                      try {
                        const response = await linkService.getModelLinks(modelId);
                        const linkCounts: { [blockId: string]: number } = {};

                        response.links.forEach(link => {
                          linkCounts[link.blockId] = (linkCounts[link.blockId] || 0) + 1;
                        });

                        setBlockLinks(linkCounts);
                      } catch (error) {
                        console.error('Error refreshing block link counts:', error);
                      }
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagramEditor;
