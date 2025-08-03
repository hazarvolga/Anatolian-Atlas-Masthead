# NextStopTurkey - Tours & Travel Management System 🇹🇷

A comprehensive tours and travel booking platform built with React, TypeScript, and PostgreSQL. Features a modern frontend with Vite and a robust backend API with Express.js.

## 📋 Latest Release - Stable R5 (v1.5.0-stable)

✅ **Fully Functional Admin CRUD Operations**
- ✅ Tour Creation/Update/Delete with proper validation
- ✅ Destination Creation/Update/Delete with unique slug generation
- ✅ Foreign key constraint resolution and proper field mapping
- ✅ Difficulty level conversion (string ↔ integer) working correctly
- ✅ Comprehensive error handling and logging
- ✅ Database schema enhancements with pricing models
- ✅ Frontend-backend data synchronization verified

🔧 **Technical Improvements**
- Fixed all Prisma constraint violations
- Implemented unique slug generation algorithms
- Enhanced type safety across the application
- Added comprehensive database seeding
- Improved API error responses and validation

## 🚀 Features

### Frontend (React + TypeScript + Vite)
- **Modern UI/UX**: Beautiful, responsive design with Tailwind CSS
- **Multi-language Support**: English, Turkish, Spanish, Italian
- **Tour Browsing**: Advanced search and filtering capabilities
- **Booking System**: Complete reservation management
- **Admin Dashboard**: Full content management system
- **Real-time Pricing**: Dynamic pricing with seasonal adjustments
- **Email Integration**: Automated booking confirmations and notifications

### Backend (Express.js + PostgreSQL)
- **RESTful API**: Clean and documented endpoints
- **Database**: PostgreSQL with proper migrations
- **Authentication**: Secure user management
- **Email Service**: Automated email notifications
- **Admin Panel**: Complete tour and booking management
- **Docker Support**: Containerized development and deployment

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **React Query** for data management
- **React Router** for navigation
- **React Hook Form** for form handling

### Backend
- **Express.js** with TypeScript
- **PostgreSQL** database
- **Docker** containerization
- **JWT** authentication
- **Email services** integration

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 18+ and npm
- Docker and Docker Compose
- Git

### 🚀 One-Command Setup (Recommended)
```bash
# Clone and start everything automatically
git clone https://github.com/hazarvolga/NextStopTurkey.git
cd NextStopTurkey
./start-dev.sh
```

This script automatically:
- Starts PostgreSQL database
- Installs all dependencies
- Runs database migrations  
- Starts backend API server
- Starts frontend development server

### Manual Installation

```bash
# Clone the repository
git clone https://github.com/hazarvolga/NextStopTurkey.git
cd NextStopTurkey

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### Development Setup

1. **Start PostgreSQL Database**
```bash
# Start PostgreSQL with Docker
docker-compose up -d postgres
```

2. **Setup Backend Environment**
```bash
# Copy and configure backend environment
cp backend/.env.example backend/.env
# Edit backend/.env with your database credentials
```

3. **Run Database Migrations**
```bash
cd backend
npm run migrate
cd ..
```

4. **Seed the Database (Optional)**
```bash
# Populate the database with sample tours and destinations
cd backend
npm run seed
cd ..
```

5. **Start Backend API**
```bash
cd backend
npm run dev
cd ..
```

6. **Setup Frontend Environment**
```bash
# Copy and configure frontend environment
cp .env.example .env.local
# Edit .env.local with your API URL
```

7. **Start Frontend Development Server**
```bash
npm run dev
```

### 🐳 Full Docker Setup
```bash
# Run everything in Docker containers
docker-compose up -d

# Follow logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Access Points
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001
- **Database:** localhost:5432 (postgres/postgres123/nextstopturkey)
- **Health Check:** http://localhost:3001/health

## ✅ Current Status
- ✅ Local PostgreSQL setup completed
- ✅ Database migrations successful  
- ✅ Backend API running on port 3001
- ✅ Frontend running on port 5173
- ✅ Supabase dependencies removed
- ✅ Docker configuration ready
- ✅ Production deployment scripts ready

### Environment Variables

#### Frontend (.env.local)
```bash
VITE_API_URL=http://localhost:3001
VITE_APP_NAME=NextStopTurkey
```

#### Backend (.env)
```bash
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nextstopturkey
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
EMAIL_SERVICE=your_email_service
```

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/96f629c9-6031-4f68-8bd0-680a3c64b6e3) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)
