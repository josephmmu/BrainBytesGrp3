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