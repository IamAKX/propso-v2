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
  CircularProgress,
  Chip,
  Avatar,
  Divider,
  Grid,
  Alert,
} from '@mui/material';
import { ArrowBack, Phone, WhatsApp, Comment, ArrowForward } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const AdminLeadList = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { isAdmin } = useAuth();
  const { fetchUserById, fetchLeads } = useData();
  const [user, setUser] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/home');
      return;
    }
    loadUserAndLeads();
  }, [userId, isAdmin]);

  const loadUserAndLeads = async () => {
    setLoading(true);
    try {
      const userData = await fetchUserById(parseInt(userId));
      setUser(userData);

      const leadsData = await fetchLeads(parseInt(userId));
      setLeads(leadsData);
    } catch (error) {
      console.error('Error loading user and leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCall = (e, mobileNo) => {
    e.stopPropagation();
    window.location.href = `tel:${mobileNo}`;
  };

  const handleWhatsApp = (e, mobileNo) => {
    e.stopPropagation();
    window.open(`https://wa.me/91${mobileNo}`, '_blank');
  };

  if (!isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          User not found
        </Alert>
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
            User's Leads
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 3, pb: 10 }}>
        {/* User Info Card */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 60, height: 60, fontSize: '1.5rem' }}>
                {user.fullName.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h5" fontWeight="600">
                  {user.fullName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.email} • {user.mobileNo}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <Chip label={user.userType} size="small" color="primary" variant="outlined" />
                  <Chip label={user.status} size="small" />
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Statistics */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary" fontWeight="600">
                  {leads.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Leads
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="success.main" fontWeight="600">
                  {leads.filter((l) => l.status === 'Open').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Open
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="text.secondary" fontWeight="600">
                  {leads.filter((l) => l.status === 'Closed').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Closed
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Leads List */}
        {leads.length === 0 ? (
          <Alert severity="info">
            This user has no leads yet
          </Alert>
        ) : (
          <>
            <Typography variant="h6" gutterBottom fontWeight="600">
              Leads ({leads.length})
            </Typography>
            {leads.map((lead) => (
              <Card
                key={lead.id}
                sx={{
                  mb: 2,
                  transition: 'all 0.2s',
                  '&:hover': {
                    boxShadow: 3,
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'secondary.main', width: 48, height: 48 }}>
                        {lead.fullName.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="600">
                          {lead.fullName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {lead.mobileNo}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip
                      label={lead.status}
                      size="small"
                      color={lead.status === 'Open' ? 'success' : 'default'}
                    />
                  </Box>

                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Lead Type
                      </Typography>
                      <Typography variant="body2" fontWeight="600">
                        {lead.leadPropertyType}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Property Type
                      </Typography>
                      <Typography variant="body2" fontWeight="600">
                        {lead.propertyType}
                      </Typography>
                    </Grid>
                  </Grid>

                  {lead.leadCommentModel && lead.leadCommentModel.length > 0 && (
                    <>
                      <Divider sx={{ my: 1 }} />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Comment fontSize="small" color="action" />
                        <Typography variant="caption" color="text.secondary">
                          {lead.leadCommentModel.length}{' '}
                          {lead.leadCommentModel.length === 1 ? 'comment' : 'comments'}
                        </Typography>
                      </Box>
                    </>
                  )}

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={(e) => handleCall(e, lead.mobileNo)}
                      sx={{ bgcolor: 'primary.light', '&:hover': { bgcolor: 'primary.main', color: 'white' } }}
                    >
                      <Phone fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="success"
                      onClick={(e) => handleWhatsApp(e, lead.mobileNo)}
                      sx={{ bgcolor: 'success.light', '&:hover': { bgcolor: 'success.main', color: 'white' } }}
                    >
                      <WhatsApp fontSize="small" />
                    </IconButton>
                    <Box sx={{ flexGrow: 1 }} />
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/lead-comment/${lead.id}`);
                      }}
                      sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        '&:hover': { bgcolor: 'primary.dark' },
                      }}
                    >
                      <ArrowForward fontSize="small" />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </>
        )}
      </Container>
    </Box>
  );
};

export default AdminLeadList;
