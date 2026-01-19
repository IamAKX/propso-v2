import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  Typography,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  CloudUpload,
  Delete as DeleteIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

/**
 * Reusable component for uploading and managing KYC documents
 */
const KYCDocumentUpload = ({
  documentType, // 'aadhar_front', 'aadhar_back', 'pan'
  label,
  initialUrl = null,
  onFileSelect,
  onDelete,
  loading = false,
  error = null,
}) => {
  const [preview, setPreview] = useState(initialUrl);
  const [fileName, setFileName] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [validationError, setValidationError] = useState(null);

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
    if (droppedFiles.length > 0) {
      processFile(droppedFiles[0]);
    }
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = async (file) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      setValidationError("Only image files are allowed");
      return;
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setValidationError("File size must be less than 10MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
      setFileName(file.name);
      setValidationError(null);

      // Pass file to parent component for later upload
      onFileSelect(file);
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete this ${label}?`)) {
      setPreview(null);
      setFileName("");
      onDelete();
    }
  };

  return (
    <Box>
      {(error || validationError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || validationError}
        </Alert>
      )}

      {preview ? (
        // Show preview and delete option
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="subtitle1">{label}</Typography>

              <Box
                onClick={() => setPreviewOpen(true)}
                sx={{
                  cursor: "pointer",
                  position: "relative",
                  borderRadius: 1,
                  overflow: "hidden",
                  bgcolor: "grey.100",
                }}
              >
                <Box
                  component="img"
                  src={preview}
                  alt={label}
                  sx={{
                    width: "100%",
                    height: 300,
                    objectFit: "cover",
                  }}
                />
              </Box>

              <Typography variant="body2" color="textSecondary">
                {fileName}
              </Typography>

              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleDelete}
                  disabled={loading}
                  fullWidth
                >
                  Delete
                </Button>
                <Button
                  variant="text"
                  onClick={() => setPreviewOpen(true)}
                  fullWidth
                >
                  View
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      ) : (
        // Show upload area
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
          }}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            style={{ display: "none" }}
            id={`kyc-upload-${documentType}`}
            disabled={loading}
          />
          <label
            htmlFor={`kyc-upload-${documentType}`}
            style={{ cursor: "pointer", display: "block" }}
          >
            {loading ? (
              <CircularProgress />
            ) : (
              <>
                <CloudUpload
                  sx={{ fontSize: 48, color: "primary.main", mb: 1 }}
                />
                <Typography variant="h6">{label}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Drag and drop your {label.toLowerCase()} here or click to
                  browse
                </Typography>
              </>
            )}
          </label>
        </Paper>
      )}

      {/* Image Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {label}
          <IconButton
            onClick={() => setPreviewOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box
            component="img"
            src={preview}
            alt={label}
            sx={{ width: "100%", height: "auto", mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default KYCDocumentUpload;
