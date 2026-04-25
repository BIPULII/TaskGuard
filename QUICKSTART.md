# TaskGuard - Quick Start Guide

This guide will help you set up and run the TaskGuard application locally.

## Prerequisites

- Node.js 18+ (Download from https://nodejs.org/)
- PostgreSQL (Download from https://www.postgresql.org/download/ or use Docker)
- Git
- A code editor (VS Code recommended)

## Project Structure

```
TaskGuard/
├── backend/          # Express.js + TypeScript backend API
├── frontend/         # Next.js + TypeScript frontend
├── PLAN.md          # Development plan
├── README.md        # Project documentation
├── .env.example     # Example environment variables
└── .gitignore       # Git ignore rules
```

## Setup Instructions

### 1. Database Setup (PostgreSQL)

#### Option A: Local PostgreSQL Installation

```bash
# Create a new database
createdb taskguard_db

# Verify connection
psql -U postgres -d taskguard_db -c "SELECT version();"
```

#### Option B: Docker

```bash
# Run PostgreSQL in Docker
docker run --name taskguard-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=taskguard_db \
  -p 5432:5432 \
  -d postgres:latest
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file from example
cp ../.env.example .env

# Update .env with your database URL
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/taskguard_db"

# Setup Prisma database and migrations
npx prisma migrate dev --name init

# (Optional) Seed sample data
npx prisma db seed

# Start the backend server
npm run dev
```

The backend will run on: **http://localhost:5000**

### 3. Frontend Setup

```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env.local file
cp .env.local.example .env.local

# Start the frontend server
npm run dev
```

The frontend will run on: **http://localhost:3000**

## Using the Application

### Demo Credentials

Once the backend is running, you can use these credentials to test:

**Email:** test@example.com  
**Password:** Test@1234

Or register a new account at: **http://localhost:3000/register**

### Features to Test

1. **Authentication**
   - Register a new account
   - Login with credentials
   - Token management

2. **Dashboard**
   - View task statistics
   - See all your tasks
   - Filter by status or priority

3. **Task Management**
   - Create new tasks
   - Edit existing tasks
   - Delete tasks
   - Mark tasks as complete/in progress/todo

## API Endpoints

### Auth Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user

### Task Endpoints (Protected)

- `GET /api/tasks` - Get all user tasks
- `GET /api/tasks/stats` - Get task statistics
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## Troubleshooting

### Backend Issues

**Error: "connect ECONNREFUSED 127.0.0.1:5432"**

- PostgreSQL is not running
- Solution: Start PostgreSQL service

**Error: "Environment variable DATABASE_URL not found"**

- .env file is missing
- Solution: Create .env file with DATABASE_URL

**Error: "Cannot find module '@prisma/client'"**

- Dependencies not installed
- Solution: Run `npm install` in backend directory

### Frontend Issues

**Error: "Cannot find module 'next'"**

- Dependencies not installed
- Solution: Run `npm install` in frontend directory

**Error: "API connection refused"**

- Backend is not running
- Solution: Start backend with `npm run dev`

**Endless redirect loop on login**

- Token management issue
- Solution: Clear browser cookies and localStorage

## Development Workflow

### Making Changes

1. **Backend Changes**

   ```bash
   # The server auto-reloads with ts-node
   # Edit files in src/
   # Changes apply automatically
   ```

2. **Frontend Changes**
   ```bash
   # The server auto-reloads
   # Edit files in app/ or components/
   # Changes apply automatically
   ```

### Database Migrations (Backend)

If you modify the Prisma schema:

```bash
cd backend

# Create and run migration
npx prisma migrate dev --name description_of_changes

# View database in Prisma Studio
npx prisma studio
```

## Building for Production

### Build Backend

```bash
cd backend
npm run build
npm start  # Runs from dist/server.js
```

### Build Frontend

```bash
cd frontend
npm run build
npm start  # Runs optimized Next.js app
```

## Environment Variables Reference

### Backend (.env)

```
DATABASE_URL=              # PostgreSQL connection string
JWT_ACCESS_SECRET=         # Secret for access tokens
JWT_REFRESH_SECRET=        # Secret for refresh tokens
ACCESS_TOKEN_EXPIRES_IN=   # Access token expiry (e.g., "15m")
REFRESH_TOKEN_EXPIRES_IN=  # Refresh token expiry (e.g., "7d")
CLIENT_URL=                # Frontend URL (for CORS)
PORT=                      # Backend port (default 5000)
NODE_ENV=                  # development or production
```

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=       # Backend API URL (e.g., http://localhost:5000)
```

## Common Commands

### Backend

```bash
cd backend

npm run dev           # Start development server
npm run build         # Build for production
npm start            # Start production server
npm run type-check   # Check TypeScript types
npx prisma migrate dev              # Create and run migrations
npx prisma studio                   # Open database UI
```

### Frontend

```bash
cd frontend

npm run dev          # Start development server
npm run build        # Build for production
npm start           # Start production server
npm run lint        # Run ESLint
npm run type-check  # Check TypeScript types
```

## Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Connect GitHub repo to Vercel
3. Set `NEXT_PUBLIC_API_URL` environment variable
4. Deploy

### Backend (Render/Railway)

1. Push code to GitHub
2. Connect GitHub repo to Render/Railway
3. Set all environment variables
4. Deploy

### Database (Neon/Supabase)

1. Create PostgreSQL database
2. Get connection string
3. Set DATABASE_URL in backend

## Getting Help

1. Check the [PLAN.md](PLAN.md) for architecture details
2. Check the [README.md](README.md) for full documentation
3. Check error messages in terminal
4. Check browser console (F12) for frontend errors

## Next Steps

- Add tests for backend and frontend
- Add email notifications
- Add task categories
- Add collaborative features
- Add mobile app
- Deploy to production

---

**Happy developing! 🚀**
