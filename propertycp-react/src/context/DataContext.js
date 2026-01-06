import React, { createContext, useState, useContext } from 'react';
import api from '../services/api';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [properties, setProperties] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);

  // Property Methods
  const fetchProperties = async (city = null, propertyType = null) => {
    setLoading(true);
    try {
      const response = await api.getAllProperties(city, propertyType);
      setProperties(response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch properties:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchPropertyById = async (id) => {
    try {
      const response = await api.getPropertyById(parseInt(id));
      return response.data;
    } catch (error) {
      console.error('Failed to fetch property:', error);
      throw error;
    }
  };

  const createProperty = async (propertyData) => {
    try {
      const response = await api.createProperty(propertyData);
      setProperties(prev => [response.data, ...prev]);
      return response.data;
    } catch (error) {
      console.error('Failed to create property:', error);
      throw error;
    }
  };

  const updateProperty = async (id, propertyData) => {
    try {
      const response = await api.updateProperty(id, propertyData);
      setProperties(prev =>
        prev.map(p => (p.id === id ? response.data : p))
      );
      return response.data;
    } catch (error) {
      console.error('Failed to update property:', error);
      throw error;
    }
  };

  const deleteProperty = async (id) => {
    try {
      await api.deleteProperty(id);
      setProperties(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (error) {
      console.error('Failed to delete property:', error);
      throw error;
    }
  };

  // Lead Methods
  const fetchLeads = async (userId = null) => {
    setLoading(true);
    try {
      const response = userId
        ? await api.getLeadsByUserId(userId)
        : await api.getAllLeads();
      setLeads(response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch leads:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchLeadById = async (id) => {
    try {
      const response = await api.getLeadById(parseInt(id));
      return response.data;
    } catch (error) {
      console.error('Failed to fetch lead:', error);
      throw error;
    }
  };

  const createLead = async (leadData) => {
    try {
      const response = await api.createLead(leadData);
      setLeads(prev => [response.data, ...prev]);
      return response.data;
    } catch (error) {
      console.error('Failed to create lead:', error);
      throw error;
    }
  };

  const updateLead = async (id, leadData) => {
    try {
      const response = await api.updateLead(id, leadData);
      setLeads(prev =>
        prev.map(l => (l.id === id ? response.data : l))
      );
      return response.data;
    } catch (error) {
      console.error('Failed to update lead:', error);
      throw error;
    }
  };

  const addLeadComment = async (leadId, comment) => {
    try {
      await api.addLeadComment(leadId, comment);
      // Refresh the lead
      const response = await api.getLeadById(leadId);
      setLeads(prev =>
        prev.map(l => (l.id === leadId ? response.data : l))
      );
      return response.data;
    } catch (error) {
      console.error('Failed to add comment:', error);
      throw error;
    }
  };

  // Favorites Methods
  const fetchFavorites = async () => {
    try {
      const response = await api.getFavorites();
      return response.data;
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
      throw error;
    }
  };

  const addFavorite = async (userId, propertyId) => {
    try {
      await api.addFavorite(propertyId);
      return true;
    } catch (error) {
      console.error('Failed to add favorite:', error);
      throw error;
    }
  };

  const removeFavorite = async (userId, propertyId) => {
    try {
      await api.removeFavorite(propertyId);
      return true;
    } catch (error) {
      console.error('Failed to remove favorite:', error);
      throw error;
    }
  };

  const isFavorite = async (userId, propertyId) => {
    try {
      return await api.isFavorite(propertyId);
    } catch (error) {
      return false;
    }
  };

  // User Methods
  const fetchAllUsers = async () => {
    try {
      const response = await api.getAllUsers();
      return response.data;
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw error;
    }
  };

  const fetchUserById = async (id) => {
    try {
      const response = await api.getUserById(parseInt(id));
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user:', error);
      throw error;
    }
  };

  const value = {
    properties,
    leads,
    loading,
    // Property methods
    fetchProperties,
    fetchPropertyById,
    createProperty,
    updateProperty,
    deleteProperty,
    // Lead methods
    fetchLeads,
    fetchLeadById,
    createLead,
    updateLead,
    addLeadComment,
    // Favorites methods
    fetchFavorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    // User methods
    fetchAllUsers,
    fetchUserById,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
