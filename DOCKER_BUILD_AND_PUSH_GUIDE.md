# Docker Build, Tag, Push & Pull Guide

## Local Build (on your Mac)

### Build Images Locally

```bash
cd /Users/akash/Desktop/Sanath/cp

# Build both images
docker compose build

# Verify images were created
docker images | grep cp-
```

You should see:

- `cp-backend` - Your backend image
- `cp-frontend` - Your frontend image

## Push to Docker Hub

### Step 1: Tag Images for Docker Hub

```bash
# Tag backend image
docker tag cp-backend iamakx/propertycp-backend:latest

# Tag frontend image
docker tag cp-frontend iamakx/propertycp-react:latest

# Verify tags
docker images | grep iamakx
```

### Step 2: Login to Docker Hub

```bash
docker login
# Enter your username (iamakx) and password
```

### Step 3: Push Images

```bash
# Push backend
docker push iamakx/propertycp-backend:latest

# Push frontend
docker push iamakx/propertycp-react:latest

# Watch progress
# Images are now on Docker Hub and can be pulled from EC2
```

## On EC2 - Pull and Run

### Step 1: Pull Images from Docker Hub

```bash
cd ~/propso-v2

# Pull images
docker compose pull

# Verify images were pulled
docker images | grep iamakx
```

### Step 2: Start Services

```bash
# Option A: Simple startup
docker compose up -d

# Option B: Clean restart (recommended)
docker compose down && docker compose pull && docker compose up -d

# Option C: Full reset with volume cleanup
docker compose down -v
docker volume rm propso-v2-backend-db
docker compose pull
docker compose up -d
```

### Step 3: Verify Services

```bash
# Check container status
docker compose ps

# View logs
docker compose logs -f

# Check backend is running
curl http://localhost:3001

# Check frontend is running
curl http://localhost:3000
```

## Summary of Commands

### On Mac (Build & Push)

```bash
cd /Users/akash/Desktop/Sanath/cp
docker compose build
docker tag cp-backend iamakx/propertycp-backend:latest
docker tag cp-frontend iamakx/propertycp-react:latest
docker login
docker push iamakx/propertycp-backend:latest
docker push iamakx/propertycp-react:latest
```

### On EC2 (Pull & Run)

```bash
cd ~/propso-v2
docker compose down && docker compose pull && docker compose up -d
```

## Troubleshooting

### Images not pushing

```bash
# Check Docker Hub login
docker logout
docker login

# Verify username is correct (iamakx)
docker images | grep iamakx
```

### Pulled images but container won't start

```bash
# Check logs
docker compose logs backend

# Verify images are correct in docker-compose.yml
cat docker-compose.yml | grep image:
```

### Want to rebuild and push again

```bash
# On Mac
docker compose down
docker system prune -a -f
docker compose build
docker tag cp-backend iamakx/propertycp-backend:latest
docker tag cp-frontend iamakx/propertycp-react:latest
docker push iamakx/propertycp-backend:latest
docker push iamakx/propertycp-react:latest

# Then on EC2
docker compose pull
docker compose up -d
```
