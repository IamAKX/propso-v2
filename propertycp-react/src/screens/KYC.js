import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Alert,
  CircularProgress,
  Grid,
  Paper,
  Divider,
} from "@mui/material";
import {
  ArrowBack,
  CloudUpload,
  CheckCircle,
  Description,
  CreditCard,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import KYCDocumentUpload from "../components/KYCDocumentUpload";
import { uploadKYCDocument } from "../services/s3Upload";

const KYC = () => {
  const navigate = useNavigate();
  const { user, updateUserData, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [documents, setDocuments] = useState({
    aadharFront: null,
    aadharBack: null,
    panCard: null,
  });
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (documentType, file) => {
    setDocuments((prev) => ({
      ...prev,
      [documentType]: file,
    }));
  };

  const handleKYCDelete = (documentType) => {
    setDocuments((prev) => ({
      ...prev,
      [documentType]: null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validation - check if all files are selected
    if (!documents.aadharFront || !documents.aadharBack || !documents.panCard) {
      setError("Please select all required documents");
      return;
    }

    setLoading(true);
    setUploading(true);

    try {
      // Upload all files to S3 first
      const [aadharFrontResponse, aadharBackResponse, panCardResponse] =
        await Promise.all([
          uploadKYCDocument("aadhar_front", documents.aadharFront),
          uploadKYCDocument("aadhar_back", documents.aadharBack),
          uploadKYCDocument("pan", documents.panCard),
        ]);

      // Check if all uploads were successful
      if (
        !aadharFrontResponse.success ||
        !aadharBackResponse.success ||
        !panCardResponse.success
      ) {
        throw new Error("Failed to upload one or more documents to S3");
      }

      const aadharFrontUrl = aadharFrontResponse.data?.url;
      const aadharBackUrl = aadharBackResponse.data?.url;
      const panCardUrl = panCardResponse.data?.url;

      if (!aadharFrontUrl || !aadharBackUrl || !panCardUrl) {
        throw new Error("Failed to get S3 URLs for uploaded documents");
      }

      // Update user with S3 URLs
      await updateUserData(user.id, {
        isKycVerified: false, // Initially not verified
        status: "PENDING", // Change status to PENDING
        aadhar_front: aadharFrontUrl,
        aadhar_back: aadharBackUrl,
        pan: panCardUrl,
      });

      await refreshUser();
      setSuccess(true);

      setTimeout(() => {
        navigate("/home", { state: { tab: 4 } }); // Navigate to Profile tab
      }, 2000);
    } catch (err) {
      setError(
        err.message || "Failed to submit KYC documents. Please try again."
      );
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  const isKycSubmitted =
    user?.status === "PENDING" || user?.status === "ACTIVE";

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate(-1)}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            KYC Verification
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 3, pb: 10 }}>
        {/* Status Card */}
        {isKycSubmitted && (
          <Card
            sx={{
              mb: 3,
              bgcolor:
                user?.status === "ACTIVE"
                  ? "success.lighter"
                  : "warning.lighter",
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                {user?.status === "ACTIVE" ? (
                  <CheckCircle color="success" sx={{ fontSize: 40 }} />
                ) : (
                  <CloudUpload color="warning" sx={{ fontSize: 40 }} />
                )}
                <Box>
                  <Typography
                    variant="h6"
                    fontWeight="600"
                    color={
                      user?.status === "ACTIVE"
                        ? "success.dark"
                        : "warning.dark"
                    }
                  >
                    {user?.status === "ACTIVE"
                      ? "KYC Verified"
                      : "KYC Under Review"}
                  </Typography>
                  <Typography
                    variant="body2"
                    color={
                      user?.status === "ACTIVE"
                        ? "success.dark"
                        : "warning.dark"
                    }
                  >
                    {user?.status === "ACTIVE"
                      ? "Your documents have been verified. You have full access to all features."
                      : "Your documents are under review. You will be notified once approved."}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Information Card */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom fontWeight="600">
              Document Verification
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Upload the following documents to complete your KYC verification
              and unlock all features.
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" color="text.secondary">
              <strong>Required Documents:</strong>
            </Typography>
            <ul style={{ marginTop: 8 }}>
              <li>
                <Typography variant="body2" color="text.secondary">
                  Aadhar Card (Front & Back)
                </Typography>
              </li>
              <li>
                <Typography variant="body2" color="text.secondary">
                  PAN Card
                </Typography>
              </li>
            </ul>
          </CardContent>
        </Card>

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            KYC documents submitted successfully! Your documents are now under
            review. Redirecting to profile...
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Upload Form */}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Aadhar Front */}
            <Grid item xs={12}>
              <KYCDocumentUpload
                documentType="aadhar_front"
                label="Aadhar Card (Front)"
                onFileSelect={(file) => handleFileSelect("aadharFront", file)}
                onDelete={() => handleKYCDelete("aadharFront")}
                loading={uploading}
              />
            </Grid>

            {/* Aadhar Back */}
            <Grid item xs={12}>
              <KYCDocumentUpload
                documentType="aadhar_back"
                label="Aadhar Card (Back)"
                onFileSelect={(file) => handleFileSelect("aadharBack", file)}
                onDelete={() => handleKYCDelete("aadharBack")}
                loading={uploading}
              />
            </Grid>

            {/* PAN Card */}
            <Grid item xs={12}>
              <KYCDocumentUpload
                documentType="pan"
                label="PAN Card"
                onFileSelect={(file) => handleFileSelect("panCard", file)}
                onDelete={() => handleKYCDelete("panCard")}
                loading={uploading}
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={loading || success || uploading}
                startIcon={
                  loading ? <CircularProgress size={20} /> : <CheckCircle />
                }
                sx={{ py: 1.5 }}
              >
                {uploading
                  ? "Uploading documents..."
                  : loading
                  ? "Submitting..."
                  : "Submit for Verification"}
              </Button>
            </Grid>
          </Grid>
        </form>

        {/* Info Card */}
        <Card sx={{ mt: 3, bgcolor: "info.lighter" }}>
          <CardContent>
            <Typography variant="body2" color="info.dark">
              <strong>Privacy Note:</strong> Your documents are securely stored
              and will only be used for verification purposes. Admin will review
              and approve your documents within 24-48 hours.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default KYC;
