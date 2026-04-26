# TaskGuard: A Secure Task Management System

A production-grade task management system built with Next.js, Express.js, TypeScript, Prisma, and PostgreSQL. Features secure user authentication, protected task operations, and a responsive user interface.

## Features

- **User Authentication** - Secure registration and login with JWT
- **Password Hashing** - bcrypt for secure password storage
- **Protected Routes** - Route protection with JWT middleware
- **Task Management** - Create, read, update, delete tasks with individual task retrieval
- **User-Based Authorization** - Users only see their own tasks
- **Task Filtering** - Filter by status and priority
- **Dashboard Summary** - Overview of task statistics with color-coded cards
- **Modern Dark Theme UI** - Contemporary glassmorphism design with smooth animations
- **Responsive Design** - Mobile-friendly layout with Tailwind CSS
- **Reusable Components** - Modular component architecture for maintainability
- **Security** - Rate limiting, Helmet headers, CORS, input validation, CSRF protection
- **Error Handling** - Comprehensive error messages and loading states

## Tech Stack

### Frontend

- **Next.js 14** - React framework with TypeScript and App Router
- **Tailwind CSS** - Utility-first CSS framework with custom animations
- **Zustand** - Lightweight state management
- **React Hook Form** - Form state management with validation
- **Axios** - HTTP client with interceptors
- **Glassmorphism Design** - Modern UI with backdrop blur effects

### Backend

- **Express.js** - Node.js web framework
- **TypeScript** - Type-safe JavaScript
- **Prisma** - Type-safe ORM
- **PostgreSQL** - Relational database
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **Zod** - Schema validation
- **Helmet** - Security middleware
- **express-rate-limit** - Rate limiting
- **CORS** - Cross-origin resource sharing

## Project Structure

```
TaskGuard/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration files (environment)
│   │   ├── controllers/      # Route controllers (auth, task)
│   │   ├── middleware/       # Express middleware (auth, CSRF)
│   │   ├── routes/           # API routes (auth, task)
│   │   ├── schemas/          # Zod validation schemas
│   │   ├── services/         # Business logic (auth, task)
│   │   ├── utils/            # Utility functions (helpers, token)
│   │   ├── app.ts            # Express app setup with security
│   │   └── server.ts         # Server entry point
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema with models
│   │   └── migrations/       # Database migration history
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── app/
│   │   ├── login/            # Login page (dark theme)
│   │   ├── register/         # Registration page (dark theme)
│   │   ├── dashboard/        # Main dashboard with stats and task grid
│   │   ├── tasks/
│   │   │   ├── new/          # Create task page
│   │   │   └── [id]/edit/    # Edit task page
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Home landing page
│   │   ├── globals.css       # Global styles with dark theme and animations
│   │   └── css.d.ts          # CSS module type declarations
│   ├── components/
│   │   ├── Navbar.tsx        # Navigation header with user profile
│   │   ├── TaskCard.tsx      # Individual task card component
│   │   ├── TaskForm.tsx      # Form for creating/editing tasks
│   │   ├── ErrorMessage.tsx  # Error notification display
│   │   ├── Loading.tsx       # Loading spinner component
│   │   ├── Button.tsx        # Reusable button component
│   │   ├── FormInput.tsx     # Reusable form input component
│   │   ├── Card.tsx          # Glassmorphism card wrapper
│   │   └── AnimatedBackground.tsx # Reusable animated gradient backgrounds
│   ├── lib/
│   │   ├── api.ts            # Axios client with interceptors
│   │   ├── store.ts          # Zustand store for auth state
│   │   ├── useAuth.ts        # Custom hook for authentication
│   │   ├── withProtectedRoute.tsx # HOC for route protection
│   │   └── dateUtils.ts      # Date utility functions
│   ├── types/                # TypeScript type definitions
│   ├── middleware.ts         # Next.js middleware
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── next.config.js
│   └── globals.d.ts          # CSS module declarations
│
├── PLAN.md                   # Development plan
├── README.md                 # This file
├── .env.example              # Example environment variables
└── .gitignore                # Git ignore rules
```

## Environment Variables

Create `.env` files in backend and frontend directories based on `.env.example`:

### Backend `.env`

```env
DATABASE_URL="postgresql://user:password@localhost:5432/taskguard_db"
JWT_ACCESS_SECRET="your_secret_access_key"
JWT_REFRESH_SECRET="your_secret_refresh_key"
ACCESS_TOKEN_EXPIRES_IN="15m"
REFRESH_TOKEN_EXPIRES_IN="7d"
CLIENT_URL="http://localhost:3000"
PORT=5000
NODE_ENV="development"
```

### Frontend `.env.local`

```env
NEXT_PUBLIC_API_URL="http://localhost:5000"
```

## Installation & Setup

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (15+)
- Git

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Setup Prisma and database
npx prisma migrate dev --name init

# Start development server
npm run dev
```

Backend runs on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs on `http://localhost:3001`

**Note:** The frontend features a modern dark theme with glassmorphism design, smooth animations, and reusable component architecture.

## API Documentation

### Authentication Endpoints

#### Register User

```
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}

Response: 201 Created
{
  "message": "User registered successfully"
}
```

#### Login

```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}

Response: 200 OK
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "accessToken": "jwt_token"
}
```

#### Refresh Token

```
POST /auth/refresh

Response: 200 OK
{
  "accessToken": "new_jwt_token"
}
```

#### Logout

```
POST /auth/logout

Response: 200 OK
{
  "message": "Logged out successfully"
}
```

### Task Endpoints (Requires Authentication)

#### Get All Tasks

```
GET /tasks
Authorization: Bearer <accessToken>

Response: 200 OK
{
  "tasks": [
    {
      "id": "uuid",
      "title": "Complete project",
      "description": "Finish TaskGuard",
      "status": "IN_PROGRESS",
      "priority": "HIGH",
      "dueDate": "2026-04-30",
      "userId": "uuid",
      "createdAt": "2026-04-25T10:00:00Z",
      "updatedAt": "2026-04-25T10:00:00Z"
    }
  ]
}
```

#### Get Single Task

```
GET /tasks/:id
Authorization: Bearer <accessToken>

Response: 200 OK
{
  "id": "uuid",
  "title": "Complete project",
  "description": "Finish TaskGuard",
  "status": "IN_PROGRESS",
  "priority": "HIGH",
  "dueDate": "2026-04-30",
  "userId": "uuid",
  "createdAt": "2026-04-25T10:00:00Z",
  "updatedAt": "2026-04-25T10:00:00Z"
}
```

#### Get Task Statistics

```
GET /tasks/stats
Authorization: Bearer <accessToken>

Response: 200 OK
{
  "totalTasks": 10,
  "completedTasks": 3,
  "pendingTasks": 7,
  "highPriorityTasks": 2,
  "overdueTasks": 1,
  "todayTasks": 4
}
```

#### Create Task

```
POST /tasks
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish TaskGuard",
  "status": "TODO",
  "priority": "HIGH",
  "dueDate": "2026-04-30"
}

Response: 201 Created
{
  "task": { ... }
}
```

#### Update Task

```
PUT /tasks/:id
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "title": "Updated title",
  "status": "IN_PROGRESS"
}

Response: 200 OK
{
  "task": { ... }
}
```

#### Delete Task

```
DELETE /tasks/:id
Authorization: Bearer <accessToken>

Response: 200 OK
{
  "message": "Task deleted successfully"
}
```

## Security Features

### Client-Side

- JWT tokens stored in HTTP-only cookies
- Access tokens in React state (cleared on refresh)
- Form validation with React Hook Form
- Protected routes with middleware
- Safe error messages
- CSRF protection with Next.js

### Server-Side

- Password hashing with bcrypt (10 rounds)
- JWT validation on all protected routes
- Input validation with Zod schemas
- Rate limiting (5 attempts per 15 minutes on auth endpoints)
- Helmet security headers
- CORS configured for frontend domain
- Task ownership verification
- Generic error responses (no stack traces)
- Secure cookie configuration

## UI/Design Features

### Modern Dark Theme

- Slate color palette with cyan-to-blue gradient accents
- Glassmorphism effects with backdrop blur
- Smooth fade-in and slide-in animations
- Responsive grid layouts for desktop and mobile

### Reusable Component Architecture

- **Button** - Multiple variants (primary, secondary, danger) with loading states
- **FormInput** - Standardized input with animation and error handling
- **Card** - Glassmorphic wrapper for consistent styling
- **AnimatedBackground** - Reusable gradient animation backgrounds
- **TaskCard** - Interactive task display with status/priority badges
- **Navbar** - Sticky navigation with user profile and logout
- **ErrorMessage** - Stylized error notifications
- **Loading** - Animated spinner component

### Pages & Layouts

- **Login/Register** - Dark-themed authentication with animated backgrounds
- **Dashboard** - Statistics overview with color-coded cards and task grid
- **Task Management** - Create and edit tasks with form validation
- **Landing Page** - Modern hero section with feature showcase

## Deployment

### Frontend Deployment (Vercel)

```bash
# Vercel automatically deploys from GitHub
# Set environment variables in Vercel dashboard
NEXT_PUBLIC_API_URL=<backend_url>
```

### Backend Deployment (Render or Railway)

```bash
# Push code to GitHub
# Connect repository to Render/Railway
# Set environment variables in dashboard
# Database URL points to Neon or Supabase
```

### Database Deployment (Neon or Supabase)

```bash
# Create PostgreSQL database on Neon/Supabase
# Update DATABASE_URL in backend environment
# Run prisma migrate in production
npx prisma migrate deploy
```

## Development Workflow

```bash
# Create feature branch
git checkout -b feature/task-filters

# Make changes and commit
git add .
git commit -m "add task filtering by status"

# Push to GitHub
git push origin feature/task-filters

# Create pull request for code review
```

## Key Security Decisions

1. **HTTP-Only Cookies**: Refresh tokens stored in HTTP-only cookies to prevent XSS attacks
2. **JWT in Memory**: Access tokens stored in Zustand store, cleared on page refresh
3. **Password Hashing**: bcrypt with 10 rounds (industry standard)
4. **Rate Limiting**: Prevents brute-force attacks on authentication endpoints
5. **CORS Configuration**: Whitelist frontend domain to prevent cross-origin attacks
6. **Task Ownership Verification**: Every task operation verifies user ownership before processing
7. **Input Validation**: All API inputs validated with Zod schemas
8. **Error Handling**: Generic error messages prevent information disclosure
9. **Environment Secrets**: All sensitive data stored in `.env` files (never committed)
10. **Route Protection**: Protected pages require authentication via `useAuth()` hook

## Testing

```bash
# Backend tests (when added)
cd backend
npm run test

# Frontend tests (when added)
cd frontend
npm run test
```

## Troubleshooting

### Database Connection Error

- Verify PostgreSQL is running
- Check DATABASE_URL format
- Ensure database name is created

### JWT Token Issues

- Clear cookies and login again
- Check JWT_ACCESS_SECRET matches between requests
- Verify token expiration time

### CORS Errors

- Confirm frontend URL in backend CORS configuration
- Check CLIENT_URL environment variable
- Verify credentials: true on frontend requests

## Known Limitations & Improvements

### Limitations

- Single deployment per backend (no horizontal scaling)
- No database connection pooling (add PgBouncer for production)
- No email notifications (can integrate SendGrid)
- No file attachments (can add AWS S3)
- No task categories/tags (can extend schema)

### Recent Improvements

- Added individual task retrieval endpoint (`GET /tasks/:id`)
- Implemented reusable component architecture
- Modern dark theme with glassmorphism design
- Removed unnecessary emoji indicators for cleaner UI
- TypeScript CSS module declarations for better type safety
- Zustand state management for auth
- Animations and smooth transitions throughout UI
- Form input standardization with reusable components
- Updated route ordering to prevent stats endpoint conflicts

## Future Enhancements

- Email verification for registration
- Password reset functionality
- Task categories and tags
- Collaborative task sharing
- Real-time updates with WebSocket
- Mobile app with React Native
- Task templates
- Recurring tasks
- Team management
- Activity logging

## License

MIT

## Support

For issues or questions, please create an issue on GitHub.

---
