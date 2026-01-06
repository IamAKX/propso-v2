import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  IconButton,
  Grid,
  Paper,
} from '@mui/material';
import { ArrowBack, CloudUpload, CheckCircle } from '@mui/icons-material';

const PickPropertyImages = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));
    setImages([...images, ...newImages]);
  };

  const handleSubmit = () => {
    navigate('/home');
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate(-1)}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Upload Property Images
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 3, pb: 10 }}>
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom fontWeight="600">
              Property Images
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Upload images of your property (maximum 10 images)
            </Typography>

            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUpload />}
              fullWidth
              sx={{ mb: 3 }}
            >
              Choose Images
              <input
                type="file"
                hidden
                accept="image/*"
                multiple
                onChange={handleFileChange}
              />
            </Button>

            <Grid container spacing={2}>
              {images.map((img, index) => (
                <Grid item xs={6} sm={4} key={index}>
                  <Paper elevation={2}>
                    <Box
                      component="img"
                      src={img.preview}
                      alt={`Property ${index + 1}`}
                      sx={{ width: '100%', height: 150, objectFit: 'cover' }}
                    />
                  </Paper>
                </Grid>
              ))}
            </Grid>

            {images.length > 0 && (
              <Button
                fullWidth
                variant="contained"
                onClick={handleSubmit}
                startIcon={<CheckCircle />}
                sx={{ mt: 3 }}
              >
                Done
              </Button>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default PickPropertyImages;
