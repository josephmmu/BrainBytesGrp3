// components/LoginModal.js
import { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function LoginModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);

  useEffect(() => { 
    if (isOpen) {
      setEmail('');
      setPassword('');
    }
  }, [isOpen])

  if (!isOpen) return null;

  // In LoginModal.js
  const handleLogin = async () => {
    try {
      const res = await axios.post('https://brainbytesgrp3-backend-production.up.railway.app/api/login', {email, password});

      const token = res.data.token;
      login(token);  // this updates context
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
      console.error(err);
    }
  };

  // Register
  const handleRegister = async () => {
    try {
      await axios.post('https://brainbytesgrp3-backend-production.up.railway.app/api/register', { email, password });
      const loginRes = await axios.post('https://brainbytesgrp3-backend-production.up.railway.app/api/login', { email, password });
      // localStorage.setItem('token', loginRes.data.token);
      login(loginRes.data.token);
      onClose();
    } catch (error) {
      alert('Registration Failed');
      console.error(error);
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