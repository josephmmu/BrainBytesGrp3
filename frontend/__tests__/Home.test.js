import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Home from '../src/app/page';
import { AuthContext } from '../src/app/context/AuthContext';

// Mock useRouter from next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe('Home component (redirect logic)', () => {
  const renderWithAuth = (authValues) => {
    render(
      <AuthContext.Provider value={authValues}>
        <Home />
      </AuthContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays redirect spinner while loading is true', () => {
    renderWithAuth({ user: null, loading: true });
    expect(screen.getByText(/redirecting/i)).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('redirects to /dashboard if user is authenticated and loading is false', async () => {
    renderWithAuth({ user: { email: 'test@example.com' }, loading: false });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });

    expect(screen.getByText(/redirecting/i)).toBeInTheDocument();
  });

  it('redirects to /login if user is not authenticated and loading is false', async () => {
    renderWithAuth({ user: null, loading: false });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login');
    });

    expect(screen.getByText(/redirecting/i)).toBeInTheDocument();
  });
});
