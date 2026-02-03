import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add userId to requests if available
axiosInstance.interceptors.request.use((config) => {
  const userId = localStorage.getItem('userId');
  if (userId) {
    config.headers['X-User-Id'] = userId;
  }
  return config;
});

// Handle response errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear session
      localStorage.removeItem('userId');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const api = {
  // Auth APIs
  login: async (email, password) => {
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      if (response.data.success && response.data.data.user) {
        const user = response.data.data.user;
        localStorage.setItem('userId', user.id.toString());
        localStorage.setItem('user', JSON.stringify(user));
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  register: async (userData) => {
    try {
      const response = await axiosInstance.post('/auth/register', userData);
      if (response.data.success && response.data.data.user) {
        const user = response.data.data.user;
        localStorage.setItem('userId', user.id.toString());
        localStorage.setItem('user', JSON.stringify(user));
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  // User APIs
  getAllUsers: async () => {
    try {
      const response = await axiosInstance.get('/users');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch users');
    }
  },

  getUserById: async (id) => {
    try {
      const response = await axiosInstance.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user');
    }
  },

  updateUser: async (id, userData) => {
    try {
      const response = await axiosInstance.put(`/users/${id}`, userData);
      // Update local storage if user updated their own profile
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (currentUser.id === id) {
        localStorage.setItem('user', JSON.stringify(response.data.data));
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update user');
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await axiosInstance.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete user');
    }
  },

  // Property APIs
  getAllProperties: async (city = null, propertyType = null) => {
    try {
      const params = {};
      if (city) params.city = city;
      if (propertyType) params.propertyType = propertyType;

      const response = await axiosInstance.get('/properties', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch properties');
    }
  },

  getAllPropertiesForAdmin: async (city = null, propertyType = null) => {
    try {
      const params = {};
      if (city) params.city = city;
      if (propertyType) params.propertyType = propertyType;

      const response = await axiosInstance.get('/properties/admin/all', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch properties');
    }
  },

  getPropertyById: async (id) => {
    try {
      const response = await axiosInstance.get(`/properties/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch property');
    }
  },

  getMultipleProperties: async (ids) => {
    try {
      // Fetch multiple properties by making individual requests
      const promises = ids.map(id => axiosInstance.get(`/properties/${id}`));
      const responses = await Promise.all(promises);
      const properties = responses.map(res => res.data.data);
      return {
        success: true,
        message: 'Properties retrieved successfully',
        data: properties,
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch properties');
    }
  },

  createProperty: async (propertyData) => {
    try {
      const response = await axiosInstance.post('/properties', propertyData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create property');
    }
  },

  updateProperty: async (id, propertyData) => {
    try {
      const response = await axiosInstance.put(`/properties/${id}`, propertyData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update property');
    }
  },

  deleteProperty: async (id) => {
    try {
      const response = await axiosInstance.delete(`/properties/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete property');
    }
  },

  approveProperty: async (id) => {
    try {
      const response = await axiosInstance.post(`/properties/${id}/approve`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to approve property');
    }
  },

  rejectProperty: async (id) => {
    try {
      const response = await axiosInstance.post(`/properties/${id}/reject`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to reject property');
    }
  },

  markPropertyAsSold: async (id) => {
    try {
      const response = await axiosInstance.post(`/properties/${id}/sold`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to mark property as sold');
    }
  },

  deletePropertyAdmin: async (id) => {
    try {
      const response = await axiosInstance.delete(`/properties/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete property');
    }
  },

  // Lead APIs
  getAllLeads: async () => {
    try {
      const response = await axiosInstance.get('/leads');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch leads');
    }
  },

  getLeadsByUserId: async (userId) => {
    try {
      const response = await axiosInstance.get(`/leads/user/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch leads');
    }
  },

  getLeadById: async (id) => {
    try {
      const response = await axiosInstance.get(`/leads/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch lead');
    }
  },

  createLead: async (leadData) => {
    try {
      const response = await axiosInstance.post('/leads', leadData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create lead');
    }
  },

  updateLead: async (id, leadData) => {
    try {
      const response = await axiosInstance.put(`/leads/${id}`, leadData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update lead');
    }
  },

  addLeadComment: async (leadId, comment) => {
    try {
      const response = await axiosInstance.post(`/leads/${leadId}/comments`, { comment });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add comment');
    }
  },

  // Favorites APIs
  getFavorites: async () => {
    try {
      const response = await axiosInstance.get('/favorites');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch favorites');
    }
  },

  addFavorite: async (propertyId) => {
    try {
      const response = await axiosInstance.post(`/favorites/${propertyId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add favorite');
    }
  },

  removeFavorite: async (propertyId) => {
    try {
      const response = await axiosInstance.delete(`/favorites/${propertyId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to remove favorite');
    }
  },

  isFavorite: async (propertyId) => {
    try {
      const response = await axiosInstance.get(`/favorites/check/${propertyId}`);
      return response.data.data.isFavorite;
    } catch (error) {
      return false;
    }
  },

  // File Upload (still using mock for now - can be replaced with actual file upload service)
  uploadFile: async (file, path) => {
    // Simulate file upload by creating a blob URL
    // In production, this would upload to cloud storage (S3, Firebase, etc.)
    const url = URL.createObjectURL(file);
    return {
      success: true,
      message: 'File uploaded successfully',
      data: { url },
    };
  },
};

export default api;
