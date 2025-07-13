import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../src/app/page';
import { AuthContext } from '../src/app/context/AuthContext';
import axios from 'axios';

// Mock scrollIntoView to prevent crash
beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
});

// Mock localStorage
beforeEach(() => {
  const localStorageMock = (() => {
    let store = {};
    return {
      getItem: jest.fn((key) => store[key] || null),
      setItem: jest.fn((key, value) => { store[key] = value.toString(); }),
      removeItem: jest.fn((key) => { delete store[key]; }),
      clear: jest.fn(() => { store = {}; }),
    };
  })();
  Object.defineProperty(window, 'localStorage', { value: localStorageMock });
});

// Mock axios
jest.mock('axios');

describe('Home component', () => {
  const mockUser = { email: 'test@example.com', token: 'mockToken' };
  const mockLogout = jest.fn();
  const mockLogin = jest.fn();

  const renderWithAuth = () =>
    render(
      <AuthContext.Provider value={{ user: mockUser, login: mockLogin, logout: mockLogout }}>
        <Home />
      </AuthContext.Provider>
    );

  it('renders welcome message when no messages exist', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    window.localStorage.getItem.mockReturnValue('mockToken');

    renderWithAuth();

    expect(await screen.findByText(/Welcome to BrainBytes AI Tutor!/)).toBeInTheDocument();
    expect(screen.getByText(/Ask me any question/i)).toBeInTheDocument();
  });

  it('sends a message and receives an AI reply', async () => {
    // Mock initial empty messages
    axios.get.mockResolvedValueOnce({ data: [] });

    // Mock message post
    axios.post.mockResolvedValueOnce({
      data: {
        userMessage: {
          _id: '1',
          text: 'Hello',
          isUser: true,
          createdAt: new Date().toISOString(),
        },
        aiMessage: {
          _id: '2',
          text: 'Hi there! How can I help?',
          isUser: false,
          createdAt: new Date().toISOString(),
        },
      },
    });

    window.localStorage.getItem.mockReturnValue('mockToken');

    renderWithAuth();

    const input = await screen.findByPlaceholderText(/ask a question/i);
    const button = screen.getByRole('button', { name: /send/i });

    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Hello')).toBeInTheDocument();
      expect(screen.getByText('Hi there! How can I help?')).toBeInTheDocument();
    });
  });
});
