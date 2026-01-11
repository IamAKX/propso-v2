import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

/**
 * Upload property images and videos to S3
 * @param {number} propertyId - Property ID
 * @param {File[]} files - Array of files to upload
 * @returns {Promise<Object>} Upload response data
 */
export const uploadPropertyFiles = async (propertyId, files, token) => {
  try {
    const formData = new FormData();

    // Add all files to form data
    files.forEach((file, index) => {
      formData.append(`file-${index}`, file);
    });

    const response = await axios.post(
      `${API_URL}/uploads/property/${propertyId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
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
export const deletePropertyFile = async (propertyId, fileId, token) => {
  try {
    const response = await axios.delete(
      `${API_URL}/uploads/property/${propertyId}/${fileId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
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
export const uploadKYCDocument = async (documentType, file, token) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(
      `${API_URL}/uploads/kyc/${documentType}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
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
export const deleteKYCDocument = async (documentType, token) => {
  try {
    const response = await axios.delete(
      `${API_URL}/uploads/kyc/${documentType}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("KYC delete error:", error);
    throw new Error(
      error.response?.data?.message || "Failed to delete KYC document"
    );
  }
};
