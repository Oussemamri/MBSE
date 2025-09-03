import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

export interface Requirement {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  userId: string;
  modelId?: string;
  model?: {
    id: string;
    name: string;
  };
}

export interface CreateRequirementData {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status?: 'open' | 'in_progress' | 'completed' | 'cancelled';
  modelId?: string;
}

export interface UpdateRequirementData {
  title?: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  status?: 'open' | 'in_progress' | 'completed' | 'cancelled';
  modelId?: string;
}

class RequirementService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async getRequirements(): Promise<Requirement[]> {
    const response = await axios.get(
      `${API_BASE_URL}/requirements`,
      { headers: this.getAuthHeaders() }
    );
    return response.data.requirements;
  }

  async createRequirement(data: CreateRequirementData): Promise<Requirement> {
    const response = await axios.post(
      `${API_BASE_URL}/requirements`,
      data,
      { headers: this.getAuthHeaders() }
    );
    return response.data.requirement;
  }

  async updateRequirement(id: string, data: UpdateRequirementData): Promise<Requirement> {
    const response = await axios.put(
      `${API_BASE_URL}/requirements/${id}`,
      data,
      { headers: this.getAuthHeaders() }
    );
    return response.data.requirement;
  }

  async deleteRequirement(id: string): Promise<void> {
    await axios.delete(
      `${API_BASE_URL}/requirements/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }

  async getModelRequirements(modelId: string): Promise<Requirement[]> {
    const response = await axios.get(
      `${API_BASE_URL}/requirements/model/${modelId}`,
      { headers: this.getAuthHeaders() }
    );
    return response.data.requirements;
  }

  async getTraceabilityMatrix(modelId: string): Promise<TraceabilityMatrix> {
    const response = await axios.get(
      `${API_BASE_URL}/requirements/traceability/${modelId}`,
      { headers: this.getAuthHeaders() }
    );
    return response.data;
  }

  async linkRequirementToBlocks(requirementId: string, blockIds: string[], modelId: string): Promise<void> {
    await axios.post(
      `${API_BASE_URL}/requirements/${requirementId}/link`,
      { blockIds, modelId },
      { headers: this.getAuthHeaders() }
    );
  }

  async unlinkRequirementFromBlock(requirementId: string, blockId: string): Promise<void> {
    await axios.delete(
      `${API_BASE_URL}/requirements/${requirementId}/link/${blockId}`,
      { headers: this.getAuthHeaders() }
    );
  }
}

export interface TraceabilityMatrix {
  requirements: Requirement[];
  blocks: Array<{
    id: string;
    name: string;
    type: string;
    linkedRequirements: string[];
  }>;
  links: Array<{
    requirementId: string;
    blockId: string;
  }>;
  matrix: {
    requirements: Array<Requirement & { linkedBlocks: string[] }>;
    blocks: Array<{
      id: string;
      name: string;
      type: string;
      linkedRequirements: string[];
    }>;
  };
}

export const requirementService = new RequirementService();
