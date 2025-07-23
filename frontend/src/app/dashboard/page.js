// Refactored page.js (Dashboard)
'use client';

import { useState, useEffect, useContext, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import ChatWindow from '../components/chatWindow';

export default function Dashboard() {
  const [selectedSubject, setSelectedSubject] = useState('General');
  const [chatSessions, setChatSessions] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [editingSession, setEditingSession] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messageEndRef = useRef(null);

  const { user, logout, loading: authLoading } = useContext(AuthContext);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }
    setChatSessions([]);
    setActiveChatId(null);
    setActiveDropdown(null);
    setEditingSession(null);
    setEditingName('');
    setMessages([]);
    setNewMessage('');
    setIsTyping(false);
    setLoading(false);
  }, [user, authLoading, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleNewChat = () => {
    const newChatId = Date.now();
    setChatSessions(prev => [
      ...prev.map(chat => ({ ...chat, active: false })),
      { id: newChatId, name: `Chat ${prev.length + 1}`, active: true }
    ]);
    setMessages([]);
    setActiveChatId(newChatId);
  };

  const handleChatSwitch = (chatId) => {
    setChatSessions(prev => prev.map(chat => ({ 
      ...chat, 
      active: chat.id === chatId 
    })));
    setActiveChatId(chatId);
    setMessages([]); // Clear messages when switching
    setNewMessage('');
    setActiveDropdown(null);
  };

  const handleRenameChat = (chatId, newName) => {
    setChatSessions(prev => prev.map(chat => 
      chat.id === chatId ? { ...chat, name: newName } : chat
    ));
    setEditingSession(null);
    setEditingName('');
  };

  const handleDeleteChat = (chatId) => {
    if (chatSessions.length === 1) return;
    setChatSessions(prev => {
      const filtered = prev.filter(chat => chat.id !== chatId);
      if (chatId === activeChatId && filtered.length > 0) {
        filtered[0].active = true;
        setActiveChatId(filtered[0].id);
        setMessages([]);
      }
      return filtered;
    });
    setActiveDropdown(null);
  };

  const startEditing = (session) => {
    setEditingSession(session.id);
    setEditingName(session.name);
    setActiveDropdown(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMessage = {
      _id: Date.now(),
      text: newMessage,
      isUser: true,
      subject: selectedSubject,
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    try {
      const response = await axios.post('/api/messages', {
        text: userMessage.text,
        subject: selectedSubject
      });

      const aiMessage = {
        ...response.data,
        isUser: false,
        createdAt: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error('Failed to get AI response:', err);
    } finally {
      setIsTyping(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900">
      {/* ...header and sidebar remain unchanged... */}
      <ChatWindow
        subject={selectedSubject}
        activeChatId={activeChatId}
        messages={messages}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleSubmit={handleSubmit}
        isTyping={isTyping}
        messageEndRef={messageEndRef}
      />
    </div>
  );
}
