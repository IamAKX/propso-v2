import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import { Favorite, LocationOn, FavoriteBorder } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const FavoriteScreen = ({ onNavigateToHome }) => {
  const navigate = useNavigate();
  const { user, canManageLeads } = useAuth();
  const { fetchFavorites, removeFavorite, isFavorite } = useData();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const data = await fetchFavorites(user.id);
      setProperties(data);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (e, propertyId) => {
    e.stopPropagation();
    try {
      await removeFavorite(user.id, propertyId);
      // Reload favorites after removal
      loadFavorites();
    } catch (error) {
      console.error('Error removing favorite:', error);
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
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Favorite sx={{ mr: 2 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            My Favorites
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 3, pb: 10 }}>
        {properties.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '60vh',
              textAlign: 'center',
            }}
          >
            <FavoriteBorder sx={{ fontSize: 100, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h5" color="text.secondary" gutterBottom>
              No Favorites Yet
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Start adding properties to your favorites to see them here
            </Typography>
            <Button variant="contained" onClick={onNavigateToHome}>
              Browse Properties
            </Button>
          </Box>
        ) : (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" fontWeight="600">
                Saved Properties
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {properties.length} {properties.length === 1 ? 'property' : 'properties'}
              </Typography>
            </Box>

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
                        onClick={(e) => handleRemoveFavorite(e, property.id)}
                      >
                        <Favorite color="error" />
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
          </>
        )}
      </Container>
    </Box>
  );
};

export default FavoriteScreen;
