// components/LoginModal.js
import React from 'react';
import { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import API_BASE_URL from '../../config/api.js';

export default function LoginModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);

  useEffect(() => { 
    if (isOpen) {
      setEmail('');
      setPassword('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

 const handleLogin = async () => {
  try {
    const res = await axios.post(`${API_BASE_URL}/api/login`, {
      email,
      password
    });

    const token = res.data.token;
    login(token); // Updates context

  } catch (err) {
    if (err.response && err.response.status === 401) {
      alert('Invalid credentials or account not registered.');
    } else {
      console.error('Login error:', err);
      alert('An unexpected error occurred. Please try again later.');
    }
  }
};

const handleRegister = async () => {
  try {
    // Attempt to register
    await axios.post(`${API_BASE_URL}/api/register`, {
      email,
      password
    });

    // Automatically log in after successful registration
    const loginRes = await axios.post(`${API_BASE_URL}/api/login`, {
      email,
      password
    });

    login(loginRes.data.token); // update context
    onClose();

  } catch (err) {
    if (err.response) {
      // Backend responded with error status (400, etc.)
      const message = err.response.data?.message || 'Registration failed';
      alert(message);
    } else if (err.request) {
      // No response from server
      alert('No response from server. Please try again later.');
    } else {
      // Error setting up request
      alert('An unexpected error occurred.');
    }
    console.error(err);
  }
};

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border mb-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex justify-end space-x-2">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Cancel
          </button>
          <button 
            onClick={handleLogin}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Login
          </button>

          <button 
            onClick={handleRegister}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}