import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  AppBar,
  Toolbar,
  IconButton,
  CircularProgress,
  Chip,
  TextField,
  MenuItem,
  Grid,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  ArrowBack,
  CheckCircle,
  Cancel,
  LocationOn,
  Home as HomeIcon,
  Delete,
  Sell,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const PropertyApprovalList = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('Pending');
  const [cityFilter, setCityFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    type: null,
    propertyId: null,
    propertyTitle: '',
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/home');
      return;
    }
    loadProperties();
  }, [isAdmin]);

  useEffect(() => {
    applyFilters();
  }, [properties, statusFilter, cityFilter, typeFilter]);

  const loadProperties = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.getAllPropertiesForAdmin();
      if (response.success) {
        setProperties(response.data);
      } else {
        setError(response.message || 'Failed to load properties');
      }
    } catch (error) {
      console.error('Error loading properties:', error);
      setError(error.message || 'Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...properties];

    // Status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter((p) => p.approved === statusFilter);
    }

    // City filter
    if (cityFilter !== 'All') {
      filtered = filtered.filter((p) => p.city === cityFilter);
    }

    // Type filter
    if (typeFilter !== 'All') {
      filtered = filtered.filter((p) => p.type === typeFilter);
    }

    setFilteredProperties(filtered);
  };

  const handleApprove = async (propertyId) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await api.approveProperty(propertyId);
      if (response.success) {
        setSuccess('Property approved successfully');
        loadProperties();
      } else {
        setError(response.message || 'Failed to approve property');
      }
    } catch (error) {
      console.error('Error approving property:', error);
      setError(error.message || 'Failed to approve property');
    } finally {
      setLoading(false);
      setConfirmDialog({ open: false, type: null, propertyId: null, propertyTitle: '' });
    }
  };

  const handleReject = async (propertyId) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await api.rejectProperty(propertyId);
      if (response.success) {
        setSuccess('Property rejected and deleted successfully');
        loadProperties();
      } else {
        setError(response.message || 'Failed to reject property');
      }
    } catch (error) {
      console.error('Error rejecting property:', error);
      setError(error.message || 'Failed to reject property');
    } finally {
      setLoading(false);
      setConfirmDialog({ open: false, type: null, propertyId: null, propertyTitle: '' });
    }
  };

  const handleMarkAsSold = async (propertyId) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await api.markPropertyAsSold(propertyId);
      if (response.success) {
        setSuccess('Property marked as sold successfully');
        loadProperties();
      } else {
        setError(response.message || 'Failed to mark property as sold');
      }
    } catch (error) {
      console.error('Error marking property as sold:', error);
      setError(error.message || 'Failed to mark property as sold');
    } finally {
      setLoading(false);
      setConfirmDialog({ open: false, type: null, propertyId: null, propertyTitle: '' });
    }
  };

  const handleDelete = async (propertyId) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await api.deletePropertyAdmin(propertyId);
      if (response.success) {
        setSuccess('Property and all related data deleted successfully');
        loadProperties();
      } else {
        setError(response.message || 'Failed to delete property');
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      setError(error.message || 'Failed to delete property');
    } finally {
      setLoading(false);
      setConfirmDialog({ open: false, type: null, propertyId: null, propertyTitle: '' });
    }
  };

  const openConfirmDialog = (type, propertyId, propertyTitle) => {
    setConfirmDialog({ open: true, type, propertyId, propertyTitle });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({ open: false, type: null, propertyId: null, propertyTitle: '' });
  };

  const handleConfirmAction = () => {
    if (confirmDialog.type === 'approve') {
      handleApprove(confirmDialog.propertyId);
    } else if (confirmDialog.type === 'reject') {
      handleReject(confirmDialog.propertyId);
    } else if (confirmDialog.type === 'sold') {
      handleMarkAsSold(confirmDialog.propertyId);
    } else if (confirmDialog.type === 'delete') {
      handleDelete(confirmDialog.propertyId);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Rejected':
        return 'error';
      case 'Sold':
        return 'info';
      default:
        return 'default';
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* App Bar */}
      <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate(-1)}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
            Property Approvals
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Alerts */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        {/* Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  select
                  fullWidth
                  label="Status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Approved">Approved</MenuItem>
                  <MenuItem value="Sold">Sold</MenuItem>
                  <MenuItem value="Rejected">Rejected</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  select
                  fullWidth
                  label="City"
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                >
                  <MenuItem value="All">All Cities</MenuItem>
                  <MenuItem value="Bangalore">Bangalore</MenuItem>
                  <MenuItem value="Hyderabad">Hyderabad</MenuItem>
                  <MenuItem value="Mumbai">Mumbai</MenuItem>
                  <MenuItem value="Chennai">Chennai</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  select
                  fullWidth
                  label="Type"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <MenuItem value="All">All Types</MenuItem>
                  <MenuItem value="Rent">Rent</MenuItem>
                  <MenuItem value="Plot">Plot</MenuItem>
                  <MenuItem value="Flat">Flat</MenuItem>
                  <MenuItem value="Commercial">Commercial</MenuItem>
                  <MenuItem value="Farmland">Farmland</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Loading */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Property List */}
        {!loading && filteredProperties.length === 0 && (
          <Card>
            <CardContent>
              <Typography variant="body1" color="text.secondary" align="center">
                No properties found
              </Typography>
            </CardContent>
          </Card>
        )}

        {!loading && filteredProperties.length > 0 && (
          <Grid container spacing={3}>
            {filteredProperties.map((property) => (
              <Grid item xs={12} key={property.id}>
                <Card
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    cursor: 'pointer',
                    '&:hover': { boxShadow: 6 },
                  }}
                >
                  {/* Property Image */}
                  <CardMedia
                    component="img"
                    sx={{
                      width: { xs: '100%', sm: 200 },
                      height: { xs: 200, sm: 'auto' },
                      objectFit: 'cover',
                    }}
                    image={property.mainImage || '/placeholder.png'}
                    alt={property.title}
                    onClick={() => navigate(`/property/${property.id}`)}
                  />

                  {/* Property Details */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <CardContent sx={{ flex: '1 0 auto' }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          mb: 1,
                        }}
                      >
                        <Typography variant="h6" component="div">
                          {property.title}
                        </Typography>
                        <Chip
                          label={property.approved}
                          color={getStatusColor(property.approved)}
                          size="small"
                        />
                      </Box>

                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                        {property.subTitle}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationOn fontSize="small" color="action" sx={{ mr: 0.5 }} />
                        <Typography variant="body2" color="text.secondary">
                          {property.location}, {property.city}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                        <Chip label={property.type} size="small" icon={<HomeIcon />} />
                        {property.bhk && <Chip label={property.bhk} size="small" />}
                        {property.area && (
                          <Chip
                            label={`${property.area} ${property.areaUnit || 'Sqft'}`}
                            size="small"
                          />
                        )}
                      </Box>

                      <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                        ₹{property.price}
                      </Typography>

                      {/* Action Buttons */}
                      {property.approved === 'Pending' && (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            variant="contained"
                            color="success"
                            startIcon={<CheckCircle />}
                            onClick={() =>
                              openConfirmDialog('approve', property.id, property.title)
                            }
                          >
                            Approve
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            startIcon={<Cancel />}
                            onClick={() =>
                              openConfirmDialog('reject', property.id, property.title)
                            }
                          >
                            Reject
                          </Button>
                        </Box>
                      )}

                      {/* Action Buttons for Approved Properties */}
                      {property.approved === 'Approved' && (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            variant="contained"
                            color="info"
                            startIcon={<Sell />}
                            onClick={() =>
                              openConfirmDialog('sold', property.id, property.title)
                            }
                          >
                            Mark as Sold
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            startIcon={<Delete />}
                            onClick={() =>
                              openConfirmDialog('delete', property.id, property.title)
                            }
                          >
                            Delete
                          </Button>
                        </Box>
                      )}
                    </CardContent>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onClose={closeConfirmDialog}>
        <DialogTitle>
          {confirmDialog.type === 'approve' && 'Approve Property'}
          {confirmDialog.type === 'reject' && 'Reject Property'}
          {confirmDialog.type === 'sold' && 'Mark Property as Sold'}
          {confirmDialog.type === 'delete' && 'Delete Property'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {confirmDialog.type === 'approve' &&
              `Are you sure you want to approve "${confirmDialog.propertyTitle}"? This will make the property visible to all users.`}
            {confirmDialog.type === 'reject' &&
              `Are you sure you want to reject "${confirmDialog.propertyTitle}"? This will permanently delete the property and all associated images from S3. This action cannot be undone.`}
            {confirmDialog.type === 'sold' &&
              `Are you sure you want to mark "${confirmDialog.propertyTitle}" as sold? This will hide the property from the home page and show it with "Sold" status in the admin panel.`}
            {confirmDialog.type === 'delete' &&
              `Are you sure you want to delete "${confirmDialog.propertyTitle}"? This will permanently delete the property, all related entries (favorites, leads), and all associated images from S3. This action cannot be undone.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmDialog} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmAction}
            color={
              confirmDialog.type === 'approve'
                ? 'success'
                : confirmDialog.type === 'sold'
                ? 'info'
                : 'error'
            }
            variant="contained"
            autoFocus
          >
            {confirmDialog.type === 'approve' && 'Approve'}
            {confirmDialog.type === 'reject' && 'Reject'}
            {confirmDialog.type === 'sold' && 'Mark as Sold'}
            {confirmDialog.type === 'delete' && 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PropertyApprovalList;
