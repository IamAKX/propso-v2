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
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { ArrowBack, CloudUpload, CheckCircle } from '@mui/icons-material';

const PickPropertyVideos = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newVideos = files.map((file) => ({
      file,
      name: file.name,
    }));
    setVideos([...videos, ...newVideos]);
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
            Upload Property Videos
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
              Upload videos of your property (maximum 3 videos)
            </Typography>

            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUpload />}
              fullWidth
              sx={{ mb: 3 }}
            >
              Choose Videos
              <input
                type="file"
                hidden
                accept="video/*"
                multiple
                onChange={handleFileChange}
              />
            </Button>

            {videos.length > 0 && (
              <List>
                {videos.map((video, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={`Video ${index + 1}`}
                      secondary={video.name}
                    />
                  </ListItem>
                ))}
              </List>
            )}

            <Button
              fullWidth
              variant="contained"
              onClick={handleSubmit}
              startIcon={<CheckCircle />}
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

export default PickPropertyVideos;
