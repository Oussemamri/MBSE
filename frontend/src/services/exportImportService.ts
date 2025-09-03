import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

// Types
export interface ExportData {
  metadata: {
    exportVersion: string;
    exportedAt: string;
    exportedBy?: string;
    modelId: string;
    modelName: string;
    modelDescription?: string;
    originalAuthor: string;
    createdAt: string;
    updatedAt: string;
  };
  diagram: {
    name: string;
    description?: string;
    diagramData: any;
  };
  requirements: any[];
  links: any[];
}

export interface ImportRequest {
  modelName: string;
  importData: ExportData;
}

// Helper function to get auth header
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

class ExportImportService {
  // Export model as JSON
  async exportModelJson(modelId: string): Promise<Blob> {
    const response = await axios.get(`${API_BASE_URL}/export/json/${modelId}`, {
      headers: getAuthHeader(),
      responseType: 'blob'
    });
    return response.data;
  }

  // Export model as XMI
  async exportModelXmi(modelId: string): Promise<Blob> {
    const response = await axios.get(`${API_BASE_URL}/export/xmi/${modelId}`, {
      headers: getAuthHeader(),
      responseType: 'blob'
    });
    return response.data;
  }

  // Import model from JSON
  async importModelJson(data: ImportRequest): Promise<{ message: string; model: any }> {
    const response = await axios.post(`${API_BASE_URL}/import/json`, data, {
      headers: getAuthHeader()
    });
    return response.data;
  }

  // Helper function to download blob as file
  downloadFile(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  // Helper function to read file as JSON
  readFileAsJson(file: File): Promise<ExportData> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          resolve(json);
        } catch (error) {
          reject(new Error('Invalid JSON file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }
}

export const exportImportService = new ExportImportService();
