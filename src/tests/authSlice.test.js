import authReducer, { logout, clearError } from '../store/slices/authSlice';

describe('Auth Redux Slice Reducers', () => {
  const initialState = {
    user: { id: '1', name: 'John Doe', role: 'Employee' },
    token: 'token_123',
    isAuthenticated: true,
    loading: false,
    error: 'Initial Error'
  };

  test('should return initial state by default', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null
    });
  });

  test('should clear login errors', () => {
    const state = authReducer(initialState, clearError());
    expect(state.error).toBeNull();
  });

  test('should set auth variables to null on logout', () => {
    const state = authReducer(initialState, logout());
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
  });
});
