import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

// Types
export interface ModelShare {
  id: string;
  permission: 'view' | 'edit';
  createdAt: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
  model?: {
    id: string;
    name: string;
    description?: string;
  };
}

export interface SharedModel {
  id: string;
  permission: 'view' | 'edit';
  sharedAt: string;
  model: {
    id: string;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
    user: {
      id: string;
      email: string;
      name?: string;
    };
  };
}

export interface ShareModelRequest {
  modelId: string;
  email: string;
  permission: 'view' | 'edit';
}

// Helper function to get auth header
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

class ShareService {
  // Share a model with another user by email
  async shareModel(data: ShareModelRequest): Promise<{ message: string; share: ModelShare }> {
    const response = await axios.post(`${API_BASE_URL}/share`, data, {
      headers: getAuthHeader()
    });
    return response.data;
  }

  // Get models shared with the current user
  async getSharedModels(): Promise<{ message: string; sharedModels: SharedModel[] }> {
    const response = await axios.get(`${API_BASE_URL}/share/shared`, {
      headers: getAuthHeader()
    });
    return response.data;
  }

  // Get all shares for a specific model (owner only)
  async getModelShares(modelId: string): Promise<{ message: string; shares: ModelShare[] }> {
    const response = await axios.get(`${API_BASE_URL}/share/shares/${modelId}`, {
      headers: getAuthHeader()
    });
    return response.data;
  }

  // Remove a share (owner only)
  async removeShare(shareId: string): Promise<{ message: string }> {
    const response = await axios.delete(`${API_BASE_URL}/share/shares/${shareId}`, {
      headers: getAuthHeader()
    });
    return response.data;
  }
}

export const shareService = new ShareService();
