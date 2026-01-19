import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

const AWS_REGION = process.env.AWS_REGION || 'eu-north-1';
const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'propertycp';

console.log('🔧 S3 Configuration:', {
  region: AWS_REGION,
  bucket: BUCKET_NAME,
  hasAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
  hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY,
});

const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
  endpoint: `https://s3.${AWS_REGION}.amazonaws.com`,
  forcePathStyle: false,
});

interface UploadOptions {
  key: string;
  body: Buffer;
  contentType: string;
}

/**
 * Upload file to S3
 */
export async function uploadToS3(options: UploadOptions): Promise<string> {
  try {
    const { key, body, contentType } = options;

    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: BUCKET_NAME,
        Key: key,
        Body: body,
        ContentType: contentType,
        // ACL removed - use bucket policy or presigned URLs instead
      },
    });

    await upload.done();
    const fileUrl = `https://${BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${key}`;
    console.log(`✅ File uploaded to S3: ${fileUrl}`);
    return fileUrl;
  } catch (error: any) {
    console.error('❌ S3 upload error:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.Code || error.$metadata?.httpStatusCode,
      region: AWS_REGION,
      bucket: BUCKET_NAME,
    });
    throw new Error(`Failed to upload file to S3: ${error.name || error.message}`);
  }
}

/**
 * Delete file from S3
 */
export async function deleteFromS3(s3Key: string): Promise<void> {
  try {
    // Extract key from full URL if needed
    const key = s3Key.includes('amazonaws.com') ? s3Key.split('/').pop() : s3Key;

    if (!key) {
      throw new Error('Invalid S3 key');
    }

    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      })
    );

    console.log(`✅ File deleted from S3: ${key}`);
  } catch (error: any) {
    console.error('❌ S3 delete error:', error);
    throw new Error(`Failed to delete file from S3: ${error.message}`);
  }
}

/**
 * Generate S3 key for property images
 */
export function generatePropertyImageKey(userId: number, propertyId: number | string, fileName: string): string {
  const timestamp = Date.now();
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `properties/user-${userId}/property-${propertyId}/${timestamp}-${sanitizedFileName}`;
}

/**
 * Generate S3 key for KYC documents
 */
export function generateKYCDocumentKey(userId: number, documentType: string, fileName: string): string {
  const timestamp = Date.now();
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `kyc/user-${userId}/${documentType}/${timestamp}-${sanitizedFileName}`;
}

/**
 * Extract S3 key from full URL
 */
export function extractS3KeyFromUrl(url: string): string {
  if (!url.includes('amazonaws.com')) {
    return url;
  }
  const parts = url.split('/');
  return parts.slice(3).join('/');
}

export default s3Client;
