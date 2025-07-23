// Refactored page.js (Dashboard) with full layout restored
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
    setMessages([]);
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
      <header className="bg-white/95 backdrop-blur-sm shadow-lg border-b-4 border-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="bg-slate-700 rounded-full p-3 shadow-lg">
                <div className="text-2xl text-white">🧠</div>
              </div>
              <h1 className="text-3xl font-bold text-slate-700 tracking-wide">BrainBytes</h1>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="text-sm text-gray-600 font-medium">Chat Portal</p>
                <p className="text-slate-700 font-semibold">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-88px)]">
        {/* Sidebar */}
        <div className="w-80 bg-white/95 backdrop-blur-sm shadow-xl border-r border-gray-200">
          <div className="p-6">
            <button
              onClick={handleNewChat}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mb-6"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>New Chat</span>
            </button>

            <label className="block text-sm font-bold text-gray-700 mb-3 tracking-wide">
              Academic Department:
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-600 focus:border-slate-600 outline-none font-medium bg-white mb-6"
            >
              <option value="General">General Studies</option>
              <option value="Math">Mathematics</option>
              <option value="Science">Natural Sciences</option>
              <option value="History">History & Social Studies</option>
              <option value="English">English Literature</option>
              <option value="Programming">Computer Science</option>
              <option value="Philosophy">Philosophy</option>
              <option value="Economics">Economics</option>
            </select>

            <h3 className="text-sm font-bold text-gray-700 mb-3 tracking-wide">Chat Sessions:</h3>
            <div className="space-y-2">
              {chatSessions.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p className="text-sm font-medium">No chats yet</p>
                  <p className="text-xs">Start by asking a question below</p>
                </div>
              ) : (
                chatSessions.map((session) => (
                  <div key={session.id} className={`relative group rounded-lg transition-all duration-200 ${session.active ? 'bg-slate-700 text-white shadow-md' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>
                    <div className="p-3 cursor-pointer flex items-center justify-between" onClick={() => handleChatSwitch(session.id)}>
                      {editingSession === session.id ? (
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onBlur={() => handleRenameChat(session.id, editingName)}
                          onKeyPress={(e) => e.key === 'Enter' && handleRenameChat(session.id, editingName)}
                          className="bg-transparent border-b border-white text-sm font-medium outline-none flex-1 mr-2"
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <div className="font-medium text-sm flex-1">{session.name}</div>
                      )}
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDropdown(activeDropdown === session.id ? null : session.id);
                          }}
                          className={`p-1 rounded hover:bg-opacity-20 hover:bg-white transition-all duration-200 ${session.active ? 'text-white' : 'text-gray-500'}`}
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>
                        {activeDropdown === session.id && (
                          <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-24">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                startEditing(session);
                              }}
                              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg"
                            >
                              Rename
                            </button>
                            {chatSessions.length > 1 && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteChat(session.id);
                                }}
                                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-lg"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
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
    </div>
  );
}
