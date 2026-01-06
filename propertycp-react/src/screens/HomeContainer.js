import React, { useState } from 'react';
import { Box, BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { Home, Assignment, AddBox, Favorite, Person } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import HomeScreen from './HomeScreen';
import LeadScreen from './LeadScreen';
import FavoriteScreen from './FavoriteScreen';
import ProfileScreen from './ProfileScreen';
import PostProperty from './PostProperty';

const HomeContainer = () => {
  const [activeTab, setActiveTab] = useState('home');
  const { canManageProperties, canManageLeads } = useAuth();

  // Map tab names to screens
  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen key="home" />;
      case 'leads':
        return <LeadScreen key="leads" />;
      case 'post':
        return <PostProperty key="post" />;
      case 'favorites':
        return <FavoriteScreen key="favorites" onNavigateToHome={() => setActiveTab('home')} />;
      case 'profile':
        return <ProfileScreen key="profile" />;
      default:
        return <HomeScreen key="home" />;
    }
  };

  // Get the numeric value for BottomNavigation based on visible tabs
  const getNavigationValue = () => {
    const visibleTabs = ['home'];
    if (canManageLeads) visibleTabs.push('leads');
    if (canManageProperties) visibleTabs.push('post');
    visibleTabs.push('favorites', 'profile');

    return visibleTabs.indexOf(activeTab);
  };

  // Handle navigation change
  const handleNavigationChange = (event, newValue) => {
    const visibleTabs = ['home'];
    if (canManageLeads) visibleTabs.push('leads');
    if (canManageProperties) visibleTabs.push('post');
    visibleTabs.push('favorites', 'profile');

    setActiveTab(visibleTabs[newValue]);
  };

  // Build navigation actions dynamically
  const getNavigationActions = () => {
    const actions = [
      <BottomNavigationAction key="home" label="Home" icon={<Home />} />
    ];

    if (canManageLeads) {
      actions.push(<BottomNavigationAction key="leads" label="Leads" icon={<Assignment />} />);
    }

    if (canManageProperties) {
      actions.push(<BottomNavigationAction key="post" label="Post" icon={<AddBox />} />);
    }

    actions.push(
      <BottomNavigationAction key="favorites" label="Favorites" icon={<Favorite />} />,
      <BottomNavigationAction key="profile" label="Profile" icon={<Person />} />
    );

    return actions;
  };

  return (
    <Box sx={{ pb: 7 }}>
      {renderScreen()}

      <Paper
        sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
        elevation={3}
      >
        <BottomNavigation
          value={getNavigationValue()}
          onChange={handleNavigationChange}
          showLabels
        >
          {getNavigationActions()}
        </BottomNavigation>
      </Paper>
    </Box>
  );
};

export default HomeContainer;
