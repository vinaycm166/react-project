import apiClient from './apiClient';

export const authService = {
  register: async (name, email, username, password, role) => {
    const response = await apiClient.post('/auth/register', { name, email, username, password, role });
    return response.data;
  },
  login: async (username, password) => {
    const response = await apiClient.post('/auth/login', { username, password });
    return response.data;
  },
  forgotPassword: async (email) => {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
  },
  resetPassword: async (token, password) => {
    const response = await apiClient.post('/auth/reset-password', { token, password });
    return response.data;
  }
};
