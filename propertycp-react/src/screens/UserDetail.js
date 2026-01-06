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
  Avatar,
  Chip,
  Button,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import {
  ArrowBack,
  Email,
  Phone,
  Badge,
  CheckCircle,
  Block,
  Delete,
  CardMembership,
  AdminPanelSettings,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const UserDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user: currentUser, isAdmin, updateUserData } = useAuth();
  const { fetchUserById } = useData();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/home');
      return;
    }
    loadUser();
  }, [id, isAdmin]);

  const loadUser = async () => {
    setLoading(true);
    try {
      const data = await fetchUserById(parseInt(id));
      setUserData(data);
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveKYC = async () => {
    setActionLoading(true);
    try {
      await updateUserData(userData.id, {
        status: 'ACTIVE',
        isKycVerified: true,
      });
      await loadUser();
    } catch (error) {
      console.error('Error approving KYC:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectKYC = async () => {
    setActionLoading(true);
    try {
      await updateUserData(userData.id, {
        status: 'CREATED',
        isKycVerified: false,
      });
      await loadUser();
    } catch (error) {
      console.error('Error rejecting KYC:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSuspend = async () => {
    setActionLoading(true);
    try {
      await updateUserData(userData.id, {
        status: 'SUSPENDED',
      });
      await loadUser();
    } catch (error) {
      console.error('Error suspending user:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleActivate = async () => {
    setActionLoading(true);
    try {
      await updateUserData(userData.id, {
        status: 'ACTIVE',
      });
      await loadUser();
    } catch (error) {
      console.error('Error activating user:', error);
    } finally {
      setActionLoading(false);
    }
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

  if (!userData) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          User not found
        </Alert>
        <Button onClick={() => navigate('/user-list')} sx={{ mt: 2 }}>
          Back to User List
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
            User Details
          </Typography>
          <AdminPanelSettings />
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 3, pb: 10 }}>
        {/* User Profile Card */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: 'primary.main',
                  fontSize: '2.5rem',
                  mb: 2,
                }}
              >
                {userData.fullName.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="h5" fontWeight="600" gutterBottom>
                {userData.fullName}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                <Chip label={userData.userType} color="primary" size="small" icon={<Badge />} />
                <Chip
                  label={userData.status}
                  color={getStatusColor(userData.status)}
                  size="small"
                />
              </Box>
              {userData.isKycVerified && (
                <Chip label="KYC Verified" color="success" size="small" icon={<CheckCircle />} />
              )}
            </Box>

            <Divider sx={{ my: 2 }} />

            <List>
              <ListItem>
                <ListItemIcon>
                  <Email color="action" />
                </ListItemIcon>
                <ListItemText primary="Email" secondary={userData.email} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Phone color="action" />
                </ListItemIcon>
                <ListItemText primary="Mobile Number" secondary={userData.mobileNo} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CardMembership color="action" />
                </ListItemIcon>
                <ListItemText
                  primary="KYC Status"
                  secondary={userData.isKycVerified ? 'Verified' : 'Not Verified'}
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>

        {/* KYC Documents (if status is PENDING) */}
        {userData.status === 'PENDING' && (
          <Card sx={{ mb: 3, bgcolor: 'warning.lighter' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="600" color="warning.dark">
                KYC Documents Under Review
              </Typography>
              <Typography variant="body2" color="warning.dark" paragraph>
                This user has submitted KYC documents and is awaiting approval.
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircle />}
                    onClick={handleApproveKYC}
                    disabled={actionLoading}
                  >
                    Approve KYC
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="error"
                    startIcon={<Block />}
                    onClick={handleRejectKYC}
                    disabled={actionLoading}
                  >
                    Reject KYC
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Admin Actions */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom fontWeight="600">
              Admin Actions
            </Typography>
            <Grid container spacing={2}>
              {userData.status === 'SUSPENDED' ? (
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircle />}
                    onClick={handleActivate}
                    disabled={actionLoading}
                  >
                    Activate Account
                  </Button>
                </Grid>
              ) : (
                <>
                  {userData.status !== 'ACTIVE' && (
                    <Grid item xs={12} sm={6}>
                      <Button
                        fullWidth
                        variant="contained"
                        color="success"
                        startIcon={<CheckCircle />}
                        onClick={handleActivate}
                        disabled={actionLoading}
                      >
                        Activate Account
                      </Button>
                    </Grid>
                  )}
                  <Grid item xs={12} sm={userData.status !== 'ACTIVE' ? 6 : 12}>
                    <Button
                      fullWidth
                      variant="outlined"
                      color="warning"
                      startIcon={<Block />}
                      onClick={handleSuspend}
                      disabled={actionLoading || userData.id === currentUser.id}
                    >
                      Suspend Account
                    </Button>
                  </Grid>
                </>
              )}
            </Grid>
          </CardContent>
        </Card>

        {/* View User's Leads */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom fontWeight="600">
              User Activity
            </Typography>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate(`/admin-lead-list/${userData.id}`)}
            >
              View User's Leads
            </Button>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card sx={{ bgcolor: 'error.lighter' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom fontWeight="600" color="error.dark">
              Danger Zone
            </Typography>
            <Typography variant="body2" color="error.dark" paragraph>
              Deleting a user is permanent and cannot be undone. All their data will be removed.
            </Typography>
            <Button
              fullWidth
              variant="contained"
              color="error"
              startIcon={<Delete />}
              onClick={() => setDeleteDialogOpen(true)}
              disabled={userData.id === currentUser.id}
            >
              Delete User Account
            </Button>
          </CardContent>
        </Card>
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete User Account?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{userData.fullName}</strong>? This action
            cannot be undone and all user data will be permanently removed.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              // In a real app, call deleteUser API
              setDeleteDialogOpen(false);
              navigate('/user-list');
            }}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserDetail;
