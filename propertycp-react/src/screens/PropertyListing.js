import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  IconButton,
  Chip,
  AppBar,
  Toolbar,
  TextField,
  MenuItem,
} from '@mui/material';
import { ArrowBack, Favorite, FavoriteBorder, LocationOn, Search } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { CITIES, PROPERTY_TYPES } from '../constants';

const PropertyListing = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, canManageLeads } = useAuth();
  const { fetchProperties, addFavorite, removeFavorite, fetchFavorites } = useData();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCity, setSearchCity] = useState(searchParams.get('city') || '');
  const [propertyType, setPropertyType] = useState(searchParams.get('type') || 'All');
  const [favoriteIds, setFavoriteIds] = useState(new Set());

  useEffect(() => {
    loadProperties();
    loadFavorites();
  }, []);

  const loadProperties = async () => {
    setLoading(true);
    try {
      const city = searchCity || null;
      const type = propertyType === 'All' ? null : propertyType;
      const data = await fetchProperties(city, type);
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

  const handleSearch = () => {
    loadProperties();
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
    <Box>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate(-1)}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Property Listings
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 3, pb: 10 }}>
        {/* Search Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={5}>
                <TextField
                  fullWidth
                  select
                  label="City"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                >
                  <MenuItem value="">All Cities</MenuItem>
                  {CITIES.map((city) => (
                    <MenuItem key={city} value={city}>
                      {city}
                    </MenuItem>
                  ))}
                </TextField>
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
                  {PROPERTY_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" fontWeight="600">
                {properties.length} {properties.length === 1 ? 'Property' : 'Properties'} Found
              </Typography>
            </Box>

            {properties.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary">
                  No properties found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Try adjusting your search criteria
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate('/home')}
                  sx={{ mt: 3 }}
                >
                  Back to Home
                </Button>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {properties.map((property) => (
                  <Grid item xs={12} sm={6} md={4} key={property.id}>
                    <Card
                      sx={{
                        cursor: 'pointer',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          transition: 'all 0.3s',
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
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                            '&:hover': { bgcolor: 'rgba(255, 255, 255, 1)' },
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
                          }}
                        />
                      </Box>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" noWrap gutterBottom>
                          {property.title}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <LocationOn fontSize="small" color="action" sx={{ mr: 0.5 }} />
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {property.location}, {property.city}
                          </Typography>
                        </Box>
                        <Typography variant="h6" color="primary" gutterBottom>
                          ₹{parseInt(property.price).toLocaleString('en-IN')}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {property.bhk && (
                            <Chip label={`${property.bhk} BHK`} size="small" variant="outlined" />
                          )}
                          {property.area && (
                            <Chip
                              label={`${property.area} ${property.areaUnit}`}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      </CardContent>
                      {canManageLeads && (
                        <CardActions sx={{ px: 2, pb: 2 }}>
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

export default PropertyListing;
