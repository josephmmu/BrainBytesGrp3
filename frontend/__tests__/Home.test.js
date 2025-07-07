import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import Home from '../src/app/page.js';

// Mock axios
jest.mock('axios');

// Mock AuthContext and useAuth
jest.mock('../src/app/context/AuthContext.js', () => {
  const actual = jest.requireActual('react');
  return {
    __esModule: true,
    useAuth: () => ({
      user: { email: 'test@example.com', token: 'mockToken' },
    }),
    AuthContext: {
      Provider: ({ children }) => <div>{children}</div>,
    },
  };
});

// Mock useContext to return logout
jest.spyOn(React, 'useContext').mockImplementation((context) => {
  if (context?.Provider) {
    return {
      logout: jest.fn(),
      login: jest.fn(),
    };
  }
  return undefined;
});

describe('Home component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem('token', 'mockToken');
  });

  it('renders welcome message when no messages exist', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    render(<Home />);
    
    expect(await screen.findByText(/Welcome to BrainBytes AI Tutor/i)).toBeInTheDocument();
  });

  it('sends a message and receives an AI reply', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    axios.post.mockResolvedValueOnce({
      data: {
        userMessage: {
          _id: '1',
          text: 'Hi',
          isUser: true,
          createdAt: new Date().toISOString()
        },
        aiMessage: {
          _id: '2',
          text: 'Hello from AI!',
          isUser: false,
          createdAt: new Date().toISOString()
        }
      }
    });

    render(<Home />);
    
    const input = screen.getByPlaceholderText(/ask a question/i);
    fireEvent.change(input, { target: { value: 'Hi' } });

    const sendButton = screen.getByText(/send/i);
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText(/hello from AI!/i)).toBeInTheDocument();
    });
  });
});
