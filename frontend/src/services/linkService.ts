import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

// Types
export interface Link {
  id: string;
  modelId: string;
  blockId: string;
  requirementId: string;
  createdAt: string;
  requirement: {
    id: string;
    title: string;
    description?: string;
    priority?: string;
    status?: string;
  };
}

export interface CreateLinkRequest {
  modelId: string;
  blockId: string;
  requirementId: string;
}

// Helper function to get auth header
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

class LinkService {
  // Create a new link between a block and requirement
  async createLink(data: CreateLinkRequest): Promise<{ message: string; link: Link }> {
    const response = await axios.post(`${API_BASE_URL}/links`, data, {
      headers: getAuthHeader()
    });
    return response.data;
  }

  // Get all links for a specific model
  async getModelLinks(modelId: string): Promise<{ message: string; links: Link[] }> {
    const response = await axios.get(`${API_BASE_URL}/links/${modelId}`, {
      headers: getAuthHeader()
    });
    return response.data;
  }

  // Get all links for a specific block
  async getBlockLinks(modelId: string, blockId: string): Promise<{ message: string; links: Link[] }> {
    const response = await axios.get(`${API_BASE_URL}/links/block/${modelId}/${blockId}`, {
      headers: getAuthHeader()
    });
    return response.data;
  }

  // Delete a specific link
  async deleteLink(linkId: string): Promise<{ message: string }> {
    const response = await axios.delete(`${API_BASE_URL}/links/${linkId}`, {
      headers: getAuthHeader()
    });
    return response.data;
  }
}

export const linkService = new LinkService();
