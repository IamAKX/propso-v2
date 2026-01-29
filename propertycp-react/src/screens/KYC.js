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

    // Validation - check if all documents exist (either uploaded or newly selected)
    const hasAadharFront = user?.aadharFront || documents.aadharFront;
    const hasAadharBack = user?.aadharBack || documents.aadharBack;
    const hasPanCard = user?.pan || documents.panCard;

    if (!hasAadharFront || !hasAadharBack || !hasPanCard) {
      setError("Please upload all required documents");
      return;
    }

    // Check if there are any new documents to upload
    if (!documents.aadharFront && !documents.aadharBack && !documents.panCard) {
      setError("No new documents to upload");
      return;
    }

    setLoading(true);
    setUploading(true);

    try {
      // Upload only new files to S3
      let aadharFrontUrl = user?.aadharFront;
      let aadharBackUrl = user?.aadharBack;
      let panCardUrl = user?.pan;

      // Upload new Aadhar Front if selected
      if (documents.aadharFront) {
        const aadharFrontResponse = await uploadKYCDocument(
          "aadhar_front",
          documents.aadharFront
        );
        if (!aadharFrontResponse.success) {
          throw new Error("Failed to upload Aadhar Front to S3");
        }
        aadharFrontUrl = aadharFrontResponse.data?.url;
      }

      // Upload new Aadhar Back if selected
      if (documents.aadharBack) {
        const aadharBackResponse = await uploadKYCDocument(
          "aadhar_back",
          documents.aadharBack
        );
        if (!aadharBackResponse.success) {
          throw new Error("Failed to upload Aadhar Back to S3");
        }
        aadharBackUrl = aadharBackResponse.data?.url;
      }

      // Upload new PAN Card if selected
      if (documents.panCard) {
        const panCardResponse = await uploadKYCDocument("pan", documents.panCard);
        if (!panCardResponse.success) {
          throw new Error("Failed to upload PAN Card to S3");
        }
        panCardUrl = panCardResponse.data?.url;
      }

      // Verify all URLs are available
      if (!aadharFrontUrl || !aadharBackUrl || !panCardUrl) {
        throw new Error("Failed to get S3 URLs for documents");
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
  const isKycApproved = user?.status === "ACTIVE";

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
            {isKycSubmitted
              ? "KYC documents updated successfully! Your updated documents are now under review. Redirecting to profile..."
              : "KYC documents submitted successfully! Your documents are now under review. Redirecting to profile..."}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* KYC Approved Message */}
        {isKycApproved && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Your KYC documents have been verified and approved. You cannot modify or delete these documents. If you need to update your information, please contact support.
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
                initialUrl={user?.aadharFront}
                onFileSelect={(file) => handleFileSelect("aadharFront", file)}
                onDelete={() => handleKYCDelete("aadharFront")}
                loading={uploading}
                disabled={isKycApproved}
              />
            </Grid>

            {/* Aadhar Back */}
            <Grid item xs={12}>
              <KYCDocumentUpload
                documentType="aadhar_back"
                label="Aadhar Card (Back)"
                initialUrl={user?.aadharBack}
                onFileSelect={(file) => handleFileSelect("aadharBack", file)}
                onDelete={() => handleKYCDelete("aadharBack")}
                loading={uploading}
                disabled={isKycApproved}
              />
            </Grid>

            {/* PAN Card */}
            <Grid item xs={12}>
              <KYCDocumentUpload
                documentType="pan"
                label="PAN Card"
                initialUrl={user?.pan}
                onFileSelect={(file) => handleFileSelect("panCard", file)}
                onDelete={() => handleKYCDelete("panCard")}
                loading={uploading}
                disabled={isKycApproved}
              />
            </Grid>

            {/* Submit Button - Only show if KYC is not approved */}
            {!isKycApproved && (
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
                    ? isKycSubmitted
                      ? "Updating..."
                      : "Submitting..."
                    : isKycSubmitted
                    ? "Update Documents"
                    : "Submit for Verification"}
                </Button>
              </Grid>
            )}
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
