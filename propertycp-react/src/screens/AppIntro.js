import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  MobileStepper,
  Paper,
} from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HandshakeIcon from '@mui/icons-material/Handshake';

const slides = [
  {
    title: 'Find Your Dream Property',
    description: 'Browse thousands of properties in your preferred location',
    icon: <HomeIcon sx={{ fontSize: 100, color: '#1E88E5' }} />,
    color: '#E3F2FD',
  },
  {
    title: 'Easy Property Search',
    description: 'Search by city, type, price range, and more filters',
    icon: <SearchIcon sx={{ fontSize: 100, color: '#FF9800' }} />,
    color: '#FFF3E0',
  },
  {
    title: 'Save Your Favorites',
    description: 'Bookmark properties you love and access them anytime',
    icon: <FavoriteIcon sx={{ fontSize: 100, color: '#E91E63' }} />,
    color: '#FCE4EC',
  },
  {
    title: 'Manage Your Leads',
    description: 'Track customer inquiries and close deals efficiently',
    icon: <HandshakeIcon sx={{ fontSize: 100, color: '#4CAF50' }} />,
    color: '#E8F5E9',
  },
];

const AppIntro = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = slides.length;

  useEffect(() => {
    // Check if app intro has been seen
    const hasSeenIntro = localStorage.getItem('appIntroSeen');
    if (hasSeenIntro) {
      navigate('/login');
    }
  }, [navigate]);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSkip = () => {
    localStorage.setItem('appIntroSeen', 'true');
    navigate('/login');
  };

  const handleGetStarted = () => {
    localStorage.setItem('appIntroSeen', 'true');
    navigate('/login');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={10}
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              minHeight: '500px',
              display: 'flex',
              flexDirection: 'column',
              bgcolor: slides[activeStep].color,
              p: 4,
            }}
          >
            {/* Skip Button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Button onClick={handleSkip} sx={{ color: 'text.secondary' }}>
                Skip
              </Button>
            </Box>

            {/* Content */}
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
              }}
            >
              <Box sx={{ mb: 4 }}>{slides[activeStep].icon}</Box>
              <Typography variant="h4" gutterBottom fontWeight="600">
                {slides[activeStep].title}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                {slides[activeStep].description}
              </Typography>
            </Box>

            {/* Stepper and Actions */}
            <Box>
              <MobileStepper
                variant="dots"
                steps={maxSteps}
                position="static"
                activeStep={activeStep}
                sx={{ flexGrow: 1, bgcolor: 'transparent', justifyContent: 'center' }}
                nextButton={
                  activeStep === maxSteps - 1 ? (
                    <Button
                      size="large"
                      onClick={handleGetStarted}
                      variant="contained"
                      sx={{ px: 4 }}
                    >
                      Get Started
                    </Button>
                  ) : (
                    <Button size="small" onClick={handleNext}>
                      Next
                      <KeyboardArrowRight />
                    </Button>
                  )
                }
                backButton={
                  <Button
                    size="small"
                    onClick={handleBack}
                    disabled={activeStep === 0}
                  >
                    <KeyboardArrowLeft />
                    Back
                  </Button>
                }
              />
            </Box>
          </Box>
        </Paper>

        {/* App Name */}
        <Typography
          variant="h4"
          align="center"
          sx={{ color: 'white', mt: 3, fontWeight: 700 }}
        >
          PropertyCP
        </Typography>
        <Typography
          variant="body2"
          align="center"
          sx={{ color: 'white', opacity: 0.8, mt: 1 }}
        >
          Your Real Estate Partner
        </Typography>
      </Container>
    </Box>
  );
};

export default AppIntro;
