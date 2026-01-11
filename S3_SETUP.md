# S3 Integration Setup Guide

## What Was Implemented

✅ AWS S3 integration for:

- Property image uploads (max 5 images per property)
- Property video uploads (max 1 video per property)
- KYC document uploads (Aadhar front, Aadhar back, PAN)
- File deletion from both S3 and database

✅ Frontend Components:

- `MediaUploadManager.js` - Upload/manage multiple images & videos
- `KYCDocumentUpload.js` - Upload/manage single KYC documents
- `s3Upload.js` - API service for all uploads

✅ Backend:

- `src/services/s3.ts` - S3 upload/delete functions
- `src/routes/uploads.ts` - API endpoints for uploads
- Integration in `src/index.ts`

---

## AWS S3 Setup

### Step 1: Create S3 Bucket

1. Go to [AWS S3 Console](https://console.aws.amazon.com/s3/)
2. Click "Create bucket"
3. **Bucket name**: `propertycp-bucket` (use unique name)
4. **Region**: `eu-north-1` (or your preferred region)
5. Uncheck "Block all public access" (we need public read)
6. Click "Create bucket"

### Step 2: Configure Bucket Permissions

**Add Bucket Policy:**

1. Go to bucket → **Permissions** tab
2. Click **Bucket policy**
3. Paste this policy (replace bucket name):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicRead",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::propertycp-bucket/*"
    }
  ]
}
```

**Configure CORS:**

1. Go to bucket → **Permissions** tab
2. Scroll to **CORS** and click **Edit**
3. Paste this:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

### Step 3: Create IAM User

1. Go to [IAM Console](https://console.aws.amazon.com/iam/)
2. Click **Users** → **Create user**
3. **Username**: `propertycp-app`
4. Next: Attach **AmazonS3FullAccess** policy
5. Click **Create user**

### Step 4: Generate Access Keys

1. Click on `propertycp-app` user
2. Go to **Security credentials** tab
3. Click **Create access key**
4. Choose **Application running outside AWS**
5. Click **Create access key**
6. **Save these values:**
   - Access Key ID
   - Secret Access Key

---

## Configure Environment Variables

### Update .env

Edit `/Users/akash/Desktop/Sanath/cp/.env`:

```bash
# AWS S3 Configuration
AWS_REGION=eu-north-1
AWS_ACCESS_KEY_ID=your-copied-access-key-id
AWS_SECRET_ACCESS_KEY=your-copied-secret-access-key
AWS_S3_BUCKET=propertycp-bucket

# Keep existing variables
BACKEND_PORT=3001
NODE_ENV=production
DATABASE_PATH=./database/propertycp.db
JWT_SECRET=your-secure-random-key
REACT_APP_API_URL=http://YOUR_EC2_IP:3001/api
CORS_ALLOW_ALL_IPS=true
CORS_ALLOW_ALL=false
```

---

## Rebuild Docker Container

### Option 1: Local Testing

```bash
cd /Users/akash/Desktop/Sanath/cp/propertycp-backend

# Install dependencies
bun install

# Go back to project root
cd ..

# Rebuild backend container
docker compose build --no-cache backend

# Restart backend with new environment
docker compose up -d --force-recreate backend

# Verify it's running
docker compose logs backend
```

### Option 2: On EC2 (Production)

```bash
# SSH into EC2
ssh -i /path/to/key.pem ubuntu@YOUR_EC2_IP

# Navigate to project
cd ~/propertycp

# Pull latest changes if using git
git pull

# Update .env with AWS credentials
nano .env
# (Add AWS configuration variables shown above)

# Rebuild backend
docker compose build --no-cache backend
docker compose up -d --force-recreate backend

# Verify
docker compose logs backend
```

---

## Verify Backend is Running

```bash
# Check container status
docker compose ps

# Test backend endpoint
curl http://localhost:3001

# Should return: {"success":true,"message":"PropertyCP Backend API","version":"1.0.0"}
```

---

## API Endpoints

| Method | Endpoint                            | Purpose               |
| ------ | ----------------------------------- | --------------------- |
| POST   | `/api/uploads/property/:id`         | Upload property files |
| DELETE | `/api/uploads/property/:id/:fileId` | Delete property file  |
| POST   | `/api/uploads/kyc/:type`            | Upload KYC document   |
| DELETE | `/api/uploads/kyc/:type`            | Delete KYC document   |

---

## Frontend Integration

### 1. PostProperty.js

Add these imports:

```javascript
import MediaUploadManager from "../components/MediaUploadManager";
import { uploadPropertyFiles } from "../services/s3Upload";
```

Add state:

```javascript
const [selectedFiles, setSelectedFiles] = useState([]);
const [uploading, setUploading] = useState(false);
```

After creating property, upload files:

```javascript
if (selectedFiles.length > 0) {
  setUploading(true);
  await uploadPropertyFiles(newProperty.id, selectedFiles, token);
  setUploading(false);
}
```

Add component to JSX:

```javascript
<MediaUploadManager
  onFilesSelected={setSelectedFiles}
  maxImages={5}
  maxVideos={1}
  loading={uploading}
/>
```

### 2. EditProperty.js

Similar to PostProperty - add MediaUploadManager with delete handlers:

```javascript
import { uploadPropertyFiles, deletePropertyFile } from "../services/s3Upload";

const handleDeleteFile = async (file) => {
  await deletePropertyFile(propertyId, file.id, token);
  setProperty({ ...property, images: result.data.remainingImages });
};

const handleAddFiles = async (files) => {
  const result = await uploadPropertyFiles(propertyId, files, token);
  setProperty({ ...property, images: result.data.allImages });
};
```

### 3. KYC.js

Replace file inputs with KYCDocumentUpload:

```javascript
import KYCDocumentUpload from "../components/KYCDocumentUpload";
import { uploadKYCDocument, deleteKYCDocument } from "../services/s3Upload";

const handleUpload = async (documentType, file) => {
  const result = await uploadKYCDocument(documentType, file, token);
  setUser({ ...user, [documentType]: result.data.url });
};

const handleDelete = async (documentType) => {
  await deleteKYCDocument(documentType, token);
  setUser({ ...user, [documentType]: null });
};
```

Add to JSX:

```javascript
<KYCDocumentUpload
  documentType="aadhar_front"
  label="Aadhar Front Side"
  initialUrl={user?.aadharFront}
  onUpload={(file) => handleUpload('aadhar_front', file)}
  onDelete={() => handleDelete('aadhar_front')}
/>

<KYCDocumentUpload
  documentType="aadhar_back"
  label="Aadhar Back Side"
  initialUrl={user?.aadharBack}
  onUpload={(file) => handleUpload('aadhar_back', file)}
  onDelete={() => handleDelete('aadhar_back')}
/>

<KYCDocumentUpload
  documentType="pan"
  label="PAN Card"
  initialUrl={user?.pan}
  onUpload={(file) => handleUpload('pan', file)}
  onDelete={() => handleDelete('pan')}
/>
```

---

## File Limits

| Type    | Size  | Count          |
| ------- | ----- | -------------- |
| Image   | 10MB  | 5 per property |
| Video   | 100MB | 1 per property |
| KYC Doc | 10MB  | 1 per type     |

---

## Troubleshooting

| Issue               | Solution                            |
| ------------------- | ----------------------------------- |
| 403 Unauthorized    | Check AWS credentials in .env       |
| CORS error          | Verify CORS config on S3 bucket     |
| Files not uploading | Check file size & type limits       |
| Backend won't start | Check `docker compose logs backend` |
| S3 bucket not found | Verify bucket name in .env          |

---

## S3 File Structure

```
s3://propertycp-bucket/
├── properties/
│   └── user-{userId}/
│       └── property-{propertyId}/
│           └── {timestamp}-{filename}
└── kyc/
    └── user-{userId}/
        ├── aadhar_front/{timestamp}-file
        ├── aadhar_back/{timestamp}-file
        └── pan/{timestamp}-file
```

---

## Quick Reference

```bash
# Rebuild backend locally
docker compose build --no-cache backend

# Restart backend
docker compose up -d --force-recreate backend

# View logs
docker compose logs -f backend

# Check container status
docker compose ps
```

---

**Status**: Ready to integrate frontend components and test uploads! 🚀
