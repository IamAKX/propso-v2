import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
  Alert,
} from "@mui/material";
import {
  CloudUpload,
  Delete as DeleteIcon,
  CheckCircle,
} from "@mui/icons-material";

/**
 * Reusable component for uploading and managing property images/videos
 */
const MediaUploadManager = ({
  onFilesSelected,
  onFileDeleted,
  initialFiles = [],
  maxImages = 5,
  maxVideos = 1,
  allowVideo = true,
  onMainImageSelect,
  mainImageId = null,
  loading = false,
  error = null,
}) => {
  const [files, setFiles] = useState(initialFiles);
  const [previewUrls, setPreviewUrls] = useState(
    initialFiles.map((f) => ({
      id: f.id,
      url: f.link,
      isVideo: f.isVideo,
      name: f.name || "File",
    }))
  );
  const [dragActive, setDragActive] = useState(false);

  const imageCount = files.filter((f) => !f.isVideo).length;
  const videoCount = files.filter((f) => f.isVideo).length;

  const canAddImages = imageCount < maxImages;
  const canAddVideos = allowVideo && videoCount < maxVideos;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    processFiles(selectedFiles);
  };

  const processFiles = (fileList) => {
    let validFiles = [];

    for (const file of fileList) {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");

      // Validate file type
      if (!isImage && !isVideo) {
        continue;
      }

      // Check image limit
      if (isImage && !canAddImages) {
        continue;
      }

      // Check video limit
      if (isVideo && !canAddVideos) {
        continue;
      }

      // Validate file size
      const maxSize = isVideo ? 100 * 1024 * 1024 : 10 * 1024 * 1024; // 100MB for video, 10MB for image
      if (file.size > maxSize) {
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      // Create preview URLs
      const newPreviews = validFiles.map((file) => {
        const reader = new FileReader();
        const url = new Promise((resolve) => {
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(file);
        });

        return url.then((dataUrl) => ({
          id: `new-${Date.now()}-${Math.random()}`,
          url: dataUrl,
          isVideo: file.type.startsWith("video/"),
          name: file.name,
          file,
        }));
      });

      Promise.all(newPreviews).then((previews) => {
        const newFiles = previews.map((p) => p.file);
        setFiles([...files, ...newFiles]);
        setPreviewUrls([...previewUrls, ...previews]);
        onFilesSelected([...files, ...newFiles]);
      });
    }
  };

  const handleDelete = (index) => {
    const preview = previewUrls[index];
    const newPreviewUrls = previewUrls.filter((_, i) => i !== index);
    const newFiles = files.filter((_, i) => i !== index);

    setPreviewUrls(newPreviewUrls);
    setFiles(newFiles);
    onFileDeleted(preview);
  };

  const handleSetMainImage = (index) => {
    const preview = previewUrls[index];
    if (onMainImageSelect) {
      onMainImageSelect(preview.id);
    }
  };

  return (
    <Box>
      {error && <Alert severity="error">{error}</Alert>}

      {/* Upload Area */}
      <Paper
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        sx={{
          p: 3,
          textAlign: "center",
          border: "2px dashed",
          borderColor: dragActive ? "primary.main" : "grey.300",
          backgroundColor: dragActive ? "action.hover" : "background.paper",
          transition: "all 0.3s ease",
          cursor: "pointer",
          mb: 2,
          opacity: !canAddImages && !canAddVideos ? 0.5 : 1,
        }}
      >
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileInput}
          style={{ display: "none" }}
          id="media-upload-input"
          disabled={!canAddImages && !canAddVideos}
        />
        <label htmlFor="media-upload-input" style={{ cursor: "pointer" }}>
          <CloudUpload sx={{ fontSize: 48, color: "primary.main", mb: 1 }} />
          <Typography variant="h6">Drag and drop files here</Typography>
          <Typography variant="body2" color="textSecondary">
            or click to browse
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Images: {imageCount}/{maxImages} | Videos: {videoCount}/{maxVideos}
          </Typography>
          {!canAddImages && !canAddVideos && (
            <Typography variant="caption" color="error" display="block" mt={1}>
              Maximum files reached
            </Typography>
          )}
        </label>
      </Paper>

      {/* Preview Grid */}
      {previewUrls.length > 0 && (
        <Box>
          <Typography variant="subtitle1" mb={1}>
            Media Preview ({previewUrls.length})
          </Typography>
          <Grid container spacing={2}>
            {previewUrls.map((preview, index) => (
              <Grid item xs={12} sm={6} md={4} key={preview.id}>
                <Card>
                  <Box sx={{ position: "relative" }}>
                    {preview.isVideo ? (
                      <video
                        src={preview.url}
                        style={{
                          width: "100%",
                          height: 200,
                          objectFit: "cover",
                        }}
                        controls
                      />
                    ) : (
                      <Box
                        component="img"
                        src={preview.url}
                        sx={{
                          width: "100%",
                          height: 200,
                          objectFit: "cover",
                        }}
                      />
                    )}

                    {/* Main image indicator */}
                    {mainImageId === preview.id && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          backgroundColor: "rgba(0, 0, 0, 0.6)",
                          color: "white",
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        <CheckCircle sx={{ fontSize: 16 }} />
                        <Typography variant="caption">Main</Typography>
                      </Box>
                    )}
                  </Box>

                  <CardContent>
                    <Stack spacing={1}>
                      <Typography variant="body2" noWrap title={preview.name}>
                        {preview.name}
                      </Typography>
                      {!preview.isVideo && mainImageId !== preview.id && (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleSetMainImage(index)}
                        >
                          Set as Main
                        </Button>
                      )}
                      <Button
                        size="small"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDelete(index)}
                        disabled={loading}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default MediaUploadManager;
