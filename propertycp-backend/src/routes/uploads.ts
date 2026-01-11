import { Hono } from 'hono';
import { authMiddleware, AuthUser } from '../middleware/auth';
import { uploadToS3, deleteFromS3, generatePropertyImageKey, generateKYCDocumentKey } from '../services/s3';
import db, { toCamelCase } from '../db/database';

const uploads = new Hono();

/**
 * Upload property images and video
 * Body: multipart/form-data with images and video files
 */
uploads.post('/property/:propertyId', authMiddleware, async (c) => {
  try {
    const currentUser = c.get('user') as AuthUser;
    const propertyId = c.req.param('propertyId');
    const formData = await c.req.formData();

    // Verify property exists and belongs to user
    const property = db.prepare('SELECT created_by_id, images FROM properties WHERE id = ?').get(propertyId) as any;

    if (!property) {
      return c.json(
        {
          success: false,
          message: 'Property not found',
        },
        404
      );
    }

    if (property.created_by_id !== currentUser.id && currentUser.userType !== 'Admin') {
      return c.json(
        {
          success: false,
          message: 'Unauthorized to upload images for this property',
        },
        403
      );
    }

    const uploadedFiles: Array<{ url: string; type: string; isVideo: boolean }> = [];

    // Process each file
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        const buffer = await value.arrayBuffer();
        const bufferData = Buffer.from(buffer);

        // Determine file type
        const isVideo = value.type.startsWith('video/');
        const fileType = isVideo ? 'video' : 'image';

        // Validate video duration (for 10sec check, will be done on frontend primarily)
        if (isVideo) {
          const maxVideoSize = 100 * 1024 * 1024; // 100MB max
          if (bufferData.length > maxVideoSize) {
            return c.json(
              {
                success: false,
                message: 'Video file too large. Maximum size is 100MB',
              },
              400
            );
          }
        }

        // Validate image size
        if (!isVideo) {
          const maxImageSize = 10 * 1024 * 1024; // 10MB max
          if (bufferData.length > maxImageSize) {
            return c.json(
              {
                success: false,
                message: 'Image file too large. Maximum size is 10MB',
              },
              400
            );
          }
        }

        // Upload to S3
        const s3Key = generatePropertyImageKey(currentUser.id, propertyId, value.name);
        const url = await uploadToS3({
          key: s3Key,
          body: bufferData,
          contentType: value.type,
        });

        uploadedFiles.push({
          url,
          type: fileType,
          isVideo,
        });
      }
    }

    if (uploadedFiles.length === 0) {
      return c.json(
        {
          success: false,
          message: 'No files uploaded',
        },
        400
      );
    }

    // Parse existing images
    let existingImages = [];
    if (property.images) {
      existingImages = JSON.parse(property.images);
    }

    // Add new files to existing images
    const id = Math.max(...existingImages.map((img: any) => img.id || 0)) + 1;
    const newImages = uploadedFiles.map((file, index) => ({
      id: id + index,
      link: file.url,
      isVideo: file.isVideo,
      propertyId: parseInt(propertyId),
    }));

    const allImages = [...existingImages, ...newImages];

    // Update property with new images
    db.prepare('UPDATE properties SET images = ?, updated_date = datetime("now") WHERE id = ?').run(
      JSON.stringify(allImages),
      propertyId
    );

    return c.json({
      success: true,
      message: 'Files uploaded successfully',
      data: {
        uploadedCount: uploadedFiles.length,
        files: newImages,
        allImages,
      },
    });
  } catch (error: any) {
    console.error('Property upload error:', error);
    return c.json(
      {
        success: false,
        message: error.message || 'Failed to upload files',
      },
      500
    );
  }
});

/**
 * Delete property image/video
 */
uploads.delete('/property/:propertyId/:fileId', authMiddleware, async (c) => {
  try {
    const currentUser = c.get('user') as AuthUser;
    const propertyId = c.req.param('propertyId');
    const fileId = c.req.param('fileId');

    // Verify property exists and belongs to user
    const property = db.prepare('SELECT created_by_id, images FROM properties WHERE id = ?').get(propertyId) as any;

    if (!property) {
      return c.json(
        {
          success: false,
          message: 'Property not found',
        },
        404
      );
    }

    if (property.created_by_id !== currentUser.id && currentUser.userType !== 'Admin') {
      return c.json(
        {
          success: false,
          message: 'Unauthorized to delete images for this property',
        },
        403
      );
    }

    // Parse images and find the one to delete
    let images = [];
    if (property.images) {
      images = JSON.parse(property.images);
    }

    const fileToDelete = images.find((img: any) => img.id === parseInt(fileId));

    if (!fileToDelete) {
      return c.json(
        {
          success: false,
          message: 'File not found',
        },
        404
      );
    }

    // Delete from S3
    await deleteFromS3(fileToDelete.link);

    // Remove from images array
    const updatedImages = images.filter((img: any) => img.id !== parseInt(fileId));

    // Update property
    db.prepare('UPDATE properties SET images = ?, updated_date = datetime("now") WHERE id = ?').run(
      JSON.stringify(updatedImages),
      propertyId
    );

    return c.json({
      success: true,
      message: 'File deleted successfully',
      data: {
        remainingImages: updatedImages,
      },
    });
  } catch (error: any) {
    console.error('Property delete error:', error);
    return c.json(
      {
        success: false,
        message: error.message || 'Failed to delete file',
      },
      500
    );
  }
});

/**
 * Upload KYC documents
 */
uploads.post('/kyc/:documentType', authMiddleware, async (c) => {
  try {
    const currentUser = c.get('user') as AuthUser;
    const documentType = c.req.param('documentType'); // 'aadhar_front', 'aadhar_back', 'pan'
    const formData = await c.req.formData();

    // Validate document type and map to actual DB column names
    const columnMap: Record<string, string> = {
      aadhar_front: 'aadhar_front',
      aadhar_back: 'aadhar_back',
      pan: 'pan',
      pan_card: 'pan',
    };

    if (!Object.keys(columnMap).includes(documentType)) {
      return c.json(
        {
          success: false,
          message: 'Invalid document type',
        },
        400
      );
    }

    // Get file from form data
    const file = formData.get('file') as File;

    if (!file) {
      return c.json(
        {
          success: false,
          message: 'No file provided',
        },
        400
      );
    }

    // Validate file is an image
    if (!file.type.startsWith('image/')) {
      return c.json(
        {
          success: false,
          message: 'Only image files are allowed',
        },
        400
      );
    }

    // Validate file size
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return c.json(
        {
          success: false,
          message: 'File too large. Maximum size is 10MB',
        },
        400
      );
    }

    // Read file and upload to S3
    const buffer = await file.arrayBuffer();
    const bufferData = Buffer.from(buffer);

    const s3Key = generateKYCDocumentKey(currentUser.id, documentType, file.name);
    const url = await uploadToS3({
      key: s3Key,
      body: bufferData,
      contentType: file.type,
    });

    // If user already has this document, delete old one from S3
    const snakeCaseColumn = columnMap[documentType];
    const user = db.prepare(`SELECT ${snakeCaseColumn} FROM users WHERE id = ?`).get(currentUser.id) as any;
    if (user && user[snakeCaseColumn]) {
      try {
        await deleteFromS3(user[snakeCaseColumn]);
      } catch (err) {
        console.error('Error deleting old document from S3:', err);
      }
    }

    // Update user record (coerce values to safe types for SQLite bindings)
    const safeUrl = typeof url === 'string' ? url : String(url);
    const safeUserId = typeof currentUser.id === 'number' ? currentUser.id : Number(currentUser.id);
    db.prepare(`UPDATE users SET ${snakeCaseColumn} = ?, updated_date = datetime("now") WHERE id = ?`).run(safeUrl, safeUserId);

    return c.json({
      success: true,
      message: `${documentType.replace('_', ' ')} uploaded successfully`,
      data: {
        documentType,
        url,
      },
    });
  } catch (error: any) {
    console.error('KYC upload error:', error);
    return c.json(
      {
        success: false,
        message: error.message || 'Failed to upload KYC document',
      },
      500
    );
  }
});

/**
 * Delete KYC document
 */
uploads.delete('/kyc/:documentType', authMiddleware, async (c) => {
  try {
    const currentUser = c.get('user') as AuthUser;
    const documentType = c.req.param('documentType');

    // Validate document type and map to actual DB column names
    const columnMap: Record<string, string> = {
      aadhar_front: 'aadhar_front',
      aadhar_back: 'aadhar_back',
      pan: 'pan',
      pan_card: 'pan',
    };

    if (!Object.keys(columnMap).includes(documentType)) {
      return c.json(
        {
          success: false,
          message: 'Invalid document type',
        },
        400
      );
    }

    // Get user's current document (map to actual DB column)
    const snakeCaseColumn = columnMap[documentType];
    const user = db.prepare(`SELECT ${snakeCaseColumn} FROM users WHERE id = ?`).get(currentUser.id) as any;

    if (!user || !user[snakeCaseColumn]) {
      return c.json(
        {
          success: false,
          message: 'No document found to delete',
        },
        404
      );
    }

    // Delete from S3
    await deleteFromS3(user[snakeCaseColumn]);

    // Clear from user record
    db.prepare(`UPDATE users SET ${snakeCaseColumn} = NULL, updated_date = datetime("now") WHERE id = ?`).run(
      currentUser.id
    );

    return c.json({
      success: true,
      message: `${documentType.replace('_', ' ')} deleted successfully`,
    });
  } catch (error: any) {
    console.error('KYC delete error:', error);
    return c.json(
      {
        success: false,
        message: error.message || 'Failed to delete KYC document',
      },
      500
    );
  }
});

export default uploads;
