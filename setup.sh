#!/bin/bash

# FYNOR Clone - Automated Setup Script
# This script automates the setup process

echo "🚀 FYNOR Clone - Setup Script"
echo "================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if PostgreSQL is installed
echo "📦 Checking prerequisites..."
if ! command -v psql &> /dev/null; then
    echo -e "${RED}❌ PostgreSQL is not installed${NC}"
    echo "Please install PostgreSQL first:"
    echo "  macOS: brew install postgresql"
    echo "  Ubuntu: sudo apt-get install postgresql"
    exit 1
fi
echo -e "${GREEN}✅ PostgreSQL found${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi
echo -e "${GREEN}✅ Node.js found ($(node --version))${NC}"

echo ""
echo "📊 Setting up database..."

# Create database
echo "Creating database 'fynor_clone'..."
psql -U postgres -c "CREATE DATABASE fynor_clone;" 2>/dev/null

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database created${NC}"
else
    echo -e "${YELLOW}⚠️  Database might already exist, continuing...${NC}"
fi

# Run schema
echo "Initializing database schema..."
psql -U postgres -d fynor_clone -f database/schema.sql

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database schema initialized${NC}"
else
    echo -e "${RED}❌ Failed to initialize database schema${NC}"
    exit 1
fi

echo ""
echo "📦 Installing backend dependencies..."
cd backend
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend dependencies installed${NC}"
else
    echo -e "${RED}❌ Failed to install backend dependencies${NC}"
    exit 1
fi

cd ..

echo ""
echo "⚙️  Configuring environment..."

if [ ! -f backend/.env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Please create one from .env.example${NC}"
    echo ""
    echo "Required steps:"
    echo "1. Copy backend/.env file"
    echo "2. Update DATABASE_URL"
    echo "3. Add Google OAuth credentials from https://console.cloud.google.com/"
    echo "   - GOOGLE_CLIENT_ID"
    echo "   - GOOGLE_CLIENT_SECRET"
    echo "4. Generate random secrets for JWT_SECRET and SESSION_SECRET"
else
    echo -e "${GREEN}✅ .env file found${NC}"
fi

echo ""
echo "================================"
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Update backend/.env with your Google OAuth credentials"
echo "2. Start the backend: cd backend && npm start"
echo "3. In a new terminal, start the frontend: cd frontend && python3 -m http.server 8080"
echo "4. Open http://localhost:8080 in your browser"
echo ""
echo "For detailed instructions, see README.md"
echo "================================"
