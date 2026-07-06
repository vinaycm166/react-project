import apiClient from './apiClient';

export const auditService = {
  getLogs: async () => {
    const response = await apiClient.get('/audit');
    return response.data;
  }
};
