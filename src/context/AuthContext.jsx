import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// 1. SET YOUR LOCAL BACKEND URL HERE
// Replace this with the URL you see at the top of your Render dashboard in production
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const parsedUser = JSON.parse(userInfo);
      setUser(parsedUser);
      axios.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // 2. REMOVE THE LOCALHOST PART - Axios will now use the baseURL above
      const { data } = await axios.post('/api/auth/login', { email, password });
      
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      return data;
    } catch (error) {
      throw error.response?.data?.error || 'Login failed';
    }
  };

  const register = async (email, password) => {
    try {
      const { data } = await axios.post('/api/auth/register', { email, password });
      
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      return data;
    } catch (error) {
      throw error.response?.data?.error || 'Registration failed';
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};