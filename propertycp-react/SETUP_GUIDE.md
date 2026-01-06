# PropertyCP React - Complete Setup Guide

## 📋 Prerequisites

- Node.js 14+ installed
- npm or yarn package manager

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd /Users/akash/Documents/cp/propertycp-react
npm install
```

### 2. Start Development Server

```bash
npm start
```

The app will open at `http://localhost:3000`

## ✅ What's Included

### Core Infrastructure ✅
- ✅ React app with routing
- ✅ Material-UI design system
- ✅ In-memory database with sample data (6 properties, 3 users, 3 leads)
- ✅ Mock API service (no backend needed)
- ✅ Authentication context (email/password)
- ✅ Data management context
- ✅ Responsive design setup

### Completed Screens ✅
1. **AppIntro.js** - Beautiful onboarding with 4 slides
2. **Login.js** - Email/password authentication
3. **Register.js** - User registration form
4. **HomeContainer.js** - Bottom navigation container

### Screens to Create 📝

To complete the app, create these screens in `src/screens/`:

#### Main Screens (Priority 1)
5. **HomeScreen.js** - Property browsing with search
6. **PropertyDetail.js** - Property details with images
7. **PropertyListing.js** - Filtered property list
8. **FavoriteScreen.js** - Saved properties

#### Lead Screens (Priority 2)
9. **LeadScreen.js** - User's leads list
10. **CreateLead.js** - Create new lead
11. **LeadComment.js** - Lead details with comments

#### Profile Screens (Priority 3)
12. **ProfileScreen.js** - User profile and settings
13. **KYC.js** - KYC document upload

#### Property Management (Priority 4)
14. **PostProperty.js** - Create property (step 1)
15. **PickPropertyImages.js** - Upload images (step 2)
16. **PickPropertyVideos.js** - Upload videos (step 3)
17. **EditPropertyText.js** - Edit property details
18. **EditPropertyImage.js** - Edit property images
19. **EditPropertyVideo.js** - Edit property videos

#### Admin Screens (Priority 5)
20. **UserList.js** - Admin: All users
21. **UserDetail.js** - Admin: User details
22. **AllLeadUsers.js** - Admin: Users with leads
23. **AdminLeadList.js** - Admin: User's leads

## 🎨 Screen Template

Use this template for each new screen:

```javascript
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CircularProgress,
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const ScreenName = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { fetchData } = useData();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await fetchData();
      setData(result);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate(-1)}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Screen Title
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Screen Content */}
        <Typography variant="h4" gutterBottom>
          Screen Name
        </Typography>

        {/* Your components here */}
      </Container>
    </>
  );
};

export default ScreenName;
```

## 🎯 Feature Implementation Guide

### HomeScreen Example

```javascript
// src/screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  MenuItem,
  AppBar,
  Toolbar,
  Avatar,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const HomeScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { fetchProperties } = useData();
  const [properties, setProperties] = useState([]);
  const [searchCity, setSearchCity] = useState('Bangalore');
  const [propertyType, setPropertyType] = useState('All');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    setLoading(true);
    try {
      const data = await fetchProperties();
      setProperties(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const city = searchCity || null;
      const type = propertyType === 'All' ? null : propertyType;
      const data = await fetchProperties(city, type);
      setProperties(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Avatar sx={{ mr: 2 }} src={user?.image} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6">Welcome back!</Typography>
            <Typography variant="caption">{user?.fullName}</Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* Search Section */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={5}>
                <TextField
                  fullWidth
                  label="City"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  select
                  label="Property Type"
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                >
                  <MenuItem value="All">All Types</MenuItem>
                  <MenuItem value="Residential">Residential</MenuItem>
                  <MenuItem value="Commercial">Commercial</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleSearch}
                  startIcon={<Search />}
                  sx={{ height: '56px' }}
                >
                  Search
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Properties Grid */}
        <Typography variant="h5" gutterBottom fontWeight="600">
          Featured Properties
        </Typography>

        <Grid container spacing={3}>
          {properties.map((property) => (
            <Grid item xs={12} sm={6} md={4} key={property.id}>
              <Card
                sx={{ cursor: 'pointer', '&:hover': { transform: 'translateY(-4px)', transition: 'all 0.3s' } }}
                onClick={() => navigate(`/property/${property.id}`)}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={property.mainImage}
                  alt={property.title}
                />
                <CardContent>
                  <Typography variant="h6" noWrap>{property.title}</Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {property.location}
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                    ₹{parseInt(property.price).toLocaleString('en-IN')}
                  </Typography>
                  <Typography variant="caption">
                    {property.bhk} BHK • {property.area} {property.areaUnit}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/create-lead/${property.id}`);
                  }}>
                    Create Lead
                  </Button>
                  <Button size="small">View Details</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default HomeScreen;
```

## 🎨 Styling Guidelines

### Responsive Breakpoints
```javascript
sx={{
  width: { xs: '100%', sm: '80%', md: '60%' }, // mobile, tablet, desktop
  p: { xs: 2, sm: 3, md: 4 }, // padding
  fontSize: { xs: '14px', sm: '16px', md: '18px' }
}}
```

### Common Patterns
```javascript
// Loading State
{loading && <CircularProgress />}

// Empty State
{!data?.length && <Typography>No data found</Typography>}

// Error Handling
{error && <Alert severity="error">{error}</Alert>}

// Navigation
<Button onClick={() => navigate('/path')}>Go</Button>
<Button onClick={() => navigate(-1)}>Back</Button>

// API Calls with Loading
const [loading, setLoading] = useState(false);
setLoading(true);
try {
  const result = await apiCall();
  setData(result);
} catch (error) {
  setError(error.message);
} finally {
  setLoading(false);
}
```

## 📊 Available Data

### Users
```javascript
{
  id: number,
  fullName: string,
  email: string,
  mobileNo: string,
  status: 'CREATED' | 'PENDING' | 'ACTIVE' | 'SUSPENDED',
  userType: 'Agent' | 'Buyer' | 'Admin',
  image: string,
  isKycVerified: boolean,
  // ... KYC fields
}
```

### Properties
```javascript
{
  id: number,
  title: string,
  subTitle: string,
  price: string,
  numberOfRooms: string,
  bhk: string,
  location: string,
  city: string,
  mainImage: string,
  images: Array<{id, link, isVideo, propertyId}>,
  type: 'Residential' | 'Commercial',
  area: string,
  areaUnit: 'Sqft' | 'Sqm' | 'Acre' | 'Hectare',
  description: string,
  builderPhoneNumber: string,
}
```

### Leads
```javascript
{
  id: number,
  leadPropertyType: 'Buy' | 'Rent' | 'Sell',
  propertyType: 'Residential' | 'Commercial',
  mobileNo: string,
  fullName: string,
  status: 'Open' | 'Closed',
  leadCommentModel: Array<{id, comment, leadId, createdDate}>,
  createdById: number,
  propertyId: number,
}
```

## 🔧 Context APIs

### AuthContext
```javascript
const {
  user,              // Current user object
  loading,           // Auth loading state
  login,             // (email, password) => Promise
  register,          // (userData) => Promise
  logout,            // () => void
  updateUserData,    // (userId, updates) => Promise
  refreshUser,       // () => Promise
  isAdmin,           // boolean
  isActive,          // boolean
  isPending,         // boolean
  isCreated,         // boolean
} = useAuth();
```

### DataContext
```javascript
const {
  properties,               // Array of properties
  leads,                    // Array of leads
  loading,                  // Data loading state

  // Property methods
  fetchProperties,          // (city, type) => Promise<Array>
  fetchPropertyById,        // (id) => Promise<Property>
  createProperty,           // (data) => Promise<Property>
  updateProperty,           // (id, data) => Promise<Property>
  deleteProperty,           // (id) => Promise<boolean>

  // Lead methods
  fetchLeads,               // (userId) => Promise<Array>
  fetchLeadById,            // (id) => Promise<Lead>
  createLead,               // (data) => Promise<Lead>
  updateLead,               // (id, data) => Promise<Lead>
  addLeadComment,           // (leadId, comment) => Promise

  // Favorites
  fetchFavorites,           // (userId) => Promise<Array>
  addFavorite,              // (userId, propertyId) => Promise
  removeFavorite,           // (userId, propertyId) => Promise
  isFavorite,               // (userId, propertyId) => boolean

  // Users
  fetchAllUsers,            // () => Promise<Array>
  fetchUserById,            // (id) => Promise<User>
} = useData();
```

## 🐛 Troubleshooting

### "Module not found"
```bash
npm install
```

### Port already in use
```bash
PORT=3001 npm start
```

### Clear cache
```bash
npm start -- --reset-cache
```

## 🚀 Next Steps

1. Create remaining screens using templates above
2. Test all user flows
3. Add form validations
4. Enhance UI/UX
5. Add error boundaries
6. Implement loading states
7. Add success/error notifications

## 📱 Mobile Testing

Test on mobile devices:
```bash
# Find your IP
ipconfig getifaddr en0  # Mac
ipconfig               # Windows

# Access from mobile
http://YOUR_IP:3000
```

## 🎉 You're All Set!

The foundation is complete. Follow the templates and examples above to create remaining screens. Each screen follows the same pattern and uses the same context APIs.

**Happy Coding! 🚀**
