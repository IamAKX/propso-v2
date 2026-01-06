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
  CircularProgress,
  Chip,
  IconButton,
  TextField,
  MenuItem,
  Grid,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Assignment,
  Phone,
  WhatsApp,
  Comment,
  ArrowForward,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const LeadScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { fetchLeads } = useData();
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadLeads();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [leads, statusFilter, searchQuery]);

  const loadLeads = async () => {
    setLoading(true);
    try {
      const data = await fetchLeads(user.id);
      setLeads(data);
    } catch (error) {
      console.error('Error loading leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...leads];

    // Status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter((lead) => lead.status === statusFilter);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (lead) =>
          lead.fullName.toLowerCase().includes(query) ||
          lead.mobileNo.includes(query) ||
          lead.leadPropertyType.toLowerCase().includes(query)
      );
    }

    setFilteredLeads(filtered);
  };

  const handleCall = (e, mobileNo) => {
    e.stopPropagation();
    window.location.href = `tel:${mobileNo}`;
  };

  const handleWhatsApp = (e, mobileNo) => {
    e.stopPropagation();
    window.open(`https://wa.me/91${mobileNo}`, '_blank');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

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
          <Assignment sx={{ mr: 2, fontSize: 32 }} />
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 700 }}>
            My Leads
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4, pb: 10 }}>
        {/* Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Search Leads"
                  placeholder="Search by name, phone, or type"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Filter by Status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="All">All Status</MenuItem>
                  <MenuItem value="Open">Open</MenuItem>
                  <MenuItem value="Closed">Closed</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Statistics */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2.5 }}>
                <Typography variant="h3" color="primary.main" fontWeight="700">
                  {leads.length}
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight="600" sx={{ mt: 1 }}>
                  Total Leads
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2.5 }}>
                <Typography variant="h3" color="success.main" fontWeight="700">
                  {leads.filter((l) => l.status === 'Open').length}
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight="600" sx={{ mt: 1 }}>
                  Open
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2.5 }}>
                <Typography variant="h3" color="text.secondary" fontWeight="700">
                  {leads.filter((l) => l.status === 'Closed').length}
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight="600" sx={{ mt: 1 }}>
                  Closed
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Leads List */}
        {filteredLeads.length === 0 ? (
          <Card
            sx={{
              border: '2px dashed',
              borderColor: 'divider',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '40vh',
                textAlign: 'center',
                p: 4,
              }}
            >
              <Assignment sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h5" color="text.secondary" fontWeight="700" gutterBottom>
                {leads.length === 0 ? 'No Leads Yet' : 'No Leads Found'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {leads.length === 0
                  ? 'Start creating leads from property listings'
                  : 'Try adjusting your filters'}
              </Typography>
            </Box>
          </Card>
        ) : (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" fontWeight="700">
                All Leads
              </Typography>
              <Chip
                label={`${filteredLeads.length} ${filteredLeads.length === 1 ? 'lead' : 'leads'}`}
                color="primary"
                variant="outlined"
                sx={{ fontWeight: 600 }}
              />
            </Box>
            {filteredLeads.map((lead) => (
              <Card
                key={lead.id}
                sx={{
                  mb: 2,
                  transition: 'all 0.2s',
                  '&:hover': {
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: 'primary.main',
                          width: 40,
                          height: 40,
                          fontWeight: 600,
                          fontSize: '1.125rem',
                        }}
                      >
                        {lead.fullName.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="700">
                          {lead.fullName}
                        </Typography>
                        <Box
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 0.5,
                            px: 1,
                            py: 0.25,
                            bgcolor: 'action.hover',
                            borderRadius: 1,
                            mt: 0.5,
                          }}
                        >
                          <Phone sx={{ fontSize: 14, color: 'primary.main' }} />
                          <Typography variant="caption" fontWeight="600">
                            {lead.mobileNo}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Chip
                      label={lead.status}
                      size="small"
                      color={lead.status === 'Open' ? 'success' : 'default'}
                    />
                  </Box>

                  <Grid container spacing={1.5} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <Box sx={{ p: 1.5, bgcolor: 'action.hover', borderRadius: 1 }}>
                        <Typography variant="caption" color="text.secondary" fontWeight="600">
                          Lead Type
                        </Typography>
                        <Typography variant="body2" fontWeight="700" sx={{ mt: 0.5 }}>
                          {lead.leadPropertyType}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ p: 1.5, bgcolor: 'action.hover', borderRadius: 1 }}>
                        <Typography variant="caption" color="text.secondary" fontWeight="600">
                          Property Type
                        </Typography>
                        <Typography variant="body2" fontWeight="700" sx={{ mt: 0.5 }}>
                          {lead.propertyType}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  {lead.leadCommentModel && lead.leadCommentModel.length > 0 && (
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.75,
                        px: 1.5,
                        py: 0.75,
                        bgcolor: 'action.hover',
                        borderRadius: 1,
                        mb: 2,
                      }}
                    >
                      <Comment fontSize="small" sx={{ color: 'primary.main' }} />
                      <Typography variant="caption" fontWeight="600">
                        {lead.leadCommentModel.length}{' '}
                        {lead.leadCommentModel.length === 1 ? 'comment' : 'comments'}
                      </Typography>
                    </Box>
                  )}

                  <Divider sx={{ my: 1.5 }} />

                  <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <IconButton
                      size="small"
                      onClick={(e) => handleCall(e, lead.mobileNo)}
                      sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        '&:hover': { bgcolor: 'primary.dark' },
                      }}
                    >
                      <Phone fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => handleWhatsApp(e, lead.mobileNo)}
                      sx={{
                        bgcolor: '#25D366',
                        color: 'white',
                        '&:hover': { bgcolor: '#20BA5A' },
                      }}
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

export default LeadScreen;
