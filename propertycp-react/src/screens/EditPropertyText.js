import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  IconButton,
  MenuItem,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import { ArrowBack, Save } from '@mui/icons-material';
import { useData } from '../context/DataContext';

const EditPropertyText = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { fetchPropertyById, updateProperty } = useData();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subTitle: '',
    price: '',
    numberOfRooms: '',
    bhk: '',
    location: '',
    city: '',
    type: 'Residential',
    area: '',
    areaUnit: 'Sqft',
    description: '',
    builderPhoneNumber: '',
  });

  useEffect(() => {
    loadProperty();
  }, [id]);

  const loadProperty = async () => {
    setLoading(true);
    try {
      const property = await fetchPropertyById(parseInt(id));
      setFormData({
        title: property.title || '',
        subTitle: property.subTitle || '',
        price: property.price || '',
        numberOfRooms: property.numberOfRooms || '',
        bhk: property.bhk || '',
        location: property.location || '',
        city: property.city || '',
        type: property.type || 'Residential',
        area: property.area || '',
        areaUnit: property.areaUnit || 'Sqft',
        description: property.description || '',
        builderPhoneNumber: property.builderPhoneNumber || '',
      });
    } catch (error) {
      setError('Failed to load property');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProperty(parseInt(id), formData);
      setSuccess(true);
      setTimeout(() => {
        navigate(`/property/${id}`);
      }, 1500);
    } catch (err) {
      setError('Failed to update property');
    } finally {
      setSaving(false);
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
          <IconButton edge="start" color="inherit" onClick={() => navigate(-1)}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Edit Property Details
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 3, pb: 10 }}>
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Property updated successfully!
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Card>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Property Title *"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Subtitle"
                    name="subTitle"
                    value={formData.subTitle}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Property Type *"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                  >
                    <MenuItem value="Residential">Residential</MenuItem>
                    <MenuItem value="Commercial">Commercial</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Price *"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="City *"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Location *"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={saving}
                    startIcon={saving ? <CircularProgress size={20} /> : <Save />}
                    sx={{ mt: 2 }}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default EditPropertyText;
