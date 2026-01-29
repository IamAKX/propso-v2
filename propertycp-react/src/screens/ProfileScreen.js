import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Chip,
  Button,
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  Badge,
  VerifiedUser,
  ExitToApp,
  Assignment,
  Home as HomeIcon,
  SupervisorAccount,
  People,
  AdminPanelSettings,
  CardMembership,
  CheckCircle,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const ProfileScreen = () => {
  const navigate = useNavigate();
  const { user, logout, isAdmin, isActive, isPending, isCreated, canManageProperties, canManageLeads } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
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
        <Toolbar sx={{ py: 1 }}>
          <Person sx={{ mr: 2, fontSize: 32 }} />
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Profile
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4, pb: 10 }}>
        {/* Profile Header */}
        <Card sx={{ mb: 3, overflow: 'hidden' }}>
          <Box sx={{ bgcolor: 'action.hover', pt: 3, pb: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'primary.main',
                  color: 'white',
                  fontSize: '2rem',
                  fontWeight: 700,
                  mb: 1.5,
                }}
              >
                {user?.fullName?.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="h5" fontWeight="700" gutterBottom>
                {user?.fullName}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 2 }}>
                <Chip
                  label={user?.userType}
                  color="primary"
                  size="small"
                  icon={<Badge />}
                />
                <Chip
                  label={user?.status}
                  color={getStatusColor(user?.status)}
                  size="small"
                  icon={<VerifiedUser />}
                />
              </Box>
            </Box>
          </Box>

          <CardContent sx={{ p: 3 }}>
            {/* User Information */}
            <Typography variant="h6" fontWeight="600" gutterBottom sx={{ mb: 2 }}>
              Contact Information
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 1.5,
                  bgcolor: 'action.hover',
                  borderRadius: 1,
                }}
              >
                <Email sx={{ mr: 1.5, color: 'primary.main', fontSize: 24 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight="600">
                    Email Address
                  </Typography>
                  <Typography variant="body2" fontWeight="600">
                    {user?.email}
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 1.5,
                  bgcolor: 'action.hover',
                  borderRadius: 1,
                }}
              >
                <Phone sx={{ mr: 1.5, color: 'primary.main', fontSize: 24 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight="600">
                    Mobile Number
                  </Typography>
                  <Typography variant="body2" fontWeight="600">
                    {user?.mobileNo}
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 1.5,
                  bgcolor: 'action.hover',
                  borderRadius: 1,
                }}
              >
                <CardMembership sx={{ mr: 1.5, color: 'primary.main', fontSize: 24 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="600">
                    KYC Status
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    {user?.isKycVerified ? (
                      <Chip label="Verified" color="success" size="small" />
                    ) : (
                      <Chip label="Not Verified" color="warning" size="small" />
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Status Information Card */}
        {!isActive && (
          <Card sx={{ mb: 3, bgcolor: 'warning.lighter' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="600" color="warning.dark">
                Account Status
              </Typography>
              {isCreated && (
                <Typography variant="body2" color="warning.dark">
                  Your account is created but not yet active. Please complete KYC verification
                  to unlock all features.
                </Typography>
              )}
              {isPending && (
                <Typography variant="body2" color="warning.dark">
                  Your KYC documents are under review. You'll be notified once approved.
                </Typography>
              )}
              {!isActive && (
                <Button
                  variant="contained"
                  color="warning"
                  onClick={() => navigate('/kyc')}
                  sx={{ mt: 2 }}
                  fullWidth
                >
                  Complete KYC Verification
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Navigation Menu - Only for Agents and Admins */}
        {(canManageProperties || canManageLeads) && (
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="600" sx={{ mb: 2 }}>
                My Activity
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {canManageProperties && (
                  <ListItemButton
                    onClick={() => navigate('/property-listing')}
                    sx={{
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'divider',
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    <ListItemIcon>
                      <HomeIcon sx={{ color: 'primary.main' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={<Typography variant="body2" fontWeight="600">My Properties</Typography>}
                      secondary={<Typography variant="caption">View and manage your listings</Typography>}
                    />
                  </ListItemButton>
                )}
                {canManageLeads && (
                  <ListItemButton
                    onClick={() => navigate('/home', { state: { tab: 1 } })}
                    sx={{
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'divider',
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    <ListItemIcon>
                      <Assignment sx={{ color: 'primary.main' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={<Typography variant="body2" fontWeight="600">My Leads</Typography>}
                      secondary={<Typography variant="caption">Track customer inquiries</Typography>}
                    />
                  </ListItemButton>
                )}
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Admin Menu */}
        {isAdmin && (
          <Card sx={{ mb: 3, border: '1px solid', borderColor: 'primary.main' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AdminPanelSettings sx={{ color: 'primary.main', fontSize: 28, mr: 1 }} />
                <Typography variant="h6" fontWeight="700" color="primary.main">
                  Admin Panel
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <ListItemButton
                  onClick={() => navigate('/user-list')}
                  sx={{
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <ListItemIcon>
                    <People sx={{ color: 'primary.main' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={<Typography variant="body2" fontWeight="600">All Users</Typography>}
                    secondary={<Typography variant="caption">Manage user accounts and KYC</Typography>}
                  />
                </ListItemButton>
                <ListItemButton
                  onClick={() => navigate('/all-lead-users')}
                  sx={{
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <ListItemIcon>
                    <SupervisorAccount sx={{ color: 'primary.main' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={<Typography variant="body2" fontWeight="600">All Leads</Typography>}
                    secondary={<Typography variant="caption">View leads from all users</Typography>}
                  />
                </ListItemButton>
                <ListItemButton
                  onClick={() => navigate('/property-approvals')}
                  sx={{
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <ListItemIcon>
                    <CheckCircle sx={{ color: 'primary.main' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={<Typography variant="body2" fontWeight="600">Property Approvals</Typography>}
                    secondary={<Typography variant="caption">Review and approve property listings</Typography>}
                  />
                </ListItemButton>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Account Settings */}
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="600" sx={{ mb: 2 }}>
              Account Settings
            </Typography>
            <ListItemButton
              onClick={() => navigate('/kyc')}
              sx={{
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <ListItemIcon>
                <VerifiedUser sx={{ color: 'primary.main' }} />
              </ListItemIcon>
              <ListItemText
                primary={<Typography variant="body2" fontWeight="600">KYC Verification</Typography>}
                secondary={<Typography variant="caption">{user?.isKycVerified ? 'View documents' : 'Complete verification'}</Typography>}
              />
            </ListItemButton>
          </CardContent>
        </Card>

        {/* Logout Button */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Button
              fullWidth
              variant="contained"
              color="error"
              size="large"
              startIcon={<ExitToApp />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default ProfileScreen;
