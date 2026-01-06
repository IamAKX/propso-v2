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
  TextField,
  MenuItem,
  Grid,
  Alert,
} from '@mui/material';
import { ArrowBack, Person, ArrowForward } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const UserList = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { fetchAllUsers } = useData();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isAdmin) {
      navigate('/home');
      return;
    }
    loadUsers();
  }, [isAdmin]);

  useEffect(() => {
    applyFilters();
  }, [users, statusFilter, typeFilter, searchQuery]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...users];

    // Status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter((u) => u.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== 'All') {
      filtered = filtered.filter((u) => u.userType === typeFilter);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.fullName.toLowerCase().includes(query) ||
          u.email.toLowerCase().includes(query) ||
          u.mobileNo.includes(query)
      );
    }

    setFilteredUsers(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'CREATED':
        return 'info';
      case 'SUSPENDED':
        return 'error';
      default:
        return 'default';
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
            All Users
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 3, pb: 10 }}>
        {/* Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Search"
                  placeholder="Search by name, email, or phone"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  select
                  label="Status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="All">All Status</MenuItem>
                  <MenuItem value="CREATED">Created</MenuItem>
                  <MenuItem value="PENDING">Pending</MenuItem>
                  <MenuItem value="ACTIVE">Active</MenuItem>
                  <MenuItem value="SUSPENDED">Suspended</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  select
                  label="User Type"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <MenuItem value="All">All Types</MenuItem>
                  <MenuItem value="Agent">Agent</MenuItem>
                  <MenuItem value="Buyer">Buyer</MenuItem>
                  <MenuItem value="Admin">Admin</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Statistics */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary" fontWeight="600">
                  {users.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Users
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="success.main" fontWeight="600">
                  {users.filter((u) => u.status === 'ACTIVE').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="warning.main" fontWeight="600">
                  {users.filter((u) => u.status === 'PENDING').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pending
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="info.main" fontWeight="600">
                  {users.filter((u) => u.status === 'CREATED').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Created
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Users List */}
        {filteredUsers.length === 0 ? (
          <Alert severity="info">
            No users found matching your criteria
          </Alert>
        ) : (
          <>
            <Typography variant="h6" gutterBottom fontWeight="600">
              Users ({filteredUsers.length})
            </Typography>
            {filteredUsers.map((userData) => (
              <Card
                key={userData.id}
                sx={{
                  mb: 2,
                  cursor: 'pointer',
                  '&:hover': {
                    boxShadow: 3,
                    transform: 'translateY(-2px)',
                    transition: 'all 0.3s',
                  },
                }}
                onClick={() => navigate(`/user-detail/${userData.id}`)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                        {userData.fullName.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" fontWeight="600">
                          {userData.fullName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {userData.email}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {userData.mobileNo}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                          <Chip
                            label={userData.userType}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                          <Chip
                            label={userData.status}
                            size="small"
                            color={getStatusColor(userData.status)}
                          />
                          {userData.isKycVerified && (
                            <Chip label="KYC Verified" size="small" color="success" variant="outlined" />
                          )}
                        </Box>
                      </Box>
                    </Box>
                    <IconButton>
                      <ArrowForward />
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

export default UserList;
