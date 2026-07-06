import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Signup from '../features/auth/Signup';

describe('Signup Form UI', () => {
  test('renders registration inputs and submit button', () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Email$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getAllByText(/^Role$/i)[0]).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Register$/i })).toBeInTheDocument();
  });
});
