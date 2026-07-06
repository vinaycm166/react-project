import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import Login from '../features/auth/Login';

const createMockStore = (state) => ({
  getState: () => state,
  subscribe: () => jest.fn(),
  dispatch: jest.fn()
});

describe('Login Form UI', () => {
  let store;

  beforeEach(() => {
    store = createMockStore({
      auth: {
        loading: false,
        error: null,
        user: null,
        token: null,
        isAuthenticated: false
      }
    });
  });

  test('renders form input labels and redirect buttons', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByText("Sign Up")).toBeInTheDocument();
  });
});
