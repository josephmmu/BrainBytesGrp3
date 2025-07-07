import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../page'; // Adjust the import path if needed
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

jest.mock('axios');
jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn(),
  AuthContext: {
    Provider: ({ children }) => <div>{children}</div>
  }
}));

jest.mock('../components/loginModal', () => ({ isOpen, onClose }) => (
  isOpen ? <div data-testid="login-modal">Login Modal</div> : null
));

describe('Home component', () => {
  beforeEach(() => {
    useAuth.mockReturnValue({
      user: { email: 'test@example.com', token: 'fake-jwt-token' },
      logout: jest.fn()
    });

    axios.get.mockResolvedValue({ data: [] });
    axios.post.mockResolvedValue({
      data: {
        userMessage: {
          _id: '1',
          text: 'Test message',
          isUser: true,
          createdAt: new Date().toISOString()
        },
        aiMessage: {
          _id: '2',
          text: 'AI reply',
          isUser: false,
          createdAt: new Date().toISOString()
        }
      }
    });
  });

  it('renders welcome message when no messages exist', async () => {
    render(<Home />);
    expect(screen.getByText('BrainBytes AI Tutor')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('Welcome to BrainBytes AI Tutor!')).toBeInTheDocument();
    });
  });

  it('sends a message and receives an AI reply', async () => {
    render(<Home />);

    const input = screen.getByPlaceholderText('Ask a question...');
    fireEvent.change(input, { target: { value: 'What is 2+2?' } });

    const sendButton = screen.getByRole('button', { name: /send/i });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText('Test message')).toBeInTheDocument();
      expect(screen.getByText('AI reply')).toBeInTheDocument();
    });
  });
});
