import apiClient from './apiClient';

export const procurementService = {
  getAll: async () => {
    const response = await apiClient.get('/procurement');
    return response.data;
  },
  getById: async (id) => {
    const response = await apiClient.get(`/procurement/${id}`);
    return response.data;
  },
  create: async (requestData) => {
    const response = await apiClient.post('/procurement', requestData);
    return response.data;
  },
  updateStatus: async (id, status, action, comment) => {
    const response = await apiClient.put(`/procurement/${id}`, { status, action, comment });
    return response.data;
  },
  addComment: async (id, comment) => {
    const response = await apiClient.post(`/procurement/${id}/comments`, { comment });
    return response.data;
  }
};
