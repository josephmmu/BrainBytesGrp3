'use client';

import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import API_BASE_URL from '../../config/api.js';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Login
        const res = await axios.post(`${API_BASE_URL}/api/login`, {
          email,
          password
        });
        const token = res.data.token;
        login(token);
        router.push('/dashboard');
      } else {
        // Register
        await axios.post(`${API_BASE_URL}/api/register`, {
          email,
          password
        });
        // Auto login after registration
        const loginRes = await axios.post(`${API_BASE_URL}/api/login`, {
          email,
          password
        });
        const token = loginRes.data.token;
        login(token);
        router.push('/dashboard');
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Invalid credentials or account not registered.');
      } else {
        setError('Network error. Please check your connection and try again.');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 flex items-center justify-center p-4">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header - UNIVERSITAS MAGISTRORUM removed */}
        <div className="text-center">
          <div className="bg-white rounded-full p-6 mx-auto w-24 h-24 flex items-center justify-center shadow-lg mb-6">
            <div className="text-3xl font-bold text-slate-700">🧠</div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-wide">BrainBytes</h1>
          <div className="h-0.5 w-24 bg-slate-400 mx-auto mb-4"></div>
          <p className="text-slate-200 text-sm">Your AI-Powered Learning Companion</p>
        </div>
        
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl p-8 border border-white/20">
          {/* NO Sign In/Register tabs - removed as requested */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2 tracking-wide">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-600 focus:border-slate-600 outline-none transition-all duration-200 font-medium"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2 tracking-wide">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-600 focus:border-slate-600 outline-none transition-all duration-200 font-medium"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-700 hover:bg-slate-600 disabled:bg-slate-400 text-white font-bold py-4 px-4 rounded-lg transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isLogin ? 'Signing in...' : 'Creating Account...'}
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {/* Changed "Enter Academy" to "Sign In" and "Apply for application" to "Register" */}
                  {isLogin ? 'Sign In' : 'Register'}
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-slate-700 hover:text-slate-500 font-semibold underline transition-colors"
              >
                {isLogin ? 'Register' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
