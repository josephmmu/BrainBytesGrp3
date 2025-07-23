'use client';

import { useState, useEffect, useRef, useContext } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import API_BASE_URL from '../../config/api.js';

export default function Dashboard() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('General');
  const [chatSessions, setChatSessions] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [editingSession, setEditingSession] = useState(null);
  const [editingName, setEditingName] = useState('');
  const messageEndRef = useRef(null);
  const { user, logout, loading: authLoading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    // Don't redirect during auth loading to avoid hydration issues
    if (authLoading) return;
    
    if (!user) {
      router.push('/login');
      return;
    }
    fetchMessages();
  }, [user, authLoading, router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching messages:', error);
      if (error.response?.status === 401) {
        logout();
        router.push('/login');
      }
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const token = localStorage.getItem('token');
      setIsTyping(true);
      const userMsg = newMessage;
      setNewMessage('');

      // Create first chat session if none exist
      if (chatSessions.length === 0) {
        const newChatId = Date.now();
        const newSession = { id: newChatId, name: 'Chat 1', active: true };
        setChatSessions([newSession]);
        setActiveChatId(newChatId);
      }

      // Optimistically add user message
      const tempUserMsg = {
        _id: Date.now().toString(),
        text: userMsg,
        isUser: true,
        createdAt: new Date().toISOString(),
        subject: selectedSubject
      };
      setMessages(prev => [...prev, tempUserMsg]);

      const response = await axios.post(
        `${API_BASE_URL}/api/messages`,
        { text: userMsg, subject: selectedSubject },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Remove temp message and add real messages
      setMessages(prev => {
        const withoutTemp = prev.filter(msg => msg._id !== tempUserMsg._id);
        return [...withoutTemp, response.data.userMessage, response.data.aiMessage];
      });

      setIsTyping(false);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
      if (error.response?.status === 401) {
        logout();
        router.push('/login');
      }
    }
  };

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
    setActiveChatId(newChatId);
    setMessages([]);
  };

  const handleChatSwitch = (chatId) => {
    setChatSessions(prev => prev.map(chat => ({ 
      ...chat, 
      active: chat.id === chatId 
    })));
    setActiveChatId(chatId);
    // In a real app, you'd fetch messages for this chat
    setMessages([]);
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
    if (chatSessions.length === 1) return; // Don't delete the last chat
    
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
      {/* Header - matching login page style */}
      <header className="bg-white/95 backdrop-blur-sm shadow-lg border-b-4 border-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="bg-slate-700 rounded-full p-3 shadow-lg">
                <div className="text-2xl text-white">🧠</div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-700 tracking-wide">BrainBytes</h1>
              </div>
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

            {/* Subject Selector */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-3 tracking-wide">
                Academic Department:
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-600 focus:border-slate-600 outline-none font-medium bg-white"
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
            </div>

            {/* Chat Sessions */}
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-3 tracking-wide">Chat Sessions:</h3>
              <div className="space-y-2">
                {chatSessions.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-2">
                      <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-500 font-medium">No chats yet</p>
                    <p className="text-xs text-gray-400">Start by asking a question below</p>
                  </div>
                ) : (
                  chatSessions.map((session) => (
                  <div
                    key={session.id}
                    className={`relative group rounded-lg transition-all duration-200 ${
                      session.active 
                        ? 'bg-slate-700 text-white shadow-md' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    <div 
                      className="p-3 cursor-pointer flex items-center justify-between"
                      onClick={() => handleChatSwitch(session.id)}
                    >
                      {editingSession === session.id ? (
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onBlur={() => handleRenameChat(session.id, editingName)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleRenameChat(session.id, editingName);
                            }
                          }}
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
                          className={`p-1 rounded hover:bg-opacity-20 hover:bg-white transition-all duration-200 ${
                            session.active ? 'text-white' : 'text-gray-500'
                          }`}
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
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-white/90 backdrop-blur-sm">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-red-900 rounded-full p-6 mx-auto w-20 h-20 flex items-center justify-center shadow-lg mb-6">
                  <div className="text-3xl text-white">📚</div>
                </div>
                <h3 className="text-2xl font-bold text-red-900 mb-4">
                  Welcome to Your Chat Session
                </h3>
                <div className="h-0.5 w-24 bg-yellow-400 mx-auto mb-4"></div>
                <p className="text-gray-600 text-lg">
                  Ready to explore <span className="font-semibold text-red-900">{selectedSubject}</span>?
                </p>
                <p className="text-gray-500 mt-2">
                  Ask any question and I'll provide scholarly guidance and insights.
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message._id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="flex items-start space-x-3 max-w-2xl">
                    {!message.isUser && (
                      <div className="bg-red-900 rounded-full p-2 shadow-md">
                        <div className="text-white text-sm">🎓</div>
                      </div>
                    )}
                    <div
                      className={`px-6 py-4 rounded-2xl shadow-lg ${
                        message.isUser
                          ? 'bg-red-900 text-white rounded-br-md border-l-4 border-yellow-400'
                          : 'bg-white text-gray-900 rounded-bl-md border-l-4 border-red-900'
                      }`}
                    >
                      <div className="whitespace-pre-wrap font-medium leading-relaxed">{message.text}</div>
                      <div className={`text-xs mt-3 flex items-center space-x-2 ${
                        message.isUser ? 'text-red-100' : 'text-gray-500'
                      }`}>
                        <span>{new Date(message.createdAt).toLocaleTimeString()}</span>
                        {message.subject && (
                          <>
                            <span>•</span>
                            <span className="font-semibold">{message.subject}</span>
                          </>
                        )}
                      </div>
                    </div>
                    {message.isUser && (
                      <div className="bg-gray-200 rounded-full p-2 shadow-md">
                        <div className="text-gray-600 text-sm">👤</div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3 max-w-2xl">
                  <div className="bg-red-900 rounded-full p-2 shadow-md">
                    <div className="text-white text-sm">🎓</div>
                  </div>
                  <div className="bg-white text-gray-900 px-6 py-4 rounded-2xl rounded-bl-md border-l-4 border-red-900 shadow-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-red-900 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-slate-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-slate-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                      <span className="text-sm text-gray-600 font-medium">AI is analyzing your question...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messageEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t-2 border-slate-600 bg-gradient-to-r from-slate-50 to-gray-50 p-6">
            <form onSubmit={handleSubmit} className="flex space-x-4">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`Ask about ${selectedSubject.toLowerCase()}... (e.g., "Explain quantum mechanics" or "What is calculus?")`}
                className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-slate-600 focus:border-slate-600 outline-none font-medium text-gray-800 bg-white shadow-lg"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={isTyping || !newMessage.trim()}
                className="bg-slate-700 hover:bg-slate-600 disabled:bg-slate-400 text-white px-8 py-4 rounded-xl font-bold transition-all duration-200 flex items-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {isTyping ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    <span>Submit</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}