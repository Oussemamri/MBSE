import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

export interface Model {
  id: string;
  name: string;
  diagramData: any;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface CreateModelData {
  name: string;
  diagramData: any;
}

export interface UpdateModelData {
  name?: string;
  diagramData?: any;
}

class ModelService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async createModel(data: CreateModelData): Promise<Model> {
    const response = await axios.post(
      `${API_BASE_URL}/models`,
      data,
      { headers: this.getAuthHeaders() }
    );
    // API returns {message, model}, so we extract the model
    return response.data.model;
  }

  async getModel(id: string): Promise<Model> {
    const response = await axios.get(
      `${API_BASE_URL}/models/${id}`,
      { headers: this.getAuthHeaders() }
    );
    // API returns { model }, so we extract the model
    return response.data.model;
  }

  async updateModel(id: string, data: UpdateModelData): Promise<Model> {
    const response = await axios.put(
      `${API_BASE_URL}/models/${id}`,
      data,
      { headers: this.getAuthHeaders() }
    );
    return response.data;
  }

  async deleteModel(id: string): Promise<void> {
    await axios.delete(
      `${API_BASE_URL}/models/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }

  async getMyModels(): Promise<Model[]> {
    const response = await axios.get(
      `${API_BASE_URL}/models`,
      { headers: this.getAuthHeaders() }
    );
    // API returns { models }, so we extract the models array
    return response.data.models;
  }
}

export const modelService = new ModelService();
