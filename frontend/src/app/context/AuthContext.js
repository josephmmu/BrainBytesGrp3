'use client'; // Mark as Client Component
import { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check existing session
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');

    if (token) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          if (!res.ok) throw new Error('Unauthorized');
          return res.json();
        })
        .then(data => {
          setUser(data || { email });
        })
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading (false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('email', email);
    setUser(data.user || {email});
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    setUser(null);
    //router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}