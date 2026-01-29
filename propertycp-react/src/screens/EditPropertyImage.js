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
import { uploadPropertyFiles, deletePropertyFile, updateMainImage } from "../services/s3Upload";

const EditPropertyImage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { fetchPropertyById, updateProperty } = useData();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]); // Track new files to upload
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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
      id: `temp-${Date.now()}-${index}`,
      link: URL.createObjectURL(file),
      isVideo: file.type.startsWith("video/"),
      propertyId: parseInt(id),
      file, // Store the actual file for upload
    }));
    setImages([...images, ...newImages]);
    setNewFiles([...newFiles, ...files]);
    setError("");
    setSuccess("");
  };

  const handleMediaSelected = (filesFromManager) => {
    // filesFromManager can include File objects (new) or existing image objects
    const actualFiles = filesFromManager.filter(f => f instanceof File);
    setNewFiles(actualFiles);
    setError("");
    setSuccess("");
  };

  const handleDeleteImage = async (imageId) => {
    const image = images.find((img) => img.id === imageId);
    if (!image) return;

    setUploading(true);
    setError("");
    setSuccess("");
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
      setSuccess("Image deleted successfully");
    } catch (err) {
      console.error("Error deleting image:", err);
      setError("Failed to delete image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setUploading(true);
    setError("");
    setSuccess("");

    try {
      // Upload new files if any
      if (newFiles.length > 0) {
        const response = await uploadPropertyFiles(
          parseInt(id),
          newFiles,
          mainImageId
        );

        if (response.data?.allImages) {
          // Update local state with uploaded images
          setImages(response.data.allImages);
          setNewFiles([]);

          // Update property with new images
          await updateProperty(parseInt(id), {
            images: response.data.allImages,
            mainImage: response.data.mainImage,
          });
        }
        setSuccess("Images uploaded successfully!");
      } else if (mainImageId) {
        // No new files but main image changed - use dedicated endpoint
        const response = await updateMainImage(parseInt(id), mainImageId);
        if (response.data?.mainImage) {
          setSuccess("Main image updated successfully!");
        }
      } else {
        setError("No changes to save");
      }
    } catch (err) {
      console.error("Error saving images:", err);
      setError("Failed to save images. Please try again.");
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

            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {success}
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

            <Grid container spacing={2} sx={{ mt: 3 }}>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleSave}
                  disabled={uploading || (newFiles.length === 0 && !mainImageId)}
                  startIcon={uploading ? <CircularProgress size={20} /> : <CloudUpload />}
                >
                  {uploading ? "Uploading..." : "Save Changes"}
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate(`/property/${id}`)}
                  disabled={uploading}
                >
                  Back to Property
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default EditPropertyImage;
