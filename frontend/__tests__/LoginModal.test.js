import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginModal from '../src/app/components/loginModal.js';
import { AuthContext } from '../src/app/context/AuthContext.js';


describe('LoginModal', () => {
  const mockLogin = jest.fn();
  const mockOnClose = jest.fn();

  const setup = (isOpen = true) => {
    render(
      <AuthContext.Provider value={{ login: mockLogin }}>
        <LoginModal isOpen={isOpen} onClose={mockOnClose} />
      </AuthContext.Provider>
    );
  };

  it('should not render if isOpen is false', () => {
    setup(false);
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
  });

  it('renders email and password inputs and buttons when open', () => {
    setup(true);
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument();

  });

  it('calls onClose when cancel button is clicked', () => {
    setup(true);
    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('fills in email and password', () => {
    setup(true);

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });

    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('password123')).toBeInTheDocument();
  });
});
