// Refactored chatWindow.js
import React, { useEffect } from 'react';

export default function ChatWindow({
  messages = [],
  isTyping = false,
  newMessage = '',
  setNewMessage = () => {},
  handleSubmit = () => {},
  messageEndRef = { current: null },
  subject = 'General Studies',
}) {
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="flex-1 flex flex-col bg-white/90 backdrop-blur-sm">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-slate-700 rounded-full p-6 mx-auto w-20 h-20 flex items-center justify-center shadow-lg mb-6">
              <div className="text-3xl text-white">🧠</div>
            </div>
            <h3 className="text-2xl font-bold text-slate-700 mb-4">
              Welcome to BrainBytes Chat
            </h3>
            <div className="h-0.5 w-24 bg-slate-400 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">
              Ready to explore <span className="font-semibold text-slate-700">{subject}</span>?
            </p>
            <p className="text-gray-500 mt-2">
              Ask any question to start your first chat session.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message._id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
              <div className="flex items-start space-x-3 max-w-2xl">
                {!message.isUser && (
                  <div className="bg-red-900 rounded-full p-2 shadow-md">
                    <div className="text-white text-sm">🎓</div>
                  </div>
                )}
                <div className={`px-6 py-4 rounded-2xl shadow-lg ${message.isUser ? 'bg-red-900 text-white rounded-br-md border-l-4 border-yellow-400' : 'bg-white text-gray-900 rounded-bl-md border-l-4 border-red-900'}`}>
                  <div className="whitespace-pre-wrap font-medium leading-relaxed">
                    {message.text}
                  </div>
                  <div className={`text-xs mt-3 flex items-center space-x-2 ${message.isUser ? 'text-red-100' : 'text-gray-500'}`}>
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
                    <div className="w-2 h-2 bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
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
            placeholder={`Ask about ${subject.toLowerCase()}...`}
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
  );
}
