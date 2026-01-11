import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'propertycp-bucket';

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
        ACL: 'public-read', // Make file publicly readable
      },
    });

    await upload.done();
    const fileUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;
    console.log(`✅ File uploaded to S3: ${fileUrl}`);
    return fileUrl;
  } catch (error: any) {
    console.error('❌ S3 upload error:', error);
    throw new Error(`Failed to upload file to S3: ${error.message}`);
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
