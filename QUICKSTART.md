# PropertyCP - Quick Start Guide

Get up and running in 5 minutes!

## 🚀 Method 1: Docker (Recommended - Easiest)

If you have Docker installed, this is the fastest way:

```bash
# Navigate to project root
cd /Users/akash/Documents/cp

# Pull pre-built images and start (one command!)
docker compose down && docker compose pull && docker compose up -d

# Wait 30 seconds for initialization, then access:
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
```

That's it! Skip to the "Default Credentials" section below.

## 🛠️ Method 2: Local Development

### Step 1: Install Bun (Backend Runtime)

```bash
# Install Bun (macOS/Linux)
curl -fsSL https://bun.sh/install | bash

# Verify installation
bun --version
```

### Step 2: Setup Backend

```bash
# Navigate to backend
cd /Users/akash/Documents/cp/propertycp-backend

# Install dependencies
bun install

# Initialize database with sample data
bun run db:init

# Start backend server (in this terminal)
bun run dev
```

✅ Backend running at http://localhost:3001

### Step 3: Setup Frontend

Open a **NEW terminal** window:

```bash
# Navigate to frontend
cd /Users/akash/Documents/cp/propertycp-react

# Install dependencies (first time only)
npm install

# Start frontend (in this terminal)
npm start
```

✅ Frontend running at http://localhost:3000

## 🔑 Default Credentials

Once the app is running, log in with:

**Admin Account** (can see all users and leads):

- Email: `admin@example.com`
- Password: `admin123`

**Agent Account** (can create properties and leads):

- Email: `john@example.com`
- Password: `password123`

## ✨ What to Try First

1. **Login** with admin credentials
2. **Browse Properties** - See the 6 sample properties
3. **Create a Lead** - Click on any property and create a lead
4. **Add Comments** - Navigate to leads and add follow-up comments
5. **User Management** (Admin only) - View all users and their leads
6. **Create Property** - Post a new property listing

## 🐳 Docker Commands

```bash
# Stop everything
docker-compose down

# Restart after making code changes
docker-compose up -d --build

# View logs
docker-compose logs -f

# Clear everything including database
docker-compose down -v
```

## 🛑 Stopping the Application

### Docker:

```bash
docker-compose down
```

### Local Development:

Press `Ctrl+C` in both terminal windows (backend and frontend)

## 📁 Project Files

```
/Users/akash/Documents/cp/
├── propertycp-react/          # Frontend (React + Material-UI)
├── propertycp-backend/        # Backend (Bun + Hono + SQLite)
├── docker-compose.yml         # Docker configuration
└── README.md                  # Full documentation
```

## 🔧 Troubleshooting

### "Port already in use"

```bash
# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9

# Kill process on port 3001 (backend)
lsof -ti:3001 | xargs kill -9
```

### Backend won't start

Make sure Bun is installed:

```bash
bun --version
```

If not installed, run:

```bash
curl -fsSL https://bun.sh/install | bash
```

### Can't login / Database errors

Reinitialize the database:

```bash
cd /Users/akash/Documents/cp/propertycp-backend
bun run db:init
```

### Frontend shows "Network Error"

Make sure backend is running on port 3001:

```bash
curl http://localhost:3001
# Should return: {"success":true,"message":"PropertyCP Backend API","version":"1.0.0"}
```

## 📖 Need More Help?

- Full Documentation: `/Users/akash/Documents/cp/README.md`
- Backend API Docs: `/Users/akash/Documents/cp/propertycp-backend/README.md`
- API Endpoints: See README.md for complete API reference

## 🎯 Next Steps

1. Explore the sample data (6 properties, 3 leads, 3 users)
2. Try creating new properties and leads
3. Test admin features (user management, view all leads)
4. Modify the code and see hot-reload in action
5. Deploy to production using Docker

Enjoy using PropertyCP! 🏠🚀
