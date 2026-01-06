import database from './database';

// Simulate network delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

const mockApi = {
  // Auth APIs
  login: async (email, password) => {
    await delay();
    const user = database.getUserByEmail(email);
    if (user && user.password === password) {
      const { password: _, ...userWithoutPassword } = user;
      return {
        success: true,
        message: 'Login successful',
        data: userWithoutPassword,
      };
    }
    throw new Error('Invalid email or password');
  },

  register: async (userData) => {
    await delay();
    const existingUser = database.getUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    const newUser = database.createUser(userData);
    const { password: _, ...userWithoutPassword } = newUser;
    return {
      success: true,
      message: 'Registration successful',
      data: userWithoutPassword,
    };
  },

  // User APIs
  getAllUsers: async () => {
    await delay();
    return {
      success: true,
      message: 'Users retrieved successfully',
      data: database.getAllUsers().map(({ password, ...user }) => user),
    };
  },

  getUserById: async (id) => {
    await delay();
    const user = database.getUserById(id);
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      return {
        success: true,
        message: 'User retrieved successfully',
        data: userWithoutPassword,
      };
    }
    throw new Error('User not found');
  },

  updateUser: async (id, userData) => {
    await delay();
    const updated = database.updateUser(id, userData);
    if (updated) {
      const { password: _, ...userWithoutPassword } = updated;
      return {
        success: true,
        message: 'User updated successfully',
        data: userWithoutPassword,
      };
    }
    throw new Error('User not found');
  },

  deleteUser: async (id) => {
    await delay();
    const deleted = database.deleteUser(id);
    if (deleted) {
      return {
        success: true,
        message: 'User deleted successfully',
        data: true,
      };
    }
    throw new Error('User not found');
  },

  // Property APIs
  getAllProperties: async (city = null, propertyType = null) => {
    await delay();
    let properties;
    if (city) {
      properties = database.getPropertiesByCity(city, propertyType);
    } else {
      properties = database.getAllProperties();
    }
    return {
      success: true,
      message: 'Properties retrieved successfully',
      data: properties,
    };
  },

  getPropertyById: async (id) => {
    await delay();
    const property = database.getPropertyById(id);
    if (property) {
      return {
        success: true,
        message: 'Property retrieved successfully',
        data: property,
      };
    }
    throw new Error('Property not found');
  },

  getMultipleProperties: async (ids) => {
    await delay();
    const properties = database.getPropertiesByIds(ids);
    return {
      success: true,
      message: 'Properties retrieved successfully',
      data: properties,
    };
  },

  createProperty: async (propertyData) => {
    await delay();
    const newProperty = database.createProperty(propertyData);
    return {
      success: true,
      message: 'Property created successfully',
      data: newProperty,
    };
  },

  updateProperty: async (id, propertyData) => {
    await delay();
    const updated = database.updateProperty(id, propertyData);
    if (updated) {
      return {
        success: true,
        message: 'Property updated successfully',
        data: updated,
      };
    }
    throw new Error('Property not found');
  },

  deleteProperty: async (id) => {
    await delay();
    const deleted = database.deleteProperty(id);
    if (deleted) {
      return {
        success: true,
        message: 'Property deleted successfully',
        data: true,
      };
    }
    throw new Error('Property not found');
  },

  // Lead APIs
  getAllLeads: async () => {
    await delay();
    const leads = database.getAllLeads();
    return {
      success: true,
      message: 'Leads retrieved successfully',
      data: leads,
    };
  },

  getLeadsByUserId: async (userId) => {
    await delay();
    const leads = database.getLeadsByUserId(userId);
    return {
      success: true,
      message: 'Leads retrieved successfully',
      data: leads,
    };
  },

  getLeadById: async (id) => {
    await delay();
    const lead = database.getLeadById(id);
    if (lead) {
      return {
        success: true,
        message: 'Lead retrieved successfully',
        data: lead,
      };
    }
    throw new Error('Lead not found');
  },

  createLead: async (leadData) => {
    await delay();
    const newLead = database.createLead(leadData);
    return {
      success: true,
      message: 'Lead created successfully',
      data: newLead,
    };
  },

  updateLead: async (id, leadData) => {
    await delay();
    const updated = database.updateLead(id, leadData);
    if (updated) {
      return {
        success: true,
        message: 'Lead updated successfully',
        data: updated,
      };
    }
    throw new Error('Lead not found');
  },

  addLeadComment: async (leadId, comment) => {
    await delay();
    const newComment = database.addLeadComment(leadId, comment);
    if (newComment) {
      return {
        success: true,
        message: 'Comment added successfully',
        data: newComment,
      };
    }
    throw new Error('Lead not found');
  },

  // Favorites APIs
  getFavorites: async (userId) => {
    await delay();
    const favoriteIds = database.getFavorites(userId);
    const properties = database.getPropertiesByIds(favoriteIds);
    return {
      success: true,
      message: 'Favorites retrieved successfully',
      data: properties,
    };
  },

  addFavorite: async (userId, propertyId) => {
    await delay(200);
    database.addFavorite(userId, propertyId);
    return {
      success: true,
      message: 'Added to favorites',
      data: true,
    };
  },

  removeFavorite: async (userId, propertyId) => {
    await delay(200);
    database.removeFavorite(userId, propertyId);
    return {
      success: true,
      message: 'Removed from favorites',
      data: true,
    };
  },

  isFavorite: (userId, propertyId) => {
    return database.isFavorite(userId, propertyId);
  },

  // File Upload Mock (simulates Firebase Storage)
  uploadFile: async (file, path) => {
    await delay(1000);
    // Simulate file upload by creating a blob URL
    const url = URL.createObjectURL(file);
    return {
      success: true,
      message: 'File uploaded successfully',
      data: { url },
    };
  },
};

export default mockApi;
