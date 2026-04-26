# TaskGuard: A Secure Task Management System

A production-grade task management system built with Next.js, Express.js, TypeScript, Prisma, and PostgreSQL. Features secure user authentication, protected task operations, and a responsive user interface.

## Features

-  **User Authentication** - Secure registration and login with JWT
-  **Password Hashing** - bcrypt for secure password storage
-  **Protected Routes** - Route protection with JWT middleware
-  **Task Management** - Create, read, update, delete tasks
-  **User-Based Authorization** - Users only see their own tasks
-  **Task Filtering** - Filter by status, priority, and due date
-  **Dashboard Summary** - Overview of task statistics
-  **Responsive UI** - Mobile-friendly design with Tailwind CSS
-  **Security** - Rate limiting, Helmet headers, CORS, input validation
-  **Error Handling** - Comprehensive error messages and loading states

## Tech Stack

### Frontend

- **Next.js 14** - React framework with TypeScript
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form state management
- **Axios** - HTTP client

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
│   │   ├── config/          # Configuration files
│   │   ├── controllers/      # Route controllers
│   │   ├── middleware/       # Express middleware
│   │   ├── routes/           # API routes
│   │   ├── schemas/          # Zod validation schemas
│   │   ├── services/         # Business logic
│   │   ├── utils/            # Utility functions
│   │   ├── app.ts            # Express app setup
│   │   └── server.ts         # Server entry point
│   ├── prisma/
│   │   └── schema.prisma     # Database schema
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── app/
│   │   ├── login/            # Login page
│   │   ├── register/         # Registration page
│   │   ├── dashboard/        # Main dashboard
│   │   ├── tasks/
│   │   │   ├── new/          # Create task page
│   │   │   └── [id]/edit/    # Edit task page
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Home page
│   ├── components/           # Reusable components
│   ├── lib/                  # Utility functions
│   ├── types/                # TypeScript types
│   ├── package.json
│   └── tsconfig.json
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
- PostgreSQL database
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

The backend will run on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will run on `http://localhost:3000`

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
2. **JWT in Memory**: Access tokens stored in React state, cleared on page refresh
3. **Password Hashing**: bcrypt with 10 rounds (standard security practice)
4. **Rate Limiting**: Prevents brute-force attacks on authentication endpoints
5. **CORS Configuration**: Only allows requests from whitelisted frontend domain
6. **Task Ownership**: Every task operation verifies user ownership
7. **Error Handling**: Generic error messages prevent information disclosure
8. **Environment Secrets**: All sensitive data in `.env` files (never committed)

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

## Known Limitations

- Single deployment per backend (no horizontal scaling)
- No database connection pooling (add PgBouncer for production)
- No email notifications (can add SendGrid)
- No file attachments (can add AWS S3)
- No task categories (can extend schema)

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


