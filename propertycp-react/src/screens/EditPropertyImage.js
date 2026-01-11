import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  CircularProgress,
  Alert,
} from "@mui/material";
import { ArrowBack, CloudUpload, Delete } from "@mui/icons-material";
import { useData } from "../context/DataContext";
import MediaUploadManager from "../components/MediaUploadManager";
import { uploadPropertyFiles, deletePropertyFile } from "../services/s3Upload";

const EditPropertyImage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { fetchPropertyById } = useData();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [mainImageId, setMainImageId] = useState(null);

  useEffect(() => {
    loadProperty();
  }, [id]);

  const loadProperty = async () => {
    setLoading(true);
    try {
      const data = await fetchPropertyById(parseInt(id));
      setProperty(data);
      // Filter and format existing images from S3
      const existingImages = (data.images || []).map((img) => ({
        id: img.id || img.fileId || Date.now(),
        link: img.link || img.url,
        isVideo: img.isVideo || img.type === "video",
        propertyId: parseInt(id),
      }));
      setImages(existingImages);
      // Set main image from property data
      if (data.mainImage) {
        const mainImg = existingImages.find(
          (img) => img.link === data.mainImage
        );
        if (mainImg) setMainImageId(mainImg.id);
      }
    } catch (error) {
      console.error("Error loading property:", error);
      setError("Failed to load property images");
    } finally {
      setLoading(false);
    }
  };

  const handleAddImages = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file, index) => ({
      id: Date.now() + index,
      link: URL.createObjectURL(file),
      isVideo: false,
      propertyId: parseInt(id),
    }));
    setImages([...images, ...newImages]);
    setError("");
  };

  const handleMediaSelected = (files) => {
    setImages(files);
    setError("");
  };

  const handleDeleteImage = async (imageId) => {
    const image = images.find((img) => img.id === imageId);
    if (!image) return;

    setUploading(true);
    try {
      // If image has a URL (from S3), delete it from S3
      if (image.link && image.link.includes("s3")) {
        await deletePropertyFile(parseInt(id), imageId);
      }

      // Remove from local state
      setImages(images.filter((img) => img.id !== imageId));
      if (mainImageId === imageId) {
        setMainImageId(null);
      }
    } catch (err) {
      console.error("Error deleting image:", err);
      setError("Failed to delete image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
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
            Edit Property Images
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 3, pb: 10 }}>
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom fontWeight="600">
              Property Media
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Manage images and videos for {property?.title}
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <MediaUploadManager
              onFilesSelected={handleMediaSelected}
              onFileDeleted={handleDeleteImage}
              initialFiles={images}
              maxImages={5}
              maxVideos={1}
              mainImageId={mainImageId}
              onMainImageSelect={setMainImageId}
              loading={uploading}
            />

            <Button
              fullWidth
              variant="contained"
              onClick={() => navigate(`/property/${id}`)}
              sx={{ mt: 3 }}
              disabled={uploading}
            >
              Done
            </Button>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default EditPropertyImage;
