import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

// Auth Screens
import AppIntro from './screens/AppIntro';
import Login from './screens/Login';
import Register from './screens/Register';

// Main Screens
import HomeContainer from './screens/HomeContainer';
import PropertyDetail from './screens/PropertyDetail';
import PropertyListing from './screens/PropertyListing';
import CreateLead from './screens/CreateLead';
import LeadComment from './screens/LeadComment';
import KYC from './screens/KYC';
import PostProperty from './screens/PostProperty';
import PickPropertyImages from './screens/PickPropertyImages';
import PickPropertyVideos from './screens/PickPropertyVideos';
import UserList from './screens/UserList';
import UserDetail from './screens/UserDetail';
import EditPropertyText from './screens/EditPropertyText';
import EditPropertyImage from './screens/EditPropertyImage';
import EditPropertyVideo from './screens/EditPropertyVideo';
import AllLeadUsers from './screens/AllLeadUsers';
import AdminLeadList from './screens/AdminLeadList';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? children : <Navigate to="/login" />;
};

// Public Route Component
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return !user ? children : <Navigate to="/home" />;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<AppIntro />} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      {/* Protected Routes */}
      <Route path="/home" element={<ProtectedRoute><HomeContainer /></ProtectedRoute>} />
      <Route path="/property/:id" element={<ProtectedRoute><PropertyDetail /></ProtectedRoute>} />
      <Route path="/property-listing" element={<ProtectedRoute><PropertyListing /></ProtectedRoute>} />
      <Route path="/create-lead" element={<ProtectedRoute><CreateLead /></ProtectedRoute>} />
      <Route path="/create-lead/:id" element={<ProtectedRoute><CreateLead /></ProtectedRoute>} />
      <Route path="/lead-comment/:id" element={<ProtectedRoute><LeadComment /></ProtectedRoute>} />
      <Route path="/kyc" element={<ProtectedRoute><KYC /></ProtectedRoute>} />
      <Route path="/post-property" element={<ProtectedRoute><PostProperty /></ProtectedRoute>} />
      <Route path="/post-property/images" element={<ProtectedRoute><PickPropertyImages /></ProtectedRoute>} />
      <Route path="/post-property/videos" element={<ProtectedRoute><PickPropertyVideos /></ProtectedRoute>} />
      <Route path="/user-list" element={<ProtectedRoute><UserList /></ProtectedRoute>} />
      <Route path="/user-detail/:id" element={<ProtectedRoute><UserDetail /></ProtectedRoute>} />
      <Route path="/edit-property-text/:id" element={<ProtectedRoute><EditPropertyText /></ProtectedRoute>} />
      <Route path="/edit-property-image/:id" element={<ProtectedRoute><EditPropertyImage /></ProtectedRoute>} />
      <Route path="/edit-property-video/:id" element={<ProtectedRoute><EditPropertyVideo /></ProtectedRoute>} />
      <Route path="/all-lead-users" element={<ProtectedRoute><AllLeadUsers /></ProtectedRoute>} />
      <Route path="/admin-lead-list/:userId" element={<ProtectedRoute><AdminLeadList /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppRoutes />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
