# PLAN.md - TaskGuard Development Plan

## Backend Choice

I selected **Express.js with TypeScript** for the backend because it is lightweight, flexible, and suitable for building REST APIs quickly. TypeScript improves maintainability and reduces runtime errors. **Prisma** is used as the ORM because it provides type-safe database queries, and **PostgreSQL** is used because the system has relational data such as users and tasks.

## Architecture Overview

The application follows a **client-server architecture**:

```
User Browser → Next.js Frontend → Express.js Backend API → Prisma ORM → PostgreSQL Database
```

- **Frontend** (Next.js): Handles user interaction, form submission, and protected page rendering
- **Backend** (Express.js): Manages authentication, authorization, input validation, business logic, and database access
- **Database** (PostgreSQL): Stores users and their tasks securely
- **Authentication**: JWT for access control with HTTP-only cookies for refresh tokens
- **Task Ownership**: Each API request checks that users can only access their own tasks

## Security Considerations

### Client-Side

- JWT stored in HTTP-only cookies (not localStorage) to prevent XSS attacks
- Form input validation and sanitization
- Route protection with middleware
- Safe error messages without internal details

### Server-Side

- Passwords hashed using bcrypt before storage
- JWT authentication middleware on all protected routes
- Input validation using Zod for type safety
- Rate limiting on authentication endpoints to prevent brute-force attacks
- Helmet for secure HTTP headers (XSS, clickjacking protection)
- CORS configured to allow only frontend domain
- Task ownership verification before update/delete operations
- Error responses avoid leaking stack traces or sensitive data
- Environment variables for secrets (never committed)

## Technology Stack

### Frontend

- **Next.js 14** - React framework with SSR and API routes
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Responsive styling
- **React Hook Form** - Form management
- **Axios** - HTTP client

### Backend

- **Express.js** - Web server framework
- **TypeScript** - Type-safe development
- **Prisma** - ORM for database access
- **PostgreSQL** - Relational database
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **Zod** - Schema validation
- **Helmet** - Security headers
- **express-rate-limit** - Rate limiting
- **CORS** - Cross-origin handling
- **dotenv** - Environment variable management

## Database Design

### User Table

```
id (UUID, primary key)
name (string)
email (string, unique)
passwordHash (string)
createdAt (timestamp)
updatedAt (timestamp)
```

### Task Table

```
id (UUID, primary key)
title (string)
description (string, optional)
status (ENUM: TODO, IN_PROGRESS, COMPLETED)
priority (ENUM: LOW, MEDIUM, HIGH)
dueDate (date, optional)
userId (UUID, foreign key → User)
createdAt (timestamp)
updatedAt (timestamp)
```

**Relationship**: One User has many Tasks (one-to-many)

## API Design

### Authentication Endpoints

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout (clear cookies)

### Task Endpoints (Protected)

- `GET /tasks` - Get user's tasks with optional filters
- `POST /tasks` - Create new task
- `PUT /tasks/:id` - Update task (ownership check)
- `DELETE /tasks/:id` - Delete task (ownership check)

## Development Phases

1. **Phase 1**: Backend setup - Express, TypeScript, Prisma
2. **Phase 2**: Database - Schema design and migrations
3. **Phase 3**: Authentication - Register, login, JWT middleware
4. **Phase 4**: Task APIs - CRUD with ownership checks
5. **Phase 5**: Frontend Setup - Next.js configuration
6. **Phase 6**: Frontend Auth - Login, register, route protection
7. **Phase 7**: Frontend UI - Dashboard, task management
8. **Phase 8**: Security - Rate limiting, validation, headers
9. **Phase 9**: Testing & Documentation
10. **Phase 10**: Deployment - Vercel (frontend), Render (backend), Neon (database)

## Security Headers & Middleware Stack

- **Helmet**: Secures HTTP headers
- **CORS**: Allows requests only from frontend URL
- **Rate Limiting**: Limits login/register attempts (5 per 15 minutes)
- **Auth Middleware**: Validates JWT on protected routes
- **Input Validation**: Zod schemas for all requests
- **Error Handling**: Generic error messages without stack traces

## Future Improvements (For Production Scaling)

- Migrate to **NestJS** for larger codebase with dependency injection
- Add **Redis** for caching dashboard statistics
- Store refresh tokens in database with revocation
- Implement role-based access control (RBAC)
- Add email verification for registration
- Add password reset functionality
- Implement WebSocket for real-time task updates
- Add task categories and tags
- Add task attachments
- Add team collaboration features
