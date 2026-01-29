import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.login(email, password);
      const userData = response.data.user;
      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.register(userData);
      // Auto-login after registration
      const registeredUser = response.data.user;
      setUser(registeredUser);
      return { success: true, message: 'Registration successful', user: registeredUser };
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.removeItem('appIntroSeen');
  };

  const updateUserData = async (userId, updates) => {
    try {
      const response = await api.updateUser(userId, updates);
      const updatedUser = response.data;
      // Only update the current user state if we're updating the logged-in user
      if (user && user.id === userId) {
        setUser(updatedUser);
      }
      return { success: true, user: updatedUser };
    } catch (error) {
      throw error;
    }
  };

  const refreshUser = async () => {
    if (!user) return;
    try {
      const response = await api.getUserById(user.id);
      const userData = response.data;
      setUser(userData);
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUserData,
    refreshUser,
    isAdmin: user?.userType === 'Admin',
    isAgent: user?.userType === 'Agent',
    isBuyer: user?.userType === 'Buyer',
    isActive: user?.status === 'ACTIVE',
    isPending: user?.status === 'PENDING',
    isCreated: user?.status === 'CREATED',
    // Permission helpers
    canManageProperties: user?.userType === 'Admin' || user?.userType === 'Agent',
    canManageLeads: user?.userType === 'Admin' || user?.userType === 'Agent',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
