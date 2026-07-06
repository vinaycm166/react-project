import apiClient from './apiClient';

export const vendorService = {
  getAll: async () => {
    const response = await apiClient.get('/vendors');
    return response.data;
  },
  getById: async (id) => {
    const response = await apiClient.get(`/vendors/${id}`);
    return response.data;
  },
  uploadDocument: async (id, docData) => {
    const response = await apiClient.post(`/vendors/${id}/documents`, docData);
    return response.data;
  }
};
