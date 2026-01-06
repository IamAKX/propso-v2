#!/bin/bash

# PropertyCP Setup Script
# This script automates the setup process for PropertyCP

set -e  # Exit on error

echo "🏠 PropertyCP Setup Script"
echo "=========================="
echo ""

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: docker-compose.yml not found!"
    echo "Please run this script from the project root directory."
    exit 1
fi

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check for Docker
echo "📦 Checking prerequisites..."
if command_exists docker && command_exists docker-compose; then
    echo "✅ Docker found"
    USE_DOCKER=true
else
    echo "⚠️  Docker not found. Will setup for local development."
    USE_DOCKER=false
fi

# Check for Bun (needed for local development)
if ! $USE_DOCKER; then
    echo ""
    echo "Checking for Bun..."
    if ! command_exists bun; then
        echo "📥 Bun not found. Installing Bun..."
        curl -fsSL https://bun.sh/install | bash

        # Source the shell config to get bun in PATH
        if [ -f "$HOME/.bashrc" ]; then
            source "$HOME/.bashrc"
        elif [ -f "$HOME/.zshrc" ]; then
            source "$HOME/.zshrc"
        fi

        if command_exists bun; then
            echo "✅ Bun installed successfully"
        else
            echo "❌ Failed to install Bun. Please install manually: https://bun.sh/"
            exit 1
        fi
    else
        echo "✅ Bun found"
    fi
fi

# Check for Node.js (needed for frontend)
if ! $USE_DOCKER; then
    echo ""
    echo "Checking for Node.js..."
    if ! command_exists node; then
        echo "❌ Node.js not found. Please install Node.js 18+ from https://nodejs.org/"
        exit 1
    else
        NODE_VERSION=$(node --version)
        echo "✅ Node.js found: $NODE_VERSION"
    fi
fi

echo ""
echo "=========================="
echo ""

# Setup based on available tools
if $USE_DOCKER; then
    echo "🐳 Setting up with Docker..."
    echo ""

    # Build and start containers
    echo "Building and starting containers..."
    docker-compose up -d --build

    echo ""
    echo "⏳ Waiting for services to be ready..."
    sleep 10

    # Check if services are running
    if docker-compose ps | grep -q "Up"; then
        echo "✅ Services are running!"
        echo ""
        echo "🎉 Setup complete!"
        echo ""
        echo "📱 Access the application:"
        echo "   Frontend: http://localhost:3000"
        echo "   Backend:  http://localhost:3001"
        echo ""
        echo "🔑 Default credentials:"
        echo "   Admin: admin@example.com / admin123"
        echo "   Agent: john@example.com / password123"
        echo ""
        echo "📊 View logs: docker-compose logs -f"
        echo "🛑 Stop: docker-compose down"
    else
        echo "❌ Services failed to start. Check logs with: docker-compose logs"
        exit 1
    fi
else
    echo "🛠️  Setting up for local development..."
    echo ""

    # Setup backend
    echo "1️⃣  Setting up backend..."
    cd propertycp-backend

    if [ ! -f ".env" ]; then
        echo "Creating .env file..."
        cp .env.example .env
    fi

    echo "Installing backend dependencies..."
    bun install

    echo "Initializing database..."
    bun run db:init

    echo "✅ Backend setup complete"
    echo ""

    # Setup frontend
    echo "2️⃣  Setting up frontend..."
    cd ../propertycp-react

    if [ ! -f ".env" ]; then
        echo "Creating .env file..."
        cp .env.example .env
    fi

    echo "Installing frontend dependencies..."
    npm install

    echo "✅ Frontend setup complete"
    echo ""

    cd ..

    echo "🎉 Setup complete!"
    echo ""
    echo "📝 To start the application:"
    echo ""
    echo "Terminal 1 (Backend):"
    echo "  cd propertycp-backend"
    echo "  bun run dev"
    echo ""
    echo "Terminal 2 (Frontend):"
    echo "  cd propertycp-react"
    echo "  npm start"
    echo ""
    echo "📱 Then access:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend:  http://localhost:3001"
    echo ""
    echo "🔑 Default credentials:"
    echo "   Admin: admin@example.com / admin123"
    echo "   Agent: john@example.com / password123"
fi

echo ""
echo "📖 For more information, see:"
echo "   - QUICKSTART.md - Quick start guide"
echo "   - README.md - Full documentation"
echo ""
echo "Enjoy using PropertyCP! 🏠✨"
