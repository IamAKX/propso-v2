# AWS EC2 Deployment Guide - PropertyCP

## Table of Contents
1. [Data Persistence](#data-persistence)
2. [Deployment Steps](#deployment-steps)
3. [Configuration](#configuration)
4. [Backup Strategies](#backup-strategies)

---

## Data Persistence

### Understanding EC2 Instance States

Your SQLite database is stored at `./database/propertycp.db` in the project directory. Here's what happens to your data in different scenarios:

#### ✅ STOP Instance (Data Preserved)
When you **STOP** an EC2 instance:
- All data on EBS (Elastic Block Store) volumes is **preserved**
- Your SQLite database file will remain intact
- You can restart the instance later and everything will be there
- You only pay for EBS storage, not for the instance compute time
- **This is safe for temporary shutdowns**

#### ❌ TERMINATE Instance (Data Lost by Default)
When you **TERMINATE** an EC2 instance:
- By default, the root EBS volume is **deleted**
- All data including your database is **lost**
- You cannot restart the instance
- **Only terminate if you want to permanently destroy the instance**

#### ✅ REBOOT Instance (Data Preserved)
When you **REBOOT** an EC2 instance:
- All data is preserved
- Similar to restarting your computer
- **This is safe**

---

## Best Practices for Data Safety

### Option 1: Disable "Delete on Termination" (Recommended)

When launching your EC2 instance, ensure the EBS volume persists even after termination:

**Via AWS CLI:**
```bash
aws ec2 run-instances \
  --image-id ami-xxxxxxxxx \
  --instance-type t2.micro \
  --key-name your-key-pair \
  --security-group-ids sg-xxxxxxxxx \
  --block-device-mappings '[
    {
      "DeviceName": "/dev/xvda",
      "Ebs": {
        "VolumeSize": 20,
        "VolumeType": "gp3",
        "DeleteOnTermination": false
      }
    }
  ]'
```

**Via AWS Console:**
1. When launching an instance, go to "Configure Storage"
2. Uncheck "Delete on Termination" for the root volume
3. This ensures your data persists even if you accidentally terminate the instance

### Option 2: Attach a Separate EBS Volume (Production Best Practice)

Create a dedicated EBS volume for your database:

```bash
# Create a new EBS volume
aws ec2 create-volume \
  --size 20 \
  --availability-zone us-east-1a \
  --volume-type gp3

# Attach to your instance
aws ec2 attach-volume \
  --volume-id vol-xxxxxxxxx \
  --instance-id i-xxxxxxxxx \
  --device /dev/sdf

# Mount the volume (on EC2 instance)
sudo mkfs -t ext4 /dev/xvdf
sudo mkdir /mnt/database
sudo mount /dev/xvdf /mnt/database
sudo chown ubuntu:ubuntu /mnt/database

# Update database path in environment
echo "DATABASE_PATH=/mnt/database/propertycp.db" >> .env
```

### Option 3: Regular Automated Backups

Set up daily backups using cron:

```bash
# Create backup directory
mkdir -p ~/backups

# Add to crontab (crontab -e)
0 2 * * * cp ~/propertycp-backend/database/propertycp.db ~/backups/propertycp-$(date +\%Y\%m\%d).db

# Keep only last 7 days of backups
0 3 * * * find ~/backups -name "propertycp-*.db" -mtime +7 -delete
```

### Option 4: AWS EBS Snapshots (Automated Backups)

Create automated snapshots of your EBS volume:

**Via AWS CLI:**
```bash
# Create a snapshot
aws ec2 create-snapshot \
  --volume-id vol-xxxxxxxxx \
  --description "PropertyCP Database Backup $(date +%Y-%m-%d)"

# Schedule automated snapshots using AWS Data Lifecycle Manager
aws dlm create-lifecycle-policy \
  --execution-role-arn arn:aws:iam::123456789012:role/AWSDataLifecycleManagerDefaultRole \
  --description "Daily PropertyCP Backups" \
  --state ENABLED \
  --policy-details file://backup-policy.json
```

**backup-policy.json:**
```json
{
  "PolicyType": "EBS_SNAPSHOT_MANAGEMENT",
  "ResourceTypes": ["VOLUME"],
  "TargetTags": [
    {
      "Key": "Application",
      "Value": "PropertyCP"
    }
  ],
  "Schedules": [
    {
      "Name": "Daily Snapshots",
      "CreateRule": {
        "Interval": 24,
        "IntervalUnit": "HOURS",
        "Times": ["03:00"]
      },
      "RetainRule": {
        "Count": 7
      },
      "CopyTags": true
    }
  ]
}
```

---

## Deployment Steps

### 1. Prepare Your EC2 Instance

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js (for frontend)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Bun (for backend)
curl -fsSL https://bun.sh/install | bash
echo 'export PATH="$HOME/.bun/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# Install nginx
sudo apt install -y nginx

# Install PM2 for process management
sudo npm install -g pm2
```

### 2. Clone and Setup Backend

```bash
# Clone repository
git clone <your-repo-url> ~/propertycp
cd ~/propertycp/propertycp-backend

# Install dependencies
bun install

# Create database directory
mkdir -p database

# Setup environment variables
cat > .env << EOF
DATABASE_PATH=./database/propertycp.db
JWT_SECRET=$(openssl rand -hex 32)
PORT=3001
NODE_ENV=production
EOF

# Initialize database
bun run src/db/init.ts

# Start backend with PM2
pm2 start --name "propertycp-backend" bun -- run src/index.ts
pm2 save
pm2 startup
```

### 3. Build and Setup Frontend

```bash
cd ~/propertycp/propertycp-react

# Install dependencies
npm install

# Create production environment
cat > .env.production << EOF
REACT_APP_API_URL=http://your-ec2-public-ip:3001/api
EOF

# Build for production
npm run build

# Copy build to nginx
sudo cp -r build/* /var/www/html/
```

### 4. Configure Nginx

```bash
sudo tee /etc/nginx/sites-available/propertycp << EOF
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/html;
        try_files \$uri \$uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

sudo ln -s /etc/nginx/sites-available/propertycp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 5. Configure Security Group

Ensure your EC2 security group allows:
- Port 22 (SSH)
- Port 80 (HTTP)
- Port 443 (HTTPS - if using SSL)
- Port 3001 (Backend - only if not using nginx proxy)

---

## Configuration

### Environment Variables

**Backend (.env):**
```bash
DATABASE_PATH=./database/propertycp.db
JWT_SECRET=your-secure-secret-key
PORT=3001
NODE_ENV=production
CORS_ORIGIN=http://your-domain.com
```

**Frontend (.env.production):**
```bash
REACT_APP_API_URL=http://your-domain.com/api
```

---

## Backup Strategies

### Manual Backup

```bash
# Backup database
cp ~/propertycp-backend/database/propertycp.db ~/backup-$(date +%Y%m%d).db

# Backup to S3
aws s3 cp ~/propertycp-backend/database/propertycp.db \
  s3://your-bucket/backups/propertycp-$(date +%Y%m%d).db
```

### Restore from Backup

```bash
# Stop backend
pm2 stop propertycp-backend

# Restore database
cp ~/backup-20240103.db ~/propertycp-backend/database/propertycp.db

# Restart backend
pm2 start propertycp-backend
```

---

## Verify Your Setup

### Check EBS Volume Configuration

```bash
# See your EBS volumes
aws ec2 describe-volumes --filters \
  Name=attachment.instance-id,Values=i-xxxxxxxxx

# Check if delete-on-termination is false
aws ec2 describe-instances --instance-ids i-xxxxxxxxx \
  --query 'Reservations[].Instances[].BlockDeviceMappings[].Ebs.DeleteOnTermination'
```

### Monitor Application

```bash
# Check PM2 status
pm2 status
pm2 logs propertycp-backend

# Check nginx status
sudo systemctl status nginx

# Monitor disk usage
df -h
```

---

## Troubleshooting

### Database Connection Issues
```bash
# Check database file permissions
ls -la ~/propertycp-backend/database/

# Ensure proper ownership
sudo chown -R ubuntu:ubuntu ~/propertycp-backend/database/
```

### Backend Not Starting
```bash
# Check PM2 logs
pm2 logs propertycp-backend --lines 100

# Restart backend
pm2 restart propertycp-backend
```

### Nginx Issues
```bash
# Test nginx configuration
sudo nginx -t

# Check error logs
sudo tail -f /var/log/nginx/error.log
```

---

## Production Considerations

1. **SSL/TLS**: Use Let's Encrypt with Certbot for HTTPS
2. **Monitoring**: Set up CloudWatch or alternative monitoring
3. **Scaling**: Consider RDS instead of SQLite for multi-instance deployments
4. **CDN**: Use CloudFront for static assets
5. **Load Balancer**: Use ALB for multiple instances
6. **Auto-scaling**: Configure auto-scaling groups for high availability

---

## Quick Reference

| Action | Data Safe? | Notes |
|--------|-----------|-------|
| STOP instance | ✅ Yes | Data preserved, can restart later |
| REBOOT instance | ✅ Yes | Similar to computer restart |
| TERMINATE instance | ⚠️ Maybe | Only safe if "Delete on Termination" is disabled |
| EBS Snapshot | ✅ Yes | Point-in-time backup |
| Manual Backup | ✅ Yes | Copy database file |

---

## Support

For issues or questions:
1. Check logs: `pm2 logs propertycp-backend`
2. Verify configuration: Review `.env` files
3. Check database: `ls -la database/`
4. Monitor resources: `htop` or `top`
