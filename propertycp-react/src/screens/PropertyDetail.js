import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  IconButton,
  CircularProgress,
  Chip,
  Grid,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import {
  ArrowBack,
  Favorite,
  FavoriteBorder,
  Phone,
  WhatsApp,
  Edit,
  Delete,
  LocationOn,
  Home as HomeIcon,
  AspectRatio,
  PlayCircle,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const PropertyDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, canManageLeads, canManageProperties } = useAuth();
  const { fetchPropertyById, addFavorite, removeFavorite, isFavorite, deleteProperty } = useData();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    loadProperty();
  }, [id]);

  const loadProperty = async () => {
    setLoading(true);
    try {
      const data = await fetchPropertyById(parseInt(id));
      setProperty(data);
      // Check if property is favorited
      const favStatus = await isFavorite(user.id, data.id);
      setFavorited(favStatus);
    } catch (error) {
      console.error('Error loading property:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = async () => {
    try {
      if (favorited) {
        await removeFavorite(user.id, property.id);
        setFavorited(false);
      } else {
        await addFavorite(user.id, property.id);
        setFavorited(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProperty(property.id);
      navigate('/home');
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

  const handleCall = () => {
    window.location.href = `tel:${property.builderPhoneNumber}`;
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/91${property.builderPhoneNumber}`, '_blank');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!property) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          Property not found
        </Alert>
        <Button onClick={() => navigate('/home')} sx={{ mt: 2 }}>
          Back to Home
        </Button>
      </Container>
    );
  }

  const allImages = property.images || [];
  const isOwner = user.id === property.createdById && canManageProperties;

  // Determine which image/video to display
  const currentMedia = allImages.length > 0 ? allImages[currentImageIndex] : null;
  const displayImage = currentMedia?.link || property.mainImage;
  const isVideo = currentMedia?.isVideo || false;

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
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate(-1)}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.15)',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.25)' },
              mr: 2,
            }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Property Details
          </Typography>
          <IconButton
            color="inherit"
            onClick={handleFavoriteToggle}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.15)',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.25)' },
            }}
          >
            {favorited ? (
              <Favorite sx={{ color: '#ef4444' }} />
            ) : (
              <FavoriteBorder />
            )}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4, pb: 10 }}>
        {/* Image Gallery */}
        <Card sx={{ mb: 3, overflow: 'hidden' }}>
          {isVideo ? (
            <Box
              component="video"
              src={displayImage}
              controls
              sx={{
                width: '100%',
                height: { xs: 250, sm: 400 },
                objectFit: 'cover',
                bgcolor: 'black',
              }}
            />
          ) : (
            <Box
              component="img"
              src={displayImage}
              alt={property.title}
              sx={{
                width: '100%',
                height: { xs: 250, sm: 400 },
                objectFit: 'cover',
              }}
            />
          )}
          {allImages.length > 1 && (
            <Box
              sx={{
                p: 1.5,
                display: 'flex',
                gap: 1,
                overflowX: 'auto',
              }}
            >
              {allImages.slice(0, 5).map((img, index) => (
                <Box
                  key={img.id}
                  sx={{
                    position: 'relative',
                    width: 80,
                    height: 80,
                    cursor: 'pointer',
                  }}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  {img.isVideo ? (
                    <>
                      <Box
                        component="video"
                        src={img.link}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: 1,
                          border: currentImageIndex === index ? '2px solid' : '1px solid',
                          borderColor: currentImageIndex === index ? 'primary.main' : 'divider',
                          opacity: currentImageIndex === index ? 1 : 0.6,
                          '&:hover': { opacity: 1 },
                          bgcolor: 'black',
                        }}
                      />
                      <PlayCircle
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          fontSize: 32,
                          color: 'white',
                          pointerEvents: 'none',
                          opacity: 0.9,
                        }}
                      />
                    </>
                  ) : (
                    <Box
                      component="img"
                      src={img.link}
                      alt={`Property ${index + 1}`}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: 1,
                        border: currentImageIndex === index ? '2px solid' : '1px solid',
                        borderColor: currentImageIndex === index ? 'primary.main' : 'divider',
                        opacity: currentImageIndex === index ? 1 : 0.6,
                        '&:hover': { opacity: 1 },
                      }}
                    />
                  )}
                </Box>
              ))}
            </Box>
          )}
        </Card>

        {/* Property Information */}
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h5" fontWeight="700" gutterBottom>
                  {property.title}
                </Typography>
                {property.subTitle && (
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    {property.subTitle}
                  </Typography>
                )}
              </Box>
              <Chip
                label={property.type}
                color={property.type === 'Residential' ? 'primary' : 'secondary'}
                sx={{ fontWeight: 600 }}
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocationOn fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {property.location}, {property.city}
              </Typography>
            </Box>

            <Typography variant="h4" color="primary.main" fontWeight="700" gutterBottom>
              ₹{parseInt(property.price).toLocaleString('en-IN')}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={1.5}>
              {property.bhk && (
                <Grid item xs={4}>
                  <Box
                    sx={{
                      textAlign: 'center',
                      p: 1.5,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                    }}
                  >
                    <HomeIcon sx={{ fontSize: 32, color: 'primary.main', mb: 0.5 }} />
                    <Typography variant="h6" fontWeight="700">
                      {property.bhk}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      BHK
                    </Typography>
                  </Box>
                </Grid>
              )}
              {property.numberOfRooms && (
                <Grid item xs={4}>
                  <Box
                    sx={{
                      textAlign: 'center',
                      p: 1.5,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                    }}
                  >
                    <HomeIcon sx={{ fontSize: 32, color: 'primary.main', mb: 0.5 }} />
                    <Typography variant="h6" fontWeight="700">
                      {property.numberOfRooms}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Rooms
                    </Typography>
                  </Box>
                </Grid>
              )}
              {property.area && (
                <Grid item xs={4}>
                  <Box
                    sx={{
                      textAlign: 'center',
                      p: 1.5,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                    }}
                  >
                    <AspectRatio sx={{ fontSize: 32, color: 'primary.main', mb: 0.5 }} />
                    <Typography variant="h6" fontWeight="700">
                      {property.area}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {property.areaUnit}
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" fontWeight="600" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {property.description || 'No description available'}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" fontWeight="600" gutterBottom>
              Contact Builder
            </Typography>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                px: 2,
                py: 1,
                bgcolor: 'action.hover',
                borderRadius: 1,
                mb: 2,
              }}
            >
              <Phone sx={{ color: 'primary.main' }} />
              <Typography variant="h6" fontWeight="600">
                {property.builderPhoneNumber}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Phone />}
                onClick={handleCall}
                fullWidth
              >
                Call Now
              </Button>
              <Button
                variant="contained"
                startIcon={<WhatsApp />}
                onClick={handleWhatsApp}
                fullWidth
                sx={{
                  bgcolor: '#25D366',
                  '&:hover': { bgcolor: '#20BA5A' },
                }}
              >
                WhatsApp
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Action Buttons - Only for Agents and Admins */}
        {(canManageLeads || isOwner) && (
          <Card>
            <CardContent sx={{ p: 3 }}>
              {canManageLeads && (
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={() => navigate(`/create-lead/${property.id}`)}
                  sx={{ mb: isOwner ? 2 : 0 }}
                >
                  Create Lead for This Property
                </Button>
              )}

              {isOwner && (
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    startIcon={<Edit />}
                    onClick={() => navigate(`/edit-property-text/${property.id}`)}
                  >
                    Edit
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    Delete
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        )}
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Property?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this property? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PropertyDetail;
