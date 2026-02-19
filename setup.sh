#!/bin/bash

# FYNOR Clone - Development Setup Script
# This script sets up the local development environment
#
# Note: For Railway/production deployments, the database schema is
# automatically initialized on first startup by the backend server.
# This script is for local development only.

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
psql -U postgres -d fynor_clone -f backend/schema.sql 2>/dev/null

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database schema initialized${NC}"
else
    echo -e "${YELLOW}⚠️  Default psql command failed - attempting fallbacks...${NC}"

    # Fallback 1: try running as postgres system user (common on Linux)
    if command -v sudo &> /dev/null; then
        echo "Trying: sudo -u postgres psql -d fynor_clone -f backend/schema.sql"
        sudo -u postgres psql -d fynor_clone -f backend/schema.sql
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Database schema initialized (via sudo -u postgres)${NC}"
        else
            echo -e "${YELLOW}⚠️  sudo fallback failed. Trying DATABASE_URL from backend/.env if available...${NC}"

            # Fallback 2: try using DATABASE_URL from backend/.env if present
            if [ -f backend/.env ]; then
                DATABASE_URL=$(grep '^DATABASE_URL=' backend/.env | cut -d'=' -f2-)
                if [ -n "$DATABASE_URL" ]; then
                    echo "Trying: psql \"$DATABASE_URL\" -f backend/schema.sql"
                    psql "$DATABASE_URL" -f backend/schema.sql
                    if [ $? -eq 0 ]; then
                        echo -e "${GREEN}✅ Database schema initialized (via DATABASE_URL)${NC}"
                    else
                        echo -e "${RED}❌ Failed to initialize database schema using DATABASE_URL${NC}"
                        exit 1
                    fi
                else
                    echo -e "${RED}❌ DATABASE_URL not found in backend/.env${NC}"
                    exit 1
                fi
            else
                echo -e "${RED}❌ backend/.env not found; cannot use DATABASE_URL fallback${NC}"
                exit 1
            fi
        fi
    else
        echo -e "${RED}❌ sudo not available to attempt postgres user fallback${NC}"
        exit 1
    fi
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
echo "2. Start the application: npm start"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "The backend automatically serves the frontend on the same port."
echo "For detailed instructions, see README.md"
echo "================================"
