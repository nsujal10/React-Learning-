import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../features/auth/ProtectedRoute';
import { AuthProvider } from '../features/auth/AuthContext';
import Login from '../pages/Login';
import { ToastProvider } from '../components/Toast';

describe('Auth & Protected Routes', () => {
  it('renders login page with credentials form', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <AuthProvider>
          <ToastProvider>
            <Login />
          </ToastProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/work email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('allows access to protected route content when authenticated', () => {
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <AuthProvider>
          <Routes>
            <Route
              path="/protected"
              element={
                <ProtectedRoute>
                  <div>Secret Protected Dashboard</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    // Initial AuthProvider state is authenticated by default
    expect(screen.getByText('Secret Protected Dashboard')).toBeInTheDocument();
  });
});
