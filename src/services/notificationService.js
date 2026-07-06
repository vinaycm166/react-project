import apiClient from './apiClient';

export const notificationService = {
  getAll: async () => {
    const response = await apiClient.get('/notifications');
    return response.data;
  },
  markAsRead: async (id) => {
    const response = await apiClient.put(`/notifications/${id}/read`);
    return response.data;
  }
};
