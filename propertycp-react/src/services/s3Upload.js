import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

// Create axios instance with interceptor to add userId
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Add userId to requests if available
axiosInstance.interceptors.request.use((config) => {
  const userId = localStorage.getItem("userId");
  if (userId) {
    config.headers["X-User-Id"] = userId;
  }
  return config;
});

/**
 * Upload property images and videos to S3
 * @param {number} propertyId - Property ID
 * @param {File[]} files - Array of files to upload
 * @returns {Promise<Object>} Upload response data
 */
export const uploadPropertyFiles = async (propertyId, files) => {
  try {
    const formData = new FormData();

    // Add all files to form data
    files.forEach((file, index) => {
      formData.append(`file-${index}`, file);
    });

    const response = await axiosInstance.post(
      `/uploads/property/${propertyId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Upload error:", error);
    throw new Error(error.response?.data?.message || "Failed to upload files");
  }
};

/**
 * Delete property file from S3
 * @param {number} propertyId - Property ID
 * @param {number} fileId - File ID to delete
 * @returns {Promise<Object>} Delete response data
 */
export const deletePropertyFile = async (propertyId, fileId) => {
  try {
    const response = await axiosInstance.delete(
      `/uploads/property/${propertyId}/${fileId}`
    );

    return response.data;
  } catch (error) {
    console.error("Delete error:", error);
    throw new Error(error.response?.data?.message || "Failed to delete file");
  }
};

/**
 * Upload KYC document to S3
 * @param {string} documentType - 'aadhar_front', 'aadhar_back', or 'pan'
 * @param {File} file - File to upload
 * @returns {Promise<Object>} Upload response data
 */
export const uploadKYCDocument = async (documentType, file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosInstance.post(
      `/uploads/kyc/${documentType}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("KYC upload error:", error);
    throw new Error(
      error.response?.data?.message || "Failed to upload KYC document"
    );
  }
};

/**
 * Delete KYC document from S3
 * @param {string} documentType - 'aadhar_front', 'aadhar_back', or 'pan'
 * @returns {Promise<Object>} Delete response data
 */
export const deleteKYCDocument = async (documentType) => {
  try {
    const response = await axiosInstance.delete(
      `/uploads/kyc/${documentType}`
    );

    return response.data;
  } catch (error) {
    console.error("KYC delete error:", error);
    throw new Error(
      error.response?.data?.message || "Failed to delete KYC document"
    );
  }
};
