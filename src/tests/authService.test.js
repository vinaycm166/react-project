import { authService } from '../services/authService';
import apiClient from '../services/apiClient';

jest.mock('../services/apiClient');

describe('Auth Services Layer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return login session variables on api success', async () => {
    const mockUser = { id: 'USR001', name: 'John Doe', role: 'Employee' };
    apiClient.post.mockResolvedValue({
      data: { user: mockUser, token: 'token_mock_123' }
    });

    const result = await authService.login('employee', 'password');
    expect(apiClient.post).toHaveBeenCalledWith('/auth/login', { username: 'employee', password: 'password' });
    expect(result.user.name).toBe('John Doe');
    expect(result.token).toBe('token_mock_123');
  });

  test('should trigger link delivery on password request', async () => {
    apiClient.post.mockResolvedValue({
      data: { message: 'Reset email delivered' }
    });

    const result = await authService.forgotPassword('john@test.com');
    expect(apiClient.post).toHaveBeenCalledWith('/auth/forgot-password', { email: 'john@test.com' });
    expect(result.message).toBe('Reset email delivered');
  });
});
