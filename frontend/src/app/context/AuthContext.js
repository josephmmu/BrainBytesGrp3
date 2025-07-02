'use client'; // Mark as Client Component
import { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) =>  {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    try {
      if (token) {
      const decoded = jwtDecode(token);
      setUser({ ...decoded, token });
      }
    } catch (err) {
      console.warn('Invalid Token found, clearning it: ', err.message);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }

  }, []);

  // useEffect(() => {
  //   // Check existing session
  //   const token = localStorage.getItem('token');

  //   if (token) {
  //     fetch('http://localhost:3000/api/auth/me', {
  //       headers: { Authorization: `Bearer ${token}` }
  //     })
  //       .then(res => {
  //         if (!res.ok) throw new Error('Unauthorized');
  //         return res.json();
  //       })
  //       .then(data => setUser(data))
  //       .catch(() => logout())
  //       .finally(() => setLoading(false));
  //   } else {
  //     setLoading (false);
  //   }
  // }, []);

  // const login = async (email, password) => {
  //   const res = await fetch('http://localhost:3000/api/login', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ email, password })
  //   });

  //   if (!res.ok) {
  //     const errorData = await res.json();
  //     throw new Error(errorData.message || 'Login Failed');
  //   }

  //   const data = await res.json();
  //   localStorage.setItem('token', data.token);
  //   setUser(data.user);
  // };

  const login = (token) => {
    localStorage.setItem('token', token);
    const decoded = jwtDecode(token);
    setUser({...decoded, token});
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);