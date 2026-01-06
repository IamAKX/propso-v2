import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import { ArrowBack, CloudUpload, Delete } from '@mui/icons-material';
import { useData } from '../context/DataContext';

const EditPropertyVideo = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { fetchPropertyById } = useData();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    loadProperty();
  }, [id]);

  const loadProperty = async () => {
    setLoading(true);
    try {
      const data = await fetchPropertyById(parseInt(id));
      setProperty(data);
      setVideos(data.images?.filter((img) => img.isVideo) || []);
    } catch (error) {
      console.error('Error loading property:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVideos = (e) => {
    const files = Array.from(e.target.files);
    const newVideos = files.map((file, index) => ({
      id: Date.now() + index,
      link: URL.createObjectURL(file),
      isVideo: true,
      propertyId: parseInt(id),
      name: file.name,
    }));
    setVideos([...videos, ...newVideos]);
  };

  const handleDeleteVideo = (videoId) => {
    setVideos(videos.filter((vid) => vid.id !== videoId));
  };

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
            Edit Property Videos
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 3, pb: 10 }}>
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom fontWeight="600">
              Property Videos
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Manage videos for {property?.title}
            </Typography>

            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUpload />}
              fullWidth
              sx={{ mb: 3 }}
            >
              Add More Videos
              <input
                type="file"
                hidden
                accept="video/*"
                multiple
                onChange={handleAddVideos}
              />
            </Button>

            {videos.length > 0 ? (
              <List>
                {videos.map((video) => (
                  <ListItem
                    key={video.id}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        color="error"
                        onClick={() => handleDeleteVideo(video.id)}
                      >
                        <Delete />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={video.name || `Video ${video.id}`}
                      secondary="Video file"
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                No videos uploaded yet
              </Typography>
            )}

            <Button
              fullWidth
              variant="contained"
              onClick={() => navigate(`/property/${id}`)}
              sx={{ mt: 3 }}
            >
              Done
            </Button>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default EditPropertyVideo;
