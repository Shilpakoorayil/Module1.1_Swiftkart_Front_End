import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { role: 'admin' | 'user' | 'guest', phone?: string, address?: string, access?: string, refresh?: string }
  const [loading, setLoading] = useState(true);

  // Initialize from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('swiftkart_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      // Default to guest if no user is found
      setUser({ role: 'guest' });
    }
    setLoading(false);
  }, []);

  const loginUser = async (phone, otp) => {
    try {
      // Typically, actual APIs for phone/OTP verification would be used here.
      // Calling our user login endpoint. Adapt payload based on actual backend requirements if needed.
      const response = await api.post('/auth/login/user/', {
        phone_number: phone,
        otp: otp
      });
      // Expected response might include tokens: { access: '...', refresh: '...' }
      const newUser = { role: 'user', phone, ...response.data };
      setUser(newUser);
      localStorage.setItem('swiftkart_user', JSON.stringify(newUser));
      return true;
    } catch (error) {
      console.error("User login failed:", error);
      return false;
    }
  };

  const loginAdmin = async (username, password) => {
    try {
      const response = await api.post('/auth/login/admin/', {
        username,
        password
      });
      
      const adminUser = { role: 'admin', username, ...response.data };
      setUser(adminUser);
      localStorage.setItem('swiftkart_user', JSON.stringify(adminUser));
      return true;
    } catch (error) {
      console.error("Admin login failed:", error);
      return false;
    }
  };

  const logout = () => {
    const guestUser = { role: 'guest' };
    setUser(guestUser);
    localStorage.setItem('swiftkart_user', JSON.stringify(guestUser));
  };

  const updateAddress = (address) => {
    if (user) {
      const updatedUser = { ...user, address };
      setUser(updatedUser);
      localStorage.setItem('swiftkart_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, loginAdmin, logout, updateAddress, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
