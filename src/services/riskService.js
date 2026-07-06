import apiClient from './apiClient';

export const riskService = {
  getRiskData: async () => {
    const response = await apiClient.get('/risk');
    return response.data;
  }
};
