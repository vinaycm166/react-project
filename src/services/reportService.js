import apiClient from './apiClient';

export const reportService = {
  getSavedReports: async () => {
    const response = await apiClient.get('/reports');
    return response.data;
  }
};
