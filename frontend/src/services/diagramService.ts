import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Create axios instance with auth header
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth header to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Types
export interface Diagram {
  id: string;
  name: string;
  type: 'BDD' | 'IBD';
  modelId: string;
  diagramData?: any; // JointJS diagram JSON
  createdAt: string;
  updatedAt: string;
  diagramBlocks: DiagramBlock[];
}

export interface DiagramBlock {
  id: string;
  diagramId: string;
  blockId: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  block: {
    id: string;
    name: string;
    description?: string;
    type: string;
    parentId?: string;
    parent?: any;
    children?: any[];
  };
}

export interface CreateDiagramData {
  name: string;
  type: 'BDD' | 'IBD';
  modelId: string;
}

export interface UpdateDiagramData {
  name?: string;
  type?: 'BDD' | 'IBD';
}

// Diagram service
export const diagramService = {
  // Create new diagram
  async createDiagram(data: CreateDiagramData): Promise<Diagram> {
    const response = await apiClient.post('/diagrams', data);
    return response.data;
  },

  // Get diagrams for a model
  async getModelDiagrams(modelId: string): Promise<Diagram[]> {
    const response = await apiClient.get(`/diagrams/${modelId}`);
    return response.data;
  },

  // Get diagram details
  async getDiagramDetails(diagramId: string): Promise<Diagram> {
    const response = await apiClient.get(`/diagrams/detail/${diagramId}`);
    return response.data;
  },

  // Update diagram
  async updateDiagram(diagramId: string, data: UpdateDiagramData): Promise<Diagram> {
    const response = await apiClient.put(`/diagrams/${diagramId}`, data);
    return response.data;
  },

  // Delete diagram
  async deleteDiagram(diagramId: string): Promise<void> {
    await apiClient.delete(`/diagrams/${diagramId}`);
  },

  // Add block to diagram
  async addBlockToDiagram(diagramId: string, blockId: string, position: { x: number; y: number; width?: number; height?: number }): Promise<DiagramBlock> {
    const response = await apiClient.post(`/diagrams/${diagramId}/blocks/${blockId}`, position);
    return response.data;
  },

  // Remove block from diagram
  async removeBlockFromDiagram(diagramId: string, blockId: string): Promise<void> {
    await apiClient.delete(`/diagrams/${diagramId}/blocks/${blockId}`);
  },

  // Update block position in diagram
  async updateBlockPosition(diagramId: string, blockId: string, position: { x: number; y: number; width?: number; height?: number }): Promise<DiagramBlock> {
    const response = await apiClient.post(`/diagrams/${diagramId}/blocks/${blockId}`, position);
    return response.data;
  }
};

export default diagramService;
