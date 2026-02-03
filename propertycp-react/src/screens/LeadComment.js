import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  TextField,
  Chip,
  Avatar,
  Divider,
  CircularProgress,
  Alert,
  Grid,
  Paper,
} from '@mui/material';
import {
  ArrowBack,
  Phone,
  WhatsApp,
  Send,
  Person,
  CheckCircle,
  Cancel,
  ArrowForward,
  Home as HomeIcon,
  Visibility,
  LocationOn,
  BedroomParent,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const LeadComment = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { fetchLeadById, addLeadComment, updateLead, fetchPropertyById } = useData();
  const [lead, setLead] = useState(null);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadLead();
  }, [id]);

  const loadLead = async () => {
    setLoading(true);
    try {
      const data = await fetchLeadById(parseInt(id));
      setLead(data);

      // Fetch associated property if propertyId exists
      if (data.propertyId) {
        try {
          const propertyData = await fetchPropertyById(data.propertyId);
          setProperty(propertyData);
        } catch (propError) {
          console.error('Error loading property:', propError);
        }
      }
    } catch (error) {
      console.error('Error loading lead:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;

    setSubmitting(true);
    try {
      await addLeadComment(lead.id, comment.trim());
      setComment('');
      // Reload lead to get updated comments
      await loadLead();
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await updateLead(lead.id, { status: newStatus });
      await loadLead();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleCall = () => {
    window.location.href = `tel:${lead.mobileNo}`;
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/91${lead.mobileNo}`, '_blank');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!lead) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          Lead not found
        </Alert>
        <Button onClick={() => navigate('/home')} sx={{ mt: 2 }}>
          Back to Home
        </Button>
      </Container>
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
            Lead Details
          </Typography>
          <Chip
            label={lead.status}
            size="small"
            color={lead.status === 'Open' ? 'success' : 'default'}
            sx={{ color: 'white' }}
          />
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 3, pb: 10 }}>
        {/* Customer Information */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 60, height: 60, fontSize: '1.5rem' }}>
                {lead.fullName.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h5" fontWeight="600">
                  {lead.fullName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {lead.mobileNo}
                </Typography>
              </Box>
            </Box>

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">
                  Lead Type
                </Typography>
                <Typography variant="body1" fontWeight="600">
                  {lead.leadPropertyType}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">
                  Property Type
                </Typography>
                <Typography variant="body1" fontWeight="600">
                  {lead.propertyType}
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Phone />}
                onClick={handleCall}
                fullWidth
              >
                Call Customer
              </Button>
              <Button
                variant="contained"
                color="success"
                startIcon={<WhatsApp />}
                onClick={handleWhatsApp}
                fullWidth
              >
                WhatsApp
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Associated Property */}
        {property ? (
          <Card
            sx={{
              mb: 3,
              border: '2px solid',
              borderColor: 'primary.light',
              position: 'relative',
              overflow: 'visible',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <HomeIcon sx={{ color: 'primary.main' }} />
                <Typography variant="h6" fontWeight="600">
                  Associated Property
                </Typography>
                <Chip label="Linked" size="small" color="primary" variant="outlined" />
              </Box>

              <Box
                component="img"
                src={property.mainImage}
                alt={property.title}
                sx={{
                  width: '100%',
                  height: 200,
                  borderRadius: 2,
                  objectFit: 'cover',
                  mb: 2,
                }}
              />

              <Typography variant="h5" fontWeight="700" gutterBottom>
                {property.title}
              </Typography>

              {property.subTitle && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {property.subTitle}
                </Typography>
              )}

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <LocationOn fontSize="small" color="action" />
                <Typography variant="body1" color="text.secondary">
                  {property.location}, {property.city}
                </Typography>
              </Box>

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={4}>
                  <Typography variant="caption" color="text.secondary">
                    Type
                  </Typography>
                  <Typography variant="body2" fontWeight="600">
                    {property.type}
                  </Typography>
                </Grid>
                {property.bhk && (
                  <Grid item xs={4}>
                    <Typography variant="caption" color="text.secondary">
                      BHK
                    </Typography>
                    <Typography variant="body2" fontWeight="600">
                      {property.bhk}
                    </Typography>
                  </Grid>
                )}
                {property.area && (
                  <Grid item xs={4}>
                    <Typography variant="caption" color="text.secondary">
                      Area
                    </Typography>
                    <Typography variant="body2" fontWeight="600">
                      {property.area} {property.areaUnit || 'Sqft'}
                    </Typography>
                  </Grid>
                )}
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Price
                  </Typography>
                  <Typography variant="h5" color="primary.main" fontWeight="700">
                    ₹{parseInt(property.price).toLocaleString('en-IN')}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<Visibility />}
                  onClick={() => navigate(`/property/${property.id}`)}
                  sx={{
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  View Property Details
                </Button>
              </Box>
            </CardContent>
          </Card>
        ) : (
          lead.propertyId && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              The property associated with this lead is no longer available (may have been deleted or is not approved).
            </Alert>
          )
        )}

        {/* Status Management */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom fontWeight="600">
              Lead Status
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant={lead.status === 'Open' ? 'contained' : 'outlined'}
                color="success"
                startIcon={<CheckCircle />}
                onClick={() => handleStatusChange('Open')}
                fullWidth
              >
                Mark as Open
              </Button>
              <Button
                variant={lead.status === 'Closed' ? 'contained' : 'outlined'}
                color="error"
                startIcon={<Cancel />}
                onClick={() => handleStatusChange('Closed')}
                fullWidth
              >
                Mark as Closed
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom fontWeight="600">
              Follow-up Comments
            </Typography>

            {/* Comments Timeline */}
            {lead.leadCommentModel && lead.leadCommentModel.length > 0 ? (
              <Box sx={{ mt: 2 }}>
                {lead.leadCommentModel.map((commentItem, index) => (
                  <Paper
                    key={commentItem.id}
                    elevation={0}
                    sx={{
                      p: 2,
                      mb: 2,
                      bgcolor: 'grey.50',
                      borderLeft: '4px solid',
                      borderColor: 'primary.main',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'start', gap: 1, mb: 1 }}>
                      <Person fontSize="small" color="action" />
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                          <Typography variant="body2" fontWeight="600" color="text.primary">
                            {commentItem.createdByName || 'Unknown User'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {format(new Date(commentItem.createdDate), 'MMM dd, yyyy • hh:mm a')}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Typography variant="body1" sx={{ pl: 3 }}>
                      {commentItem.comment}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            ) : (
              <Alert severity="info" sx={{ mt: 2 }}>
                No comments yet. Add your first follow-up comment below.
              </Alert>
            )}

            {/* Add Comment */}
            <Box sx={{ mt: 3 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Add a comment"
                placeholder="Enter follow-up notes, meeting details, customer feedback, etc."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={submitting}
              />
              <Button
                fullWidth
                variant="contained"
                onClick={handleAddComment}
                disabled={!comment.trim() || submitting}
                startIcon={submitting ? <CircularProgress size={20} /> : <Send />}
                sx={{ mt: 2 }}
              >
                {submitting ? 'Adding Comment...' : 'Add Comment'}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Information Card */}
        <Card sx={{ bgcolor: 'info.lighter' }}>
          <CardContent>
            <Typography variant="body2" color="info.dark">
              <strong>Tip:</strong> Keep your lead updated with regular comments to track your
              follow-ups and maintain a complete history of customer interactions.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default LeadComment;
