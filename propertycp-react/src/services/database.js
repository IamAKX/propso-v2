// In-Memory Database with Sample Data

class InMemoryDatabase {
  constructor() {
    this.users = [
      {
        id: 1,
        fullName: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        mobileNo: '9876543210',
        status: 'ACTIVE',
        userType: 'Agent',
        image: 'https://i.pravatar.cc/150?img=12',
        aadharFront: null,
        aadharBack: null,
        pan: null,
        vpa: 'john@upi',
        referralCode: 'REF001',
        isKycVerified: true,
        createdDate: new Date('2023-10-01').toISOString(),
        updatedDate: new Date('2023-10-15').toISOString(),
      },
      {
        id: 2,
        fullName: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        mobileNo: '9876543211',
        status: 'ACTIVE',
        userType: 'Agent',
        image: 'https://i.pravatar.cc/150?img=45',
        aadharFront: null,
        aadharBack: null,
        pan: null,
        vpa: 'jane@upi',
        referralCode: 'REF002',
        isKycVerified: true,
        createdDate: new Date('2023-09-15').toISOString(),
        updatedDate: new Date('2023-10-10').toISOString(),
      },
      {
        id: 3,
        fullName: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        mobileNo: '9876543212',
        status: 'ACTIVE',
        userType: 'Admin',
        image: 'https://i.pravatar.cc/150?img=33',
        aadharFront: null,
        aadharBack: null,
        pan: null,
        vpa: 'admin@upi',
        referralCode: 'ADMIN001',
        isKycVerified: true,
        createdDate: new Date('2023-01-01').toISOString(),
        updatedDate: new Date('2023-10-20').toISOString(),
      }
    ];

    this.properties = [
      {
        id: 1,
        title: 'Luxury 3BHK Apartment',
        subTitle: 'Prime Location in City Center',
        price: '5000000',
        numberOfRooms: '5',
        bhk: '3',
        location: 'MG Road, Bangalore',
        city: 'Bangalore',
        mainImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
        images: [
          { id: 1, link: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800', isVideo: false, propertyId: 1 },
          { id: 2, link: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800', isVideo: false, propertyId: 1 },
          { id: 3, link: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', isVideo: false, propertyId: 1 },
          { id: 4, link: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', isVideo: false, propertyId: 1 },
        ],
        type: 'Residential',
        area: '1500',
        areaUnit: 'Sqft',
        description: 'Beautiful luxury apartment with modern amenities, spacious rooms, and excellent ventilation. Located in the heart of the city with easy access to schools, hospitals, and shopping centers.',
        builderPhoneNumber: '9876543210',
        createdDate: new Date('2023-10-01').toISOString(),
        updatedDate: new Date('2023-10-15').toISOString(),
      },
      {
        id: 2,
        title: 'Modern 2BHK Flat',
        subTitle: 'Near Metro Station',
        price: '3500000',
        numberOfRooms: '4',
        bhk: '2',
        location: 'Whitefield, Bangalore',
        city: 'Bangalore',
        mainImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
        images: [
          { id: 5, link: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', isVideo: false, propertyId: 2 },
          { id: 6, link: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', isVideo: false, propertyId: 2 },
          { id: 7, link: 'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800', isVideo: false, propertyId: 2 },
        ],
        type: 'Residential',
        area: '1100',
        areaUnit: 'Sqft',
        description: 'Newly constructed modern flat with premium fittings. Close to IT parks and metro station. Perfect for working professionals.',
        builderPhoneNumber: '9876543211',
        createdDate: new Date('2023-10-05').toISOString(),
        updatedDate: new Date('2023-10-18').toISOString(),
      },
      {
        id: 3,
        title: 'Spacious 4BHK Villa',
        subTitle: 'Independent House with Garden',
        price: '12000000',
        numberOfRooms: '7',
        bhk: '4',
        location: 'Sarjapur Road, Bangalore',
        city: 'Bangalore',
        mainImage: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
        images: [
          { id: 8, link: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800', isVideo: false, propertyId: 3 },
          { id: 9, link: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800', isVideo: false, propertyId: 3 },
          { id: 10, link: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800', isVideo: false, propertyId: 3 },
          { id: 11, link: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800', isVideo: false, propertyId: 3 },
        ],
        type: 'Residential',
        area: '2500',
        areaUnit: 'Sqft',
        description: 'Luxurious independent villa with large garden, parking for 3 cars, and premium interiors. Gated community with 24/7 security.',
        builderPhoneNumber: '9876543212',
        createdDate: new Date('2023-09-20').toISOString(),
        updatedDate: new Date('2023-10-12').toISOString(),
      },
      {
        id: 4,
        title: 'Commercial Office Space',
        subTitle: 'Premium Business Location',
        price: '8000000',
        numberOfRooms: '6',
        bhk: null,
        location: 'Koramangala, Bangalore',
        city: 'Bangalore',
        mainImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
        images: [
          { id: 12, link: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800', isVideo: false, propertyId: 4 },
          { id: 13, link: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800', isVideo: false, propertyId: 4 },
        ],
        type: 'Commercial',
        area: '2000',
        areaUnit: 'Sqft',
        description: 'Ready to move commercial space with modern facilities. Ideal for startups and small businesses. High-speed internet and power backup included.',
        builderPhoneNumber: '9876543213',
        createdDate: new Date('2023-10-10').toISOString(),
        updatedDate: new Date('2023-10-20').toISOString(),
      },
      {
        id: 5,
        title: 'Studio Apartment',
        subTitle: 'Perfect for Singles',
        price: '2500000',
        numberOfRooms: '2',
        bhk: '1',
        location: 'Indiranagar, Bangalore',
        city: 'Bangalore',
        mainImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
        images: [
          { id: 14, link: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', isVideo: false, propertyId: 5 },
          { id: 15, link: 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800', isVideo: false, propertyId: 5 },
        ],
        type: 'Residential',
        area: '650',
        areaUnit: 'Sqft',
        description: 'Cozy studio apartment with modern amenities. Perfect for young professionals. Walking distance to cafes and restaurants.',
        builderPhoneNumber: '9876543214',
        createdDate: new Date('2023-10-15').toISOString(),
        updatedDate: new Date('2023-10-19').toISOString(),
      },
      {
        id: 6,
        title: 'Penthouse Suite',
        subTitle: 'Top Floor with City View',
        price: '15000000',
        numberOfRooms: '8',
        bhk: '4',
        location: 'UB City, Bangalore',
        city: 'Bangalore',
        mainImage: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800',
        images: [
          { id: 16, link: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800', isVideo: false, propertyId: 6 },
          { id: 17, link: 'https://images.unsplash.com/photo-1600585152915-d208bec867a1?w=800', isVideo: false, propertyId: 6 },
          { id: 18, link: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', isVideo: false, propertyId: 6 },
        ],
        type: 'Residential',
        area: '3500',
        areaUnit: 'Sqft',
        description: 'Ultra-luxury penthouse with panoramic city views, private terrace, jacuzzi, and premium Italian marble flooring.',
        builderPhoneNumber: '9876543215',
        createdDate: new Date('2023-09-25').toISOString(),
        updatedDate: new Date('2023-10-21').toISOString(),
      }
    ];

    this.leads = [
      {
        id: 1,
        leadPropertyType: 'Buy',
        propertyType: 'Residential',
        mobileNo: '9988776655',
        fullName: 'Rahul Kumar',
        status: 'Open',
        leadCommentModel: [
          {
            id: 1,
            comment: 'Customer interested in 3BHK apartments',
            leadId: 1,
            createdDate: new Date('2023-10-21T10:00:00').toISOString(),
          },
          {
            id: 2,
            comment: 'Scheduled property visit for tomorrow',
            leadId: 1,
            createdDate: new Date('2023-10-21T14:30:00').toISOString(),
          }
        ],
        createdById: 1,
        propertyId: 1,
        createdDate: new Date('2023-10-20').toISOString(),
        updatedDate: new Date('2023-10-21').toISOString(),
      },
      {
        id: 2,
        leadPropertyType: 'Rent',
        propertyType: 'Commercial',
        mobileNo: '9988776656',
        fullName: 'Priya Sharma',
        status: 'Open',
        leadCommentModel: [
          {
            id: 3,
            comment: 'Looking for office space in Koramangala',
            leadId: 2,
            createdDate: new Date('2023-10-22T09:00:00').toISOString(),
          }
        ],
        createdById: 1,
        propertyId: 4,
        createdDate: new Date('2023-10-22').toISOString(),
        updatedDate: new Date('2023-10-22').toISOString(),
      },
      {
        id: 3,
        leadPropertyType: 'Buy',
        propertyType: 'Residential',
        mobileNo: '9988776657',
        fullName: 'Amit Patel',
        status: 'Closed',
        leadCommentModel: [
          {
            id: 4,
            comment: 'Interested in villa',
            leadId: 3,
            createdDate: new Date('2023-10-18T11:00:00').toISOString(),
          },
          {
            id: 5,
            comment: 'Deal finalized, booking done',
            leadId: 3,
            createdDate: new Date('2023-10-20T16:00:00').toISOString(),
          }
        ],
        createdById: 2,
        propertyId: 3,
        createdDate: new Date('2023-10-18').toISOString(),
        updatedDate: new Date('2023-10-20').toISOString(),
      }
    ];

    this.favorites = {}; // userId -> [propertyIds]
  }

  // User Methods
  getAllUsers() {
    return this.users;
  }

  getUserById(id) {
    return this.users.find(u => u.id === id);
  }

  getUserByEmail(email) {
    return this.users.find(u => u.email === email);
  }

  createUser(userData) {
    const newUser = {
      id: this.users.length + 1,
      ...userData,
      status: 'CREATED',
      isKycVerified: false,
      image: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
    };
    this.users.push(newUser);
    return newUser;
  }

  updateUser(id, userData) {
    const index = this.users.findIndex(u => u.id === id);
    if (index !== -1) {
      this.users[index] = {
        ...this.users[index],
        ...userData,
        updatedDate: new Date().toISOString(),
      };
      return this.users[index];
    }
    return null;
  }

  deleteUser(id) {
    const index = this.users.findIndex(u => u.id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
      return true;
    }
    return false;
  }

  // Property Methods
  getAllProperties() {
    return this.properties;
  }

  getPropertiesByCity(city, propertyType = null) {
    let filtered = this.properties.filter(p =>
      p.city.toLowerCase().includes(city.toLowerCase())
    );

    if (propertyType) {
      filtered = filtered.filter(p => p.type === propertyType);
    }

    return filtered;
  }

  getPropertyById(id) {
    return this.properties.find(p => p.id === id);
  }

  getPropertiesByIds(ids) {
    return this.properties.filter(p => ids.includes(p.id));
  }

  createProperty(propertyData) {
    const newProperty = {
      id: this.properties.length + 1,
      ...propertyData,
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
    };
    this.properties.push(newProperty);
    return newProperty;
  }

  updateProperty(id, propertyData) {
    const index = this.properties.findIndex(p => p.id === id);
    if (index !== -1) {
      this.properties[index] = {
        ...this.properties[index],
        ...propertyData,
        updatedDate: new Date().toISOString(),
      };
      return this.properties[index];
    }
    return null;
  }

  deleteProperty(id) {
    const index = this.properties.findIndex(p => p.id === id);
    if (index !== -1) {
      this.properties.splice(index, 1);
      return true;
    }
    return false;
  }

  // Lead Methods
  getAllLeads() {
    return this.leads.map(lead => ({
      ...lead,
      createdBy: this.getUserById(lead.createdById)
    }));
  }

  getLeadsByUserId(userId) {
    return this.leads.filter(l => l.createdById === userId);
  }

  getLeadById(id) {
    return this.leads.find(l => l.id === id);
  }

  createLead(leadData) {
    const newLead = {
      id: this.leads.length + 1,
      ...leadData,
      leadCommentModel: [],
      status: 'Open',
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
    };
    this.leads.push(newLead);
    return newLead;
  }

  updateLead(id, leadData) {
    const index = this.leads.findIndex(l => l.id === id);
    if (index !== -1) {
      this.leads[index] = {
        ...this.leads[index],
        ...leadData,
        updatedDate: new Date().toISOString(),
      };
      return this.leads[index];
    }
    return null;
  }

  addLeadComment(leadId, comment) {
    const lead = this.getLeadById(leadId);
    if (lead) {
      const newComment = {
        id: (lead.leadCommentModel?.length || 0) + 1,
        comment,
        leadId,
        createdDate: new Date().toISOString(),
      };
      lead.leadCommentModel = lead.leadCommentModel || [];
      lead.leadCommentModel.push(newComment);
      lead.updatedDate = new Date().toISOString();
      return newComment;
    }
    return null;
  }

  // Favorites Methods
  getFavorites(userId) {
    return this.favorites[userId] || [];
  }

  addFavorite(userId, propertyId) {
    if (!this.favorites[userId]) {
      this.favorites[userId] = [];
    }
    if (!this.favorites[userId].includes(propertyId)) {
      this.favorites[userId].push(propertyId);
    }
    return this.favorites[userId];
  }

  removeFavorite(userId, propertyId) {
    if (this.favorites[userId]) {
      this.favorites[userId] = this.favorites[userId].filter(id => id !== propertyId);
    }
    return this.favorites[userId];
  }

  isFavorite(userId, propertyId) {
    return this.favorites[userId]?.includes(propertyId) || false;
  }
}

// Create singleton instance
const database = new InMemoryDatabase();
export default database;
