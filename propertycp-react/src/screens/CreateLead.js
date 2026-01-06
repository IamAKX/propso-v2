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
  Alert,
  CircularProgress,
  CardMedia,
} from '@mui/material';
import { ArrowBack, Send } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const CreateLead = () => {
  const navigate = useNavigate();
  const { id: propertyId } = useParams();
  const { user } = useAuth();
  const { createLead, fetchPropertyById } = useData();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [propertyLoading, setPropertyLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNo: '',
    leadPropertyType: 'Buy',
    propertyType: 'Residential',
  });

  useEffect(() => {
    if (propertyId && propertyId !== 'new') {
      loadProperty();
    } else {
      setPropertyLoading(false);
    }
  }, [propertyId]);

  const loadProperty = async () => {
    setPropertyLoading(true);
    try {
      const data = await fetchPropertyById(parseInt(propertyId));
      setProperty(data);
      // Pre-fill property type from the property
      setFormData((prev) => ({
        ...prev,
        propertyType: data.type,
      }));
    } catch (error) {
      console.error('Error loading property:', error);
    } finally {
      setPropertyLoading(false);
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
    setError('');
    setSuccess(false);

    // Validation
    if (!formData.fullName || !formData.mobileNo) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.fullName.length < 3) {
      setError('Name must be at least 3 characters');
      return;
    }

    if (formData.mobileNo.length !== 10 || !/^\d+$/.test(formData.mobileNo)) {
      setError('Mobile number must be exactly 10 digits');
      return;
    }

    setLoading(true);
    try {
      const leadData = {
        ...formData,
        createdById: user.id,
        propertyId: propertyId && propertyId !== 'new' ? parseInt(propertyId) : null,
        status: 'Open',
      };

      await createLead(leadData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/home', { state: { tab: 1 } }); // Navigate to Leads tab
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to create lead. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (propertyLoading) {
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
            Create Lead
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 3, pb: 10 }}>
        {/* Property Information (if applicable) */}
        {property && (
          <Card sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, p: 2 }}>
              <CardMedia
                component="img"
                sx={{ width: 100, height: 100, borderRadius: 1 }}
                image={property.mainImage}
                alt={property.title}
              />
              <Box>
                <Typography variant="h6" fontWeight="600">
                  {property.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {property.location}, {property.city}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                  ₹{parseInt(property.price).toLocaleString('en-IN')}
                </Typography>
              </Box>
            </Box>
          </Card>
        )}

        {/* Create Lead Form */}
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom fontWeight="600">
              Customer Details
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Enter the customer information to create a new lead
            </Typography>

            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Lead created successfully! Redirecting...
              </Alert>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Customer Name *"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                margin="normal"
                placeholder="Enter full name"
              />

              <TextField
                fullWidth
                label="Mobile Number *"
                name="mobileNo"
                value={formData.mobileNo}
                onChange={handleChange}
                margin="normal"
                placeholder="10-digit mobile number"
                inputProps={{ maxLength: 10 }}
              />

              <TextField
                fullWidth
                select
                label="Lead Type *"
                name="leadPropertyType"
                value={formData.leadPropertyType}
                onChange={handleChange}
                margin="normal"
                helperText="What is the customer looking for?"
              >
                <MenuItem value="Buy">Buy Property</MenuItem>
                <MenuItem value="Rent">Rent Property</MenuItem>
                <MenuItem value="Sell">Sell Property</MenuItem>
              </TextField>

              <TextField
                fullWidth
                select
                label="Property Type *"
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
                margin="normal"
                disabled={property !== null}
              >
                <MenuItem value="Residential">Residential</MenuItem>
                <MenuItem value="Commercial">Commercial</MenuItem>
              </TextField>

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={loading || success}
                startIcon={loading ? <CircularProgress size={20} /> : <Send />}
                sx={{ mt: 3, py: 1.5 }}
              >
                {loading ? 'Creating Lead...' : 'Create Lead'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Information Card */}
        <Card sx={{ mt: 3, bgcolor: 'info.lighter' }}>
          <CardContent>
            <Typography variant="body2" color="info.dark">
              <strong>Note:</strong> After creating the lead, you can add follow-up comments,
              track the status, and manage all your leads from the Leads tab.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default CreateLead;
