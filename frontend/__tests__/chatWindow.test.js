import React, { useState } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatWindow from '../src/app/components/chatWindow';
import { AuthContext } from '../src/app/context/AuthContext';

// scrollIntoView mock
beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
});

describe('ChatWindow component', () => {
  const mockUser = { email: 'test@example.com', token: 'mockToken' };

  const renderWithAuth = (ui) =>
    render(
      <AuthContext.Provider value={{ user: mockUser, loading: false, login: jest.fn(), logout: jest.fn() }}>
        {ui}
      </AuthContext.Provider>
    );

  it('renders welcome message initially', () => {
    renderWithAuth(
      <ChatWindow
        messages={[]}
        isTyping={false}
        newMessage=""
        setNewMessage={() => {}}
        handleSubmit={() => {}}
        selectedSubject="General Studies"
      />
    );

    expect(screen.getByText(/Welcome to BrainBytes Chat/i)).toBeInTheDocument();
    expect(screen.getByText(/Ready to explore/i)).toBeInTheDocument();
  });

  it('sends a message and receives AI reply', async () => {
    const TestWrapper = () => {
      const [messages, setMessages] = useState([]);
      const [newMessage, setNewMessage] = useState('');

      const handleSubmit = (e) => {
        e.preventDefault();
        const userMsg = {
          _id: '1',
          text: newMessage,
          isUser: true,
          createdAt: new Date().toISOString(),
        };
        const aiMsg = {
          _id: '2',
          text: 'Hello! How can I help you today?',
          isUser: false,
          createdAt: new Date().toISOString(),
        };
        setMessages([...messages, userMsg, aiMsg]);
        setNewMessage('');
      };

      return (
        <ChatWindow
          messages={messages}
          isTyping={false}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          handleSubmit={handleSubmit}
          selectedSubject="General Studies"
        />
      );
    };

    renderWithAuth(<TestWrapper />);

    const input = screen.getByPlaceholderText(/ask about/i);
    const button = screen.getByRole('button', { name: /submit/i });

    fireEvent.change(input, { target: { value: 'Hello AI!' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Hello AI!')).toBeInTheDocument();
      expect(screen.getByText('Hello! How can I help you today?')).toBeInTheDocument();
    });
  });
});
