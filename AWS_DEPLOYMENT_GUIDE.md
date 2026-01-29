# AWS EC2 Deployment Guide for PropertyCP

Complete guide to deploy PropertyCP (React frontend + Node.js backend + SQLite database) on AWS EC2.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [EC2 Instance Setup](#ec2-instance-setup)
3. [Server Configuration](#server-configuration)
4. [Application Deployment](#application-deployment)
5. [Domain and SSL Setup (Optional)](#domain-and-ssl-setup-optional)
6. [Monitoring and Maintenance](#monitoring-and-maintenance)
7. [Troubleshooting](#troubleshooting)
8. [Cost Optimization](#cost-optimization)

---

## Prerequisites

### Local Machine Requirements

- AWS Account with billing enabled
- AWS CLI installed (optional but recommended)
- SSH client (Terminal on Mac/Linux, PuTTY on Windows)
- Git installed

### AWS Resources Needed

- EC2 instance (t2.micro or t2.small recommended)
- Security Group with proper inbound rules
- Key Pair for SSH access
- Elastic IP (optional, for static IP)

---

## EC2 Instance Setup

### Step 1: Launch EC2 Instance

1. **Login to AWS Console**
   - Navigate to EC2 Dashboard
   - Click "Launch Instance"

2. **Configure Instance**

   **Name and Tags:**

   ```
   Name: propertycp-server
   ```

   **Application and OS Images (AMI):**

   ```
   Ubuntu Server 22.04 LTS (HVM), SSD Volume Type
   Architecture: 64-bit (x86)
   ```

   **Instance Type:**

   ```
   t2.small (2 vCPU, 2 GiB RAM) - Recommended
   or
   t2.micro (1 vCPU, 1 GiB RAM) - For testing (may be slow)
   ```

   **Key Pair:**
   - Create new key pair or use existing
   - Name: `propertycp-key`
   - Type: RSA
   - Format: .pem (for Mac/Linux) or .ppk (for Windows/PuTTY)
   - **IMPORTANT:** Download and save securely

   **Network Settings:**
   - Create new security group or use existing
   - Security group name: `propertycp-sg`
   - Description: Security group for PropertyCP application

   **Inbound Rules:**
   | Type | Protocol | Port Range | Source | Description |
   |------|----------|------------|--------|-------------|
   | SSH | TCP | 22 | My IP or 0.0.0.0/0 | SSH access |
   | HTTP | TCP | 80 | 0.0.0.0/0 | HTTP traffic |
   | HTTPS | TCP | 443 | 0.0.0.0/0 | HTTPS traffic (future) |
   | Custom TCP | TCP | 3000 | 0.0.0.0/0 | Frontend React app |
   | Custom TCP | TCP | 3001 | 0.0.0.0/0 | Backend API |

   **Storage:**

   ```
   Type: gp3 (General Purpose SSD)
   Size: 20 GiB (minimum), 30 GiB (recommended)
   ```

3. **Review and Launch**
   - Review all settings
   - Click "Launch Instance"
   - Wait for instance state to become "Running"

4. **Note Your Instance Details**
   ```
   Instance ID: i-xxxxxxxxxxxxx
   Public IPv4 Address: XX.XXX.XXX.XXX
   Public IPv4 DNS: ec2-XX-XXX-XXX-XXX.compute-1.amazonaws.com
   ```

### Step 2: Connect to EC2 Instance

#### On Mac/Linux:

```bash
# Set proper permissions for key file
chmod 400 /path/to/propertycp-key.pem

# Connect via SSH
ssh -i /path/to/propertycp-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

#### On Windows (using PuTTY):

1. Convert .pem to .ppk using PuTTYgen
2. Open PuTTY
3. Enter Host Name: `ubuntu@YOUR_EC2_PUBLIC_IP`
4. Connection > SSH > Auth > Browse and select .ppk file
5. Click "Open"

---

## Server Configuration

### Step 3: Update System and Install Dependencies

```bash
# Update package lists
sudo apt update && sudo apt upgrade -y

# Install essential tools
sudo apt install -y curl wget git unzip build-essential

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add ubuntu user to docker group
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installations
docker --version
docker-compose --version

# Log out and back in for group changes to take effect
exit
```

**Reconnect to the server:**

```bash
ssh -i /path/to/propertycp-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

### Step 4: Configure Firewall (UFW)

```bash
# Enable UFW
sudo ufw allow 22/tcp      # SSH
sudo ufw allow 80/tcp      # HTTP
sudo ufw allow 443/tcp     # HTTPS
sudo ufw allow 3000/tcp    # Frontend
sudo ufw allow 3001/tcp    # Backend
sudo ufw --force enable

# Check status
sudo ufw status
```

---

## Application Deployment

### Step 5: Clone Repository

```bash
# Navigate to home directory
cd ~

# Clone your repository (replace with your actual repo)
git clone https://github.com/iamakx/propertycp.git

# Or upload files using SCP if not using Git:
# scp -i propertycp-key.pem -r /local/path/to/cp ubuntu@YOUR_EC2_PUBLIC_IP:~/propso-v2
```

### Step 6: Configure Environment Variables

```bash
# Navigate to project directory
cd ~/propertycp

# Copy environment template
cp .env.example .env

# Edit environment file
nano .env
```

**Update .env with production values:**

```bash
# Backend Configuration
BACKEND_PORT=3001
NODE_ENV=production

# Database Configuration
DATABASE_PATH=./database/propertycp.db

# Security - Generate a secure secret
JWT_SECRET=your-super-secure-random-64-character-secret-key-here

# Frontend Configuration - Use your EC2 public IP
REACT_APP_API_URL=http://YOUR_EC2_PUBLIC_IP:3001/api
```

**Generate secure JWT secret:**

```bash
# Generate random 64-character string
openssl rand -base64 48
```

**Save and exit:** Press `Ctrl+X`, then `Y`, then `Enter`

### Step 7: Start Application

```bash
# Make sure you're in the project directory
cd ~/propso-v2

# Pull pre-built images and start services (RECOMMENDED - Fastest on t3.small)
docker compose pull
docker compose up -d

# Or with full cleanup/restart:
docker compose down && docker compose pull && docker compose up -d

# This will:
# 1. Pull pre-built backend image from Docker Hub (iamakx/propertycp-backend:latest)
# 2. Pull pre-built frontend image from Docker Hub (iamakx/propertycp-react:latest)
# 3. Start both containers
# 4. Initialize SQLite database with seed data automatically

# Wait 30 seconds for services to start, then verify:
docker compose ps
curl http://localhost:3001
```

**Note**: The docker-compose.yml is configured with `image:` references, so it pulls pre-built images instead of building. No building needed on EC2!

````

### Step 8: Verify Deployment

```bash
# Check container status
docker-compose ps

# Expected output:
# NAME                   STATUS          PORTS
# propertycp-backend     Up (healthy)    0.0.0.0:3001->3001/tcp
# propertycp-frontend    Up (healthy)    0.0.0.0:3000->3000/tcp

# View logs
docker-compose logs -f

# Check specific service logs
docker-compose logs backend
docker-compose logs frontend

# Test backend API
curl http://localhost:3001
# Expected: {"success":true,"message":"PropertyCP Backend API","version":"1.0.0"}

# Test frontend
curl http://localhost:3000
# Expected: HTML content
````

### Step 9: Access Your Application

Open your browser and navigate to:

**Frontend:**

```
http://YOUR_EC2_PUBLIC_IP:3000
```

**Backend API:**

```
http://YOUR_EC2_PUBLIC_IP:3001
```

**Default Login Credentials:**

- Admin: admin@example.com / admin123
- Agent: john@example.com / password123

---

## Domain and SSL Setup (Optional)

### Option 1: Using Nginx Reverse Proxy with Let's Encrypt

#### Install Nginx

```bash
# Install Nginx
sudo apt install -y nginx

# Stop nginx temporarily
sudo systemctl stop nginx
```

#### Configure Nginx

```bash
# Create nginx configuration
sudo nano /etc/nginx/sites-available/propertycp
```

**Add this configuration:**

```nginx
# Backend API Server
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Frontend React App
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Enable configuration:**

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/propertycp /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Start nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

#### Install SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com

# Auto-renewal is configured automatically
# Test renewal
sudo certbot renew --dry-run
```

#### Update Environment Variables

```bash
cd ~/propertycp
nano .env
```

Update API URL:

```bash
REACT_APP_API_URL=https://api.yourdomain.com/api
```

Rebuild frontend:

```bash
docker-compose up -d --build frontend
```

---

## Monitoring and Maintenance

### View Application Logs

```bash
# View all logs
docker-compose logs -f

# View backend logs only
docker-compose logs -f backend

# View frontend logs only
docker-compose logs -f frontend

# View last 100 lines
docker-compose logs --tail=100
```

### Check Database

```bash
# Access backend container
docker exec -it propertycp-backend sh

# Inside container, check database
bun run src/db/init.ts

# Or access SQLite directly
sqlite3 /app/database/propertycp.db
.tables
.schema users
SELECT * FROM users;
.exit

# Exit container
exit
```

### Restart Services

```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart backend
docker-compose restart frontend

# Stop all services
docker-compose down

# Start all services
docker-compose up -d
```

### Update Application

```bash
# Navigate to project directory
cd ~/propertycp

# Pull latest changes (if using Git)
git pull origin main

# Rebuild and restart
docker-compose up -d --build

# Or without downtime (recreate only changed services)
docker-compose up -d --build --no-deps frontend
docker-compose up -d --build --no-deps backend
```

### Backup Database

```bash
# Create backup directory
mkdir -p ~/backups

# Backup database
docker cp propertycp-backend:/app/database/propertycp.db ~/backups/propertycp-$(date +%Y%m%d-%H%M%S).db

# Automated daily backup (add to crontab)
crontab -e

# Add this line:
0 2 * * * docker cp propertycp-backend:/app/database/propertycp.db ~/backups/propertycp-$(date +\%Y\%m\%d).db
```

### Restore Database

```bash
# Stop backend
docker-compose stop backend

# Copy backup to container
docker cp ~/backups/propertycp-YYYYMMDD-HHMMSS.db propertycp-backend:/app/database/propertycp.db

# Start backend
docker-compose start backend
```

### Monitor Resource Usage

```bash
# System resources
htop  # or top

# Docker stats
docker stats

# Disk usage
df -h

# Docker disk usage
docker system df
```

---

## Troubleshooting

### Issue 1: Cannot connect to EC2 instance

**Solution:**

```bash
# Check Security Group allows SSH from your IP
# Verify key permissions
chmod 400 /path/to/propertycp-key.pem

# Check instance status in AWS console
# Try using instance DNS instead of IP
```

### Issue 2: Containers won't start

**Solution:**

```bash
# Check logs
docker-compose logs

# Check if ports are already in use
sudo lsof -i :3000
sudo lsof -i :3001

# Remove old containers and volumes
docker-compose down -v
docker system prune -a

# Rebuild
docker-compose up -d --build
```

### Issue 3: Frontend can't connect to backend

**Solution:**

```bash
# Check backend is running
curl http://localhost:3001

# Verify REACT_APP_API_URL in .env
# Make sure to use PUBLIC IP, not localhost

# Rebuild frontend with correct API URL
docker-compose up -d --build frontend
```

### Issue 4: Database errors

**Solution:**

```bash
# Reinitialize database
docker exec -it propertycp-backend bun run src/db/init.ts

# Check database file exists
docker exec -it propertycp-backend ls -la /app/database/

# Check permissions
docker exec -it propertycp-backend ls -la /app/database/propertycp.db
```

### Issue 5: Out of memory

**Solution:**

```bash
# Check memory usage
free -h

# Restart services
docker-compose restart

# Consider upgrading instance type to t2.small or t2.medium
# Add swap space:
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### Issue 6: SSL certificate issues

**Solution:**

```bash
# Renew certificate manually
sudo certbot renew

# Check nginx configuration
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx

# Check certificate expiry
sudo certbot certificates
```

---

## Cost Optimization

### Estimated Monthly Costs

**t2.micro (Free Tier eligible for 12 months):**

- Instance: $0 (if in free tier) or ~$8/month
- Storage (30 GB): ~$3/month
- Data Transfer: ~$1-5/month
- **Total: ~$4-13/month**

**t2.small (Recommended):**

- Instance: ~$17/month
- Storage (30 GB): ~$3/month
- Data Transfer: ~$1-5/month
- **Total: ~$21-25/month**

### Cost Saving Tips

1. **Use Reserved Instances** - Save up to 75% for 1-3 year commitment
2. **Stop instance when not needed** - Development/testing environments
3. **Use Elastic IP** - Avoid charges by associating it to running instance
4. **Monitor Data Transfer** - Use CloudFront for heavy traffic
5. **Clean up snapshots** - Delete old EBS snapshots regularly
6. **Right-size instance** - Monitor usage and downgrade if underutilized

### Stopping/Starting Instance

```bash
# Before stopping, on EC2 instance
cd ~/propertycp
docker-compose down

# In AWS Console: Stop instance (not terminate)
# To restart: Start instance in AWS Console, then SSH and run:
cd ~/propertycp
docker-compose up -d
```

---

## Production Checklist

Before going live, ensure:

- [ ] JWT_SECRET is a secure random string (not default)
- [ ] Firewall (UFW) is enabled with only necessary ports
- [ ] SSL certificate is installed (if using domain)
- [ ] Database backups are configured (cron job)
- [ ] Monitoring is set up (CloudWatch or similar)
- [ ] Security Group rules are restrictive (not 0.0.0.0/0 for SSH)
- [ ] Instance has Elastic IP (if you need static IP)
- [ ] Application logs are being monitored
- [ ] Default credentials have been changed
- [ ] Docker containers restart on failure (restart: unless-stopped)

---

## Support and Resources

**AWS Documentation:**

- [EC2 User Guide](https://docs.aws.amazon.com/ec2/)
- [Security Best Practices](https://docs.aws.amazon.com/security/)

**Docker Documentation:**

- [Docker Compose](https://docs.docker.com/compose/)
- [Docker Security](https://docs.docker.com/engine/security/)

**Application Support:**

- GitHub Issues: [Your repository URL]
- Documentation: `/README.md`, `/QUICKSTART.md`

---

## Quick Command Reference

```bash
# SSH to server
ssh -i propertycp-key.pem ubuntu@YOUR_EC2_IP

# View logs
docker-compose logs -f

# Restart application
docker-compose restart

# Update and restart
cd ~/propertycp && git pull && docker-compose up -d --build

# Backup database
docker cp propertycp-backend:/app/database/propertycp.db ~/backup-$(date +%Y%m%d).db

# Check status
docker-compose ps

# View resource usage
docker stats

# Stop application
docker-compose down

# Start application
docker-compose up -d
```

---

**Last Updated:** 2025-01-03
**Version:** 1.0

For questions or issues, please refer to the main README.md or create an issue in the repository.
