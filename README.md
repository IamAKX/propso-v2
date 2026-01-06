# PropertyCP - Real Estate Property Management System

A modern, full-stack property management application with React frontend and Bun + Hono + SQLite backend.

## 🏗️ Architecture

- **Frontend**: React 18 + Material-UI + React Router
- **Backend**: Bun Runtime + Hono Framework + SQLite Database
- **Deployment**: Docker + Docker Compose

## 📦 Project Structure

```
propertycp/
├── propertycp-react/          # Frontend React application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── screens/           # Page components
│   │   ├── context/           # React Context providers
│   │   ├── services/          # API services
│   │   └── index.js           # Application entry point
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── propertycp-backend/        # Backend API server
│   ├── src/
│   │   ├── routes/            # API route handlers
│   │   ├── middleware/        # Auth & other middleware
│   │   ├── db/                # Database schema & initialization
│   │   └── index.ts           # Server entry point
│   ├── Dockerfile
│   └── package.json
│
└── docker-compose.yml         # Docker orchestration
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ (for frontend)
- **Bun** 1.0+ (for backend) - [Install Bun](https://bun.sh/)
- **Docker** (optional, for containerized deployment)

### Option 1: Local Development

#### 1. Setup Backend

```bash
# Navigate to backend directory
cd propertycp-backend

# Install dependencies
bun install

# Create .env file (use .env.example as template)
cp .env.example .env

# Initialize and seed database
bun run db:init

# Start backend server
bun run dev
```

Backend will be running at `http://localhost:3001`

#### 2. Setup Frontend

```bash
# Navigate to frontend directory (in new terminal)
cd propertycp-react

# Install dependencies
npm install

# Create .env file (use .env.example as template)
cp .env.example .env

# Start frontend development server
npm start
```

Frontend will be running at `http://localhost:3000`

### Option 2: Docker Deployment

```bash
# From the root directory containing docker-compose.yml
docker-compose up -d

# To stop
docker-compose down

# To rebuild after code changes
docker-compose up -d --build
```

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:3001`

## 🔑 Default Credentials

After seeding the database, you can log in with:

**Admin User:**
- Email: `admin@example.com`
- Password: `admin123`

**Agent User:**
- Email: `john@example.com`
- Password: `password123`

**Another Agent:**
- Email: `jane@example.com`
- Password: `password123`

## 🌟 Features

### User Management
- User registration and authentication
- JWT-based authorization
- Role-based access control (Admin, Agent, Buyer)
- User profile management
- KYC verification system

### Property Management
- Create, view, update, and delete properties
- Property listing with filters (city, type)
- Property images and videos
- Residential and Commercial properties
- Property favorites system

### Lead Management
- Create leads from properties
- Lead status management (Open/Closed)
- Lead comments and follow-ups
- Lead assignment to agents
- Admin view of all leads

### Admin Features
- User list and management
- View all properties
- View all leads across agents
- User status management

## 🆕 Recent Updates

### New API Endpoints Added
- **GET** `/api/users/mobile/:mobileNo` - Get user by mobile number
- **GET** `/api/users/email/:email` - Get user by email address
- **POST** `/api/properties/get-multiple` - Get multiple properties by IDs (batch fetch)
- **DELETE** `/api/leads/:id` - Delete lead endpoint

### Production-Ready Improvements
- **Enhanced Docker Security** - Non-root users in containers
- **Resource Limits** - CPU and memory constraints in docker-compose
- **Environment Variables** - Proper .env configuration with production examples
- **Health Checks** - Enhanced container health monitoring
- **AWS Deployment Guide** - Complete EC2 deployment documentation

### SQLite Database Setup
SQLite is already integrated and configured. The database:
- **Auto-initializes** on first run with sample data
- **Location**: `./database/propertycp.db` (backend)
- **Schema**: Users, Properties, Leads, Favorites tables
- **Persistence**: Data persists across container restarts via Docker volumes

**Manual Database Initialization:**
```bash
cd propertycp-backend
bun run db:init
```

## 📡 API Documentation

### Base URL
- Development: `http://localhost:3001/api`
- Docker: `http://localhost:3001/api`
- Production (AWS): `http://YOUR_EC2_IP:3001/api`

### Authentication Endpoints

#### POST /api/auth/login
Login with email and password.

**Request:**
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { /* user object */ },
    "token": "jwt_token_here"
  }
}
```

#### POST /api/auth/register
Register a new user.

**Request:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "mobileNo": "9876543210",
  "userType": "Agent"
}
```

### Property Endpoints

#### GET /api/properties
Get all properties with optional filters.

**Query Parameters:**
- `city` (optional): Filter by city
- `propertyType` (optional): Filter by type (Residential/Commercial)

#### GET /api/properties/:id
Get property by ID.

#### POST /api/properties
Create a new property (requires authentication).

**Request:**
```json
{
  "title": "Luxury Apartment",
  "subTitle": "Prime Location",
  "price": "5000000",
  "numberOfRooms": "5",
  "bhk": "3",
  "location": "MG Road",
  "city": "Bangalore",
  "mainImage": "https://...",
  "images": [/* array of image objects */],
  "type": "Residential",
  "area": "1500",
  "areaUnit": "Sqft",
  "description": "Beautiful apartment...",
  "builderPhoneNumber": "9876543210"
}
```

#### PUT /api/properties/:id
Update property (requires authentication).

#### DELETE /api/properties/:id
Delete property (requires authentication).

### Lead Endpoints

#### GET /api/leads
Get all leads (admin only).

#### GET /api/leads/user/:userId
Get leads by user ID (requires authentication).

#### GET /api/leads/:id
Get lead by ID (requires authentication).

#### POST /api/leads
Create a new lead (requires authentication).

**Request:**
```json
{
  "leadPropertyType": "Buy",
  "propertyType": "Residential",
  "mobileNo": "9988776655",
  "fullName": "Customer Name",
  "propertyId": 1
}
```

#### PUT /api/leads/:id
Update lead (requires authentication).

#### DELETE /api/leads/:id
Delete lead (requires authentication, creator or admin only).

**Response:**
```json
{
  "success": true,
  "message": "Lead deleted successfully",
  "data": true
}
```

#### POST /api/leads/:id/comments
Add comment to lead (requires authentication).

**Request:**
```json
{
  "comment": "Follow-up scheduled for tomorrow"
}
```

### User Endpoints

#### GET /api/users
Get all users (admin only).

#### GET /api/users/:id
Get user by ID (requires authentication).

#### GET /api/users/mobile/:mobileNo
Get user by mobile number.

**Request:**
```bash
GET /api/users/mobile/9876543210
```

#### GET /api/users/email/:email
Get user by email address.

**Request:**
```bash
GET /api/users/email/john@example.com
```

#### PUT /api/users/:id
Update user (requires authentication).

#### DELETE /api/users/:id
Delete user (admin only).

### Batch Property Retrieval

#### POST /api/properties/get-multiple
Get multiple properties by their IDs (useful for favorites).

**Request:**
```json
POST /api/properties/get-multiple
{
  "ids": [1, 2, 3, 5, 8]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Properties fetched successfully",
  "data": [/* array of property objects */]
}
```

### Favorites Endpoints

#### GET /api/favorites
Get user's favorite properties (requires authentication).

#### GET /api/favorites/check/:propertyId
Check if property is favorited (requires authentication).

#### POST /api/favorites/:propertyId
Add property to favorites (requires authentication).

#### DELETE /api/favorites/:propertyId
Remove property from favorites (requires authentication).

## 🔒 Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

The token is automatically included in requests when using the frontend application.

## 🗄️ Database Schema

### Users Table
- id, fullName, email, password, mobileNo, status, userType, image
- aadharFront, aadharBack, pan, vpa, referralCode, isKycVerified
- createdDate, updatedDate

### Properties Table
- id, title, subTitle, price, numberOfRooms, bhk, location, city
- mainImage, images (JSON), type, area, areaUnit, description
- builderPhoneNumber, createdById, createdDate, updatedDate

### Leads Table
- id, leadPropertyType, propertyType, mobileNo, fullName, status
- leadCommentModel (JSON), createdById, propertyId
- createdDate, updatedDate

### Favorites Table
- id, userId, propertyId, createdDate

## 🐳 Docker Commands

### Build and Start
```bash
docker-compose up -d --build
```

### View Logs
```bash
# All services
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# Frontend only
docker-compose logs -f frontend
```

### Stop Services
```bash
docker-compose down
```

### Remove Volumes (Clear Database)
```bash
docker-compose down -v
```

### Access Container Shell
```bash
# Backend
docker exec -it propertycp-backend sh

# Frontend
docker exec -it propertycp-frontend sh
```

## 📊 Resource Usage

The entire stack is optimized to run under **512MB RAM**:

- **Backend (Bun + Hono + SQLite)**: ~100-120MB
- **Frontend (Nginx serving static files)**: ~20-30MB
- **Database (SQLite)**: ~10-20MB
- **Total**: ~150-180MB (leaving headroom for operations)

## 🛠️ Development

### Backend Development

```bash
cd propertycp-backend

# Start with hot reload
bun run dev

# Reinitialize database
bun run db:init
```

### Frontend Development

```bash
cd propertycp-react

# Start development server
npm start

# Build for production
npm run build
```

## 📝 Environment Variables

### Root Directory (.env)
Copy `.env.example` to `.env` and configure:

```env
# Backend Configuration
BACKEND_PORT=3001
NODE_ENV=production

# Database Configuration
DATABASE_PATH=./database/propertycp.db

# Security - IMPORTANT: Change in production!
JWT_SECRET=your-super-secure-random-64-character-secret

# Frontend Configuration
REACT_APP_API_URL=http://localhost:3001/api
```

### Backend (.env)
```env
PORT=3001
DATABASE_PATH=./database/propertycp.db
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:3001/api
```

**For Production (AWS EC2):**
```env
REACT_APP_API_URL=http://YOUR_EC2_PUBLIC_IP:3001/api
```

## 🚨 Troubleshooting

### Backend won't start
- Ensure Bun is installed: `bun --version`
- Check if port 3001 is available: `lsof -i :3001`
- Verify database directory exists and has write permissions

### Frontend won't connect to backend
- Check if backend is running on port 3001
- Verify `REACT_APP_API_URL` in frontend `.env`
- Check browser console for CORS errors

### Docker containers won't start
- Ensure Docker is running: `docker --version`
- Check if ports 3000 and 3001 are available
- View logs: `docker-compose logs`

### Database errors
- Reinitialize database: `bun run db:init`
- Check database file permissions
- Verify SQLite is working: `sqlite3 --version`

## 🔄 Migration from C# to Node.js

The application has been successfully migrated from:
- **Backend**: C# (ASP.NET Core) with SQL Server → Node.js (Bun + Hono) with SQLite
- **Frontend**: Flutter → React.js with Material-UI

### Migration Status: ✅ Complete

**API Parity:**
- All C# API endpoints have been replicated in Node.js
- Additional endpoints added for improved functionality
- JWT authentication fully implemented
- SQLite database with proper schema and relationships

**Database Migration:**
- SQL Server → SQLite (lightweight, serverless)
- All tables and relationships preserved
- Sample data included for testing
- Database auto-initializes on first run

## 🔄 Migration from Mock API

The application has been migrated from an in-memory mock API to a real SQLite database with REST API backend. All data is now persisted and available across sessions.

## 🚀 AWS EC2 Deployment

For complete deployment instructions on AWS EC2, see:
**[AWS_DEPLOYMENT_GUIDE.md](AWS_DEPLOYMENT_GUIDE.md)**

Quick deployment steps:
1. Launch EC2 instance (t2.small recommended)
2. Install Docker and Docker Compose
3. Clone repository and configure `.env`
4. Run `docker-compose up -d --build`
5. Access via `http://YOUR_EC2_IP:3000`

**Detailed guide covers:**
- EC2 instance setup and configuration
- Security group configuration
- SSL certificate installation
- Domain setup with Nginx
- Monitoring and maintenance
- Backup and restore procedures
- Troubleshooting common issues
- Cost optimization tips

## 🔒 Security Best Practices

### Production Deployment
- [ ] Change default JWT_SECRET to a secure random string
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS with SSL certificate (Let's Encrypt)
- [ ] Restrict database file permissions
- [ ] Use non-root users in Docker containers (already configured)
- [ ] Configure firewall rules (UFW on EC2)
- [ ] Regular security updates: `sudo apt update && sudo apt upgrade`
- [ ] Change default user passwords
- [ ] Regular database backups
- [ ] Monitor application logs for suspicious activity

### Docker Security Features
- ✅ Non-root users in containers
- ✅ Resource limits (CPU/memory)
- ✅ Health checks configured
- ✅ Production-only dependencies
- ✅ Security updates in base images

## 📱 Mobile Responsiveness

The React frontend uses Material-UI and is designed to be mobile-friendly. However, there are some responsive design improvements recommended:

### Known Issues:
- Statistics cards may be too crowded on mobile (xs={4} breakpoint)
- Some images have fixed dimensions that don't scale on small screens
- Certain flex layouts could benefit from responsive breakpoints

### Recommendations:
For detailed responsive design audit and fixes, see the development documentation.

## 📊 Performance Optimization

**Current Resource Usage:**
- Backend (Bun + SQLite): ~100-120MB RAM
- Frontend (Nginx static): ~20-30MB RAM
- Total: ~150-180MB RAM

**Optimizations Applied:**
- Docker multi-stage builds for smaller images
- Production-only dependencies
- Nginx serving static files efficiently
- SQLite for lightweight database operations
- Bun runtime for fast JavaScript execution

## 📄 License

This project is private and proprietary.

## 👥 Contributors

- Property Management Team

## 📚 Additional Documentation

- [AWS_DEPLOYMENT_GUIDE.md](AWS_DEPLOYMENT_GUIDE.md) - Complete AWS EC2 deployment guide
- [QUICKSTART.md](QUICKSTART.md) - Quick start guide for local development
- [BACKEND_DOCUMENTATION.md](BACKEND_DOCUMENTATION.md) - Original C# backend API documentation
- [FRONTEND_DOCUMENTATION.md](FRONTEND_DOCUMENTATION.md) - Frontend documentation
- [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) - Implementation summary

## 📞 Support

For issues or questions:
- Create an issue in the repository
- Refer to troubleshooting sections in documentation
- Check AWS_DEPLOYMENT_GUIDE.md for deployment issues
