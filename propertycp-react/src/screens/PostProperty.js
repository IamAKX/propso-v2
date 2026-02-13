import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  MenuItem,
  Alert,
  CircularProgress,
  Grid,
  InputAdornment,
} from "@mui/material";
import { AddBox, Send } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import MediaUploadManager from "../components/MediaUploadManager";
import { uploadPropertyFiles } from "../services/s3Upload";
import { CITIES, PROPERTY_TYPES } from "../constants";

const PostProperty = () => {
  const navigate = useNavigate();
  const { user, isActive } = useAuth();
  const { createProperty, updateProperty } = useData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const initialFormData = {
    title: "",
    subTitle: "",
    price: "",
    numberOfRooms: "",
    bhk: "",
    location: "",
    city: "",
    mainImage: "",
    type: "Flat",
    area: "",
    areaUnit: "Sqft",
    description: "",
    builderPhoneNumber: user?.mobileNo || "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mainImageId, setMainImageId] = useState(null);
  const [uploading, setUploading] = useState(false);

  const resetForm = () => {
    setFormData({
      ...initialFormData,
      builderPhoneNumber: user?.mobileNo || "",
    });
    setMediaFiles([]);
    setMainImageId(null);
    setError("");
  };

  const showError = (message) => {
    setError(message);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleMediaSelected = (files) => {
    setMediaFiles(files);
    setError("");
  };

  const handleMediaDeleted = (deletedPreview) => {
    setMediaFiles((prevFiles) => {
      // Find and remove the file that matches the deleted preview
      const newFiles = prevFiles.filter((file, index) => {
        // Match by comparing the file object reference stored in preview
        return file !== deletedPreview.file;
      });
      return newFiles;
    });

    if (mainImageId === deletedPreview.id) {
      setMainImageId(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validation
    if (
      !formData.title ||
      !formData.price ||
      !formData.city ||
      !formData.location
    ) {
      showError("Please fill in all required fields");
      return;
    }

    if (formData.title.length < 5) {
      showError("Title must be at least 5 characters");
      return;
    }

    if (isNaN(formData.price) || parseInt(formData.price) <= 0) {
      showError("Please enter a valid price");
      return;
    }

    if (
      formData.builderPhoneNumber.length !== 10 ||
      !/^\d+$/.test(formData.builderPhoneNumber)
    ) {
      showError("Phone number must be exactly 10 digits");
      return;
    }

    if (!isActive) {
      showError(
        "Your account must be ACTIVE to post properties. Please complete KYC verification."
      );
      return;
    }

    // Check if either image URL is provided or media files are uploaded
    if (!formData.mainImage && mediaFiles.length === 0) {
      showError("Please provide at least one image (upload files or provide image URL)");
      return;
    }

    setLoading(true);
    let createdPropertyId = null;

    try {
      // Determine main image: use provided URL or placeholder (will be replaced by first uploaded image)
      const mainImage = formData.mainImage || "https://placeholder.image/temp.jpg";

      const propertyData = {
        ...formData,
        mainImage,
        createdById: user.id,
        images: [],
      };

      // Create property first
      const newProperty = await createProperty(propertyData);
      createdPropertyId = newProperty.id;

      // Upload media files if any are selected
      if (mediaFiles.length > 0) {
        try {
          setUploading(true);
          const response = await uploadPropertyFiles(
            newProperty.id,
            mediaFiles,
            mainImageId
          );

          // Update property with uploaded images from response
          // The first uploaded image will become main image if no mainImageId was selected
          if (response.data?.allImages) {
            await updateProperty(newProperty.id, {
              images: response.data.allImages,
              mainImage: response.data.mainImage,
            });
          }
        } catch (uploadErr) {
          // If image upload fails, delete the property and show error
          try {
            await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:3001/api"}/properties/${createdPropertyId}`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });
          } catch (deleteErr) {
            console.error("Failed to delete property after upload failure:", deleteErr);
          }
          throw new Error(uploadErr.message || "Failed to upload images");
        } finally {
          setUploading(false);
        }
      }

      // Show success and reset form
      setSuccess(true);
      resetForm();

      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Hide success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err) {
      showError(err.message || "Failed to create property. Please try again.");
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <AddBox sx={{ mr: 2 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Post Property
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 3, pb: 10 }}>
        {!isActive && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            Your account status is <strong>{user?.status}</strong>. You need an
            ACTIVE account to post properties. Please complete KYC verification
            from your profile.
          </Alert>
        )}

        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom fontWeight="600">
              Property Details
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Fill in the details to list your property
            </Typography>

            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                <strong>Property created successfully!</strong> Your property is pending approval. An admin will review and approve it from the admin panel before it becomes visible to users.
              </Alert>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                {/* Basic Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Basic Information
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Property Title *"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Luxury 3BHK Apartment in Prime Location"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Subtitle"
                    name="subTitle"
                    value={formData.subTitle}
                    onChange={handleChange}
                    placeholder="e.g., Spacious apartment with modern amenities"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Property Type *"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                  >
                    {PROPERTY_TYPES.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Price *"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="e.g., 5000000"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">₹</InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* Property Specifications */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Property Specifications
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="BHK"
                    name="bhk"
                    value={formData.bhk}
                    onChange={handleChange}
                    placeholder="e.g., 3"
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Number of Rooms"
                    name="numberOfRooms"
                    value={formData.numberOfRooms}
                    onChange={handleChange}
                    placeholder="e.g., 5"
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Area"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    placeholder="e.g., 1500"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    select
                    label="Area Unit"
                    name="areaUnit"
                    value={formData.areaUnit}
                    onChange={handleChange}
                  >
                    <MenuItem value="Sqft">Square Feet</MenuItem>
                    <MenuItem value="Sqm">Square Meter</MenuItem>
                    <MenuItem value="Acre">Acre</MenuItem>
                    <MenuItem value="Hectare">Hectare</MenuItem>
                  </TextField>
                </Grid>

                {/* Location */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Location
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="City *"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                  >
                    {CITIES.map((city) => (
                      <MenuItem key={city} value={city}>
                        {city}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Location/Area *"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Whitefield"
                  />
                </Grid>

                {/* Additional Details */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Additional Details
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your property, amenities, nearby facilities, etc."
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Contact Phone Number *"
                    name="builderPhoneNumber"
                    value={formData.builderPhoneNumber}
                    onChange={handleChange}
                    placeholder="10-digit phone number"
                    inputProps={{ maxLength: 10 }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Main Image URL (Optional)"
                    name="mainImage"
                    value={formData.mainImage}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    helperText="Leave empty to use default image"
                  />
                </Grid>

                {/* Media Upload Section */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Property Media
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    Upload up to 5 images and 1 video for your property
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <MediaUploadManager
                    onFilesSelected={handleMediaSelected}
                    onFileDeleted={handleMediaDeleted}
                    initialFiles={mediaFiles}
                    maxImages={5}
                    maxVideos={1}
                    mainImageId={mainImageId}
                    onMainImageSelect={setMainImageId}
                    loading={uploading}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading || success || !isActive || uploading}
                    startIcon={
                      loading || uploading ? (
                        <CircularProgress size={20} />
                      ) : (
                        <Send />
                      )
                    }
                    sx={{ mt: 2, py: 1.5 }}
                  >
                    {loading || uploading
                      ? "Creating Property..."
                      : "Create Property"}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>

        {/* Information Card */}
        <Card sx={{ mt: 3, bgcolor: "info.lighter" }}>
          <CardContent>
            <Typography variant="body2" color="info.dark">
              <strong>Note:</strong> You can add media files during property
              creation or edit them later from the property detail page. All
              images should be clear and properly oriented.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default PostProperty;
