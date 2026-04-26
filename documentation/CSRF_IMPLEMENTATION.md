# CSRF Token Implementation Guide

## Overview

CSRF (Cross-Site Request Forgery) protection has been implemented in TaskGuard using the `csurf` middleware for Express.js. This protects against attackers tricking users into making unwanted state-changing requests.

## How It Works

### 1. **Backend Flow**

```
Client Request
    ↓
Express receives request
    ↓
CSRF middleware (csurf) validates token
    ↓
For GET requests: Token is valid (no state change)
For POST/PUT/DELETE: Token MUST be in X-CSRF-Token header
    ↓
If token valid: Request processed
If token invalid: 403 error returned
```

### 2. **Frontend Flow**

```
Page Load
    ↓
fetchCsrfToken() called automatically
    ↓
GET /api/auth/csrf-token
    ↓
Backend generates token and sends via Set-Cookie
Frontend stores in memory
    ↓
Form Submission (POST/PUT/DELETE)
    ↓
API interceptor adds X-CSRF-Token header
    ↓
Backend validates token
    ↓
Request succeeds or fails
```

## Implementation Details

### Backend Changes

#### 1. **New Middleware: `src/middleware/csrf.middleware.ts`**

- Configures CSRF protection with HTTP-only cookies
- Handles CSRF token generation and validation
- Provides error handling for invalid tokens

#### 2. **Updated: `src/app.ts`**

- Imports and registers CSRF middleware
- CORS now includes `X-CSRF-Token` in allowed headers
- Middleware stack order: cookie parser → CSRF → routes

#### 3. **New Endpoint: `GET /api/auth/csrf-token`**

- Returns a fresh CSRF token
- No authentication required (public endpoint)
- Token is automatically set in HTTP-only cookie by `csurf`

#### 4. **Updated Routes**

- All routes automatically protected by CSRF middleware
- No changes needed to individual route handlers
- Middleware handles validation transparently

### Frontend Changes

#### 1. **Updated: `lib/api.ts`**

- `fetchCsrfToken()` function to retrieve tokens
- Request interceptor adds `X-CSRF-Token` header for state-changing requests
- Automatic token refresh if needed

#### 2. **Updated: `lib/useAuth.ts`**

- Calls `fetchCsrfToken()` on component mount
- Ensures token is available before any API calls

## API Endpoints

### Public (No Authentication Required)

```
GET /api/auth/csrf-token
Response: { csrfToken: "token_string" }
Headers: Set-Cookie: _csrf=...; HttpOnly; Secure; SameSite=Strict
```

### Protected (CSRF Token Required for State Changes)

```
POST /api/auth/register
Headers: X-CSRF-Token: <token>
Body: { name, email, password }

POST /api/auth/login
Headers: X-CSRF-Token: <token>
Body: { email, password }

POST /api/tasks
Headers: X-CSRF-Token: <token>
Body: { title, description, status, priority, dueDate }

PUT /api/tasks/:id
Headers: X-CSRF-Token: <token>
Body: { title, description, status, priority, dueDate }

DELETE /api/tasks/:id
Headers: X-CSRF-Token: <token>
```

## Security Features

### ✅ **HTTP-Only Cookies**

- CSRF token stored in HTTP-only cookie
- Prevents JavaScript access (XSS protection)
- Automatically included in requests

### ✅ **SameSite Strict**

- Cookie only sent to same-origin requests
- Prevents cross-site cookie leakage

### ✅ **Secure Flag (Production)**

- Cookie only transmitted over HTTPS in production
- Development allows HTTP for local testing

### ✅ **Custom Header Validation**

- Token must be in `X-CSRF-Token` header
- Attackers can't bypass with CORS

## Testing CSRF Protection

### 1. **Test Token Retrieval**

```bash
curl -X GET http://localhost:5000/api/auth/csrf-token \
  -H "Content-Type: application/json"
# Response: {"csrfToken":"eyJkYXRhIjoie1widDI1OHMtY2FsY3VsYXRlZFwiOjF9IiwiIl" }
```

### 2. **Test with Valid Token**

```bash
# First get the token
CSRF_TOKEN=$(curl -s -X GET http://localhost:5000/api/auth/csrf-token | jq -r '.csrfToken')

# Use token in request
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: $CSRF_TOKEN" \
  -d '{"email":"test@example.com","password":"Test@1234"}' \
  -b "_csrf=<cookie_value>"
```

### 3. **Test with Invalid Token (Should Fail)**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: invalid_token_123" \
  -d '{"email":"test@example.com","password":"Test@1234"}'
# Response: {"error":"Invalid CSRF token","message":"CSRF token validation failed..."}
```

### 4. **Test Missing Token (Should Fail)**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test@1234"}'
# Response: {"error":"Invalid CSRF token",...}
```

## Frontend Integration

### Automatic Protection

All API calls through `apiClient` in `lib/api.ts` are automatically protected:

```typescript
// This automatically includes CSRF token
const response = await apiClient.post('/auth/login', {
  email: 'test@example.com',
  password: 'password123',
});
```

### Manual CSRF Token Fetch

If needed, manually fetch the token:

```typescript
import { fetchCsrfToken } from '@/lib/api';

const token = await fetchCsrfToken();
console.log('Current CSRF Token:', token);
```

## Error Handling

### Invalid Token Response

```json
{
  "error": "Invalid CSRF token",
  "message": "CSRF token validation failed. Please refresh and try again."
}
```

**User Action:** Refresh the page and try again. The token will be re-fetched automatically.

### Missing Token Response

```json
{
  "error": "Invalid CSRF token",
  "message": "CSRF token validation failed. Please refresh and try again."
}
```

**Cause:** Token not included in header or cookie not set properly.

## Troubleshooting

### Issue: "Invalid CSRF token" on first request

**Solution:**

1. Ensure `fetchCsrfToken()` is called before any mutations
2. Check that cookies are enabled in browser
3. Verify `withCredentials: true` in axios config

### Issue: Token not being sent in requests

**Solution:**

1. Check browser developer tools → Network → Headers
2. Look for `X-CSRF-Token` header in POST/PUT/DELETE requests
3. Verify request is for state-changing method (POST/PUT/DELETE)

### Issue: CSRF token expires

**Solution:**

1. Token is valid for the entire session
2. If session expires, token is automatically refreshed
3. Page refresh will fetch a new token

## Production Deployment

### Required Changes for Production

1. **Environment Variables**

   ```
   NODE_ENV=production
   ```

2. **CORS Settings**
   Update `config.clientUrl` to production domain:

   ```
   CLIENT_URL=https://taskguard.example.com
   ```

3. **HTTPS**
   Ensure backend is served over HTTPS for `secure` cookie flag

4. **Frontend Deployment**
   Ensure `NEXT_PUBLIC_API_URL` points to production backend:
   ```
   NEXT_PUBLIC_API_URL=https://api.taskguard.example.com
   ```

## Compatibility

- ✅ All modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ HTTP-only cookies automatically handled by browsers
- ✅ Works with axios interceptors
- ✅ Compatible with Next.js API routes
- ✅ Compatible with protected routes middleware

## References

- [OWASP CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [csurf Documentation](https://github.com/expressjs/csurf)
- [MDN: CSRF](https://owasp.org/www-community/attacks/csrf)
