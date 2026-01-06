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
  Grid,
  Paper,
  CircularProgress,
} from '@mui/material';
import { ArrowBack, CloudUpload, Delete } from '@mui/icons-material';
import { useData } from '../context/DataContext';

const EditPropertyImage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { fetchPropertyById } = useData();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);

  useEffect(() => {
    loadProperty();
  }, [id]);

  const loadProperty = async () => {
    setLoading(true);
    try {
      const data = await fetchPropertyById(parseInt(id));
      setProperty(data);
      setImages(data.images || []);
    } catch (error) {
      console.error('Error loading property:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddImages = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file, index) => ({
      id: Date.now() + index,
      link: URL.createObjectURL(file),
      isVideo: false,
      propertyId: parseInt(id),
    }));
    setImages([...images, ...newImages]);
  };

  const handleDeleteImage = (imageId) => {
    setImages(images.filter((img) => img.id !== imageId));
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
          <IconButton edge="start" color="inherit" onClick={() => navigate(-1)}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Edit Property Images
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 3, pb: 10 }}>
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom fontWeight="600">
              Property Images
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Manage images for {property?.title}
            </Typography>

            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUpload />}
              fullWidth
              sx={{ mb: 3 }}
            >
              Add More Images
              <input
                type="file"
                hidden
                accept="image/*"
                multiple
                onChange={handleAddImages}
              />
            </Button>

            <Grid container spacing={2}>
              {images.map((img) => (
                <Grid item xs={6} sm={4} key={img.id}>
                  <Paper elevation={2} sx={{ position: 'relative' }}>
                    <Box
                      component="img"
                      src={img.link}
                      alt={`Property ${img.id}`}
                      sx={{ width: '100%', height: 150, objectFit: 'cover' }}
                    />
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteImage(img.id)}
                      sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        bgcolor: 'white',
                        '&:hover': { bgcolor: 'error.light' },
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            <Button
              fullWidth
              variant="contained"
              onClick={() => navigate(`/property/${id}`)}
              sx={{ mt: 3 }}
            >
              Done
            </Button>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default EditPropertyImage;
