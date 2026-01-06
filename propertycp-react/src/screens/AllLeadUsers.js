import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Avatar,
  Chip,
  Grid,
  Alert,
} from '@mui/material';
import { ArrowBack, ArrowForward, Assignment } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const AllLeadUsers = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { fetchAllUsers, fetchLeads } = useData();
  const [usersWithLeads, setUsersWithLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/home');
      return;
    }
    loadUsersWithLeads();
  }, [isAdmin]);

  const loadUsersWithLeads = async () => {
    setLoading(true);
    try {
      const users = await fetchAllUsers();

      // Get leads for each user
      const usersWithLeadCounts = await Promise.all(
        users.map(async (user) => {
          try {
            const leads = await fetchLeads(user.id);
            const openLeads = leads.filter((lead) => lead.status === 'Open').length;
            const closedLeads = leads.filter((lead) => lead.status === 'Closed').length;
            return {
              ...user,
              totalLeads: leads.length,
              openLeads,
              closedLeads,
            };
          } catch (error) {
            return {
              ...user,
              totalLeads: 0,
              openLeads: 0,
              closedLeads: 0,
            };
          }
        })
      );

      // Filter users who have at least one lead and sort by total leads
      const usersWithLeadsOnly = usersWithLeadCounts
        .filter((user) => user.totalLeads > 0)
        .sort((a, b) => b.totalLeads - a.totalLeads);

      setUsersWithLeads(usersWithLeadsOnly);
    } catch (error) {
      console.error('Error loading users with leads:', error);
    } finally {
      setLoading(false);
    }
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

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate(-1)}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            All Lead Users
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 3, pb: 10 }}>
        {/* Summary Card */}
        <Card sx={{ mb: 3, bgcolor: 'primary.lighter' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom fontWeight="600" color="primary.dark">
              Lead Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Typography variant="h4" color="primary" fontWeight="600">
                  {usersWithLeads.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Users with Leads
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="h4" color="primary" fontWeight="600">
                  {usersWithLeads.reduce((sum, user) => sum + user.totalLeads, 0)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Leads
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="h4" color="success.main" fontWeight="600">
                  {usersWithLeads.reduce((sum, user) => sum + user.openLeads, 0)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Open Leads
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="h4" color="text.secondary" fontWeight="600">
                  {usersWithLeads.reduce((sum, user) => sum + user.closedLeads, 0)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Closed Leads
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Users List */}
        {usersWithLeads.length === 0 ? (
          <Alert severity="info">
            No users with leads found
          </Alert>
        ) : (
          <>
            <Typography variant="h6" gutterBottom fontWeight="600">
              Users ({usersWithLeads.length})
            </Typography>
            {usersWithLeads.map((user) => (
              <Card
                key={user.id}
                sx={{
                  mb: 2,
                  cursor: 'pointer',
                  '&:hover': {
                    boxShadow: 3,
                    transform: 'translateY(-2px)',
                    transition: 'all 0.3s',
                  },
                }}
                onClick={() => navigate(`/admin-lead-list/${user.id}`)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                        {user.fullName.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="600">
                          {user.fullName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {user.email}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                          <Chip
                            label={user.userType}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </Box>
                      </Box>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                        <Box>
                          <Typography variant="h5" color="primary" fontWeight="600">
                            {user.totalLeads}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Total
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="h5" color="success.main" fontWeight="600">
                            {user.openLeads}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Open
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="h5" color="text.secondary" fontWeight="600">
                            {user.closedLeads}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Closed
                          </Typography>
                        </Box>
                      </Box>
                      <IconButton size="small">
                        <ArrowForward />
                      </IconButton>
                    </Box>
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

export default AllLeadUsers;
