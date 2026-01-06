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
  CircularProgress,
  Chip,
  IconButton,
} from '@mui/material';
import { Search, Favorite, FavoriteBorder, LocationOn } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const HomeScreen = () => {
  const navigate = useNavigate();
  const { user, canManageLeads } = useAuth();
  const { fetchProperties, addFavorite, removeFavorite, fetchFavorites } = useData();
  const [properties, setProperties] = useState([]);
  const [searchCity, setSearchCity] = useState('');
  const [propertyType, setPropertyType] = useState('All');
  const [loading, setLoading] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState(new Set());

  useEffect(() => {
    loadProperties();
    loadFavorites();
  }, []);

  const loadProperties = async () => {
    setLoading(true);
    try {
      const data = await fetchProperties();
      setProperties(data);
    } catch (error) {
      console.error('Error loading properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      const favorites = await fetchFavorites();
      const ids = new Set(favorites.map(p => p.id));
      setFavoriteIds(ids);
    } catch (error) {
      console.error('Error loading favorites:', error);
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
      console.error('Error searching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = async (e, propertyId) => {
    e.stopPropagation();
    try {
      if (favoriteIds.has(propertyId)) {
        await removeFavorite(user.id, propertyId);
        setFavoriteIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(propertyId);
          return newSet;
        });
      } else {
        await addFavorite(user.id, propertyId);
        setFavoriteIds(prev => new Set(prev).add(propertyId));
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)',
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <Avatar
            sx={{
              mr: 2,
              bgcolor: 'white',
              color: 'primary.main',
              fontWeight: 700,
              width: 48,
              height: 48,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            }}
          >
            {user?.fullName?.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>
              Welcome back!
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              {user?.fullName}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4, pb: 10 }}>
        {/* Search Section */}
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="700" sx={{ mb: 2 }}>
              Find Your Dream Property
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={5}>
                <TextField
                  fullWidth
                  label="City"
                  placeholder="Enter city name"
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
                  disabled={loading}
                  sx={{ height: '56px' }}
                >
                  Search
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Properties Grid */}
        {!loading && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" fontWeight="700">
                Featured Properties
              </Typography>
              <Chip
                label={`${properties.length} ${properties.length === 1 ? 'property' : 'properties'}`}
                color="primary"
                variant="outlined"
                sx={{ fontWeight: 600 }}
              />
            </Box>

            {properties.length === 0 ? (
              <Card
                sx={{
                  textAlign: 'center',
                  py: 6,
                  border: '2px dashed',
                  borderColor: 'divider',
                }}
              >
                <Typography variant="h6" color="text.secondary" fontWeight="600" gutterBottom>
                  No properties found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try adjusting your search criteria
                </Typography>
              </Card>
            ) : (
              <Grid container spacing={2}>
                {properties.map((property) => (
                  <Grid item xs={12} sm={6} md={4} key={property.id}>
                    <Card
                      sx={{
                        cursor: 'pointer',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        transition: 'all 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 4,
                        },
                      }}
                      onClick={() => navigate(`/property/${property.id}`)}
                    >
                      <Box sx={{ position: 'relative' }}>
                        <CardMedia
                          component="img"
                          height="200"
                          image={property.mainImage}
                          alt={property.title}
                        />
                        <IconButton
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            bgcolor: 'white',
                            '&:hover': { bgcolor: 'white' },
                          }}
                          onClick={(e) => handleFavoriteToggle(e, property.id)}
                        >
                          {favoriteIds.has(property.id) ? (
                            <Favorite color="error" />
                          ) : (
                            <FavoriteBorder />
                          )}
                        </IconButton>
                        <Chip
                          label={property.type}
                          size="small"
                          color={property.type === 'Residential' ? 'primary' : 'secondary'}
                          sx={{
                            position: 'absolute',
                            bottom: 8,
                            left: 8,
                            fontWeight: 600,
                          }}
                        />
                      </Box>
                      <CardContent sx={{ flexGrow: 1, p: 2 }}>
                        <Typography variant="subtitle1" fontWeight="700" noWrap gutterBottom>
                          {property.title}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                          <LocationOn fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {property.location}, {property.city}
                          </Typography>
                        </Box>
                        <Typography variant="h6" color="primary.main" fontWeight="700" gutterBottom>
                          ₹{parseInt(property.price).toLocaleString('en-IN')}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          {property.bhk && (
                            <Chip
                              label={`${property.bhk} BHK`}
                              size="small"
                              variant="outlined"
                            />
                          )}
                          {property.area && (
                            <Chip
                              label={`${property.area} ${property.areaUnit}`}
                              size="small"
                              variant="outlined"
                            />
                          )}
                          {property.numberOfRooms && (
                            <Chip
                              label={`${property.numberOfRooms} Rooms`}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      </CardContent>
                      {canManageLeads && (
                        <CardActions sx={{ p: 2, pt: 0 }}>
                          <Button
                            size="small"
                            variant="contained"
                            fullWidth
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/create-lead/${property.id}`);
                            }}
                          >
                            Create Lead
                          </Button>
                        </CardActions>
                      )}
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default HomeScreen;
