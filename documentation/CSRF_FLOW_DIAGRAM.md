# CSRF Flow Diagram

## Attack It Prevents

```
BEFORE CSRF PROTECTION:
┌─────────────────────────────────────────────────────┐
│ User logs into TaskGuard                             │
│ (leaves tab open)                                    │
│                                                     │
│ User visits malicious website                       │
│ (in another tab)                                    │
│                                                     │
│ Malicious site has hidden form:                     │
│ <form action="https://taskguard.com/api/tasks"     │
│      method="POST">                                 │
│   <input name="title" value="Malware Task">         │
│ </form>                                             │
│                                                     │
│ Since user is logged in + cookies auto-sent:        │
│ ❌ Malicious task created in user's account!        │
└─────────────────────────────────────────────────────┘

AFTER CSRF PROTECTION:
┌─────────────────────────────────────────────────────┐
│ Same attack scenario BUT:                            │
│                                                     │
│ Malicious site can't access CSRF token              │
│ (stored in HTTP-Only cookie, Same-Origin Policy)    │
│                                                     │
│ Malicious form submission fails:                    │
│ Missing X-CSRF-Token header                         │
│                                                     │
│ ✅ Backend rejects with 403 Forbidden               │
│ ✅ Malicious task NOT created                       │
│ ✅ User data protected!                             │
└─────────────────────────────────────────────────────┘
```

## Request Flow with CSRF Protection

### Successful Request Flow

```
1. PAGE LOAD
   ┌─────────────────────────────────────────┐
   │ Next.js App loads                       │
   │ useAuth hook initializes                │
   └─────────────────┬───────────────────────┘
                     │
                     ▼
   ┌─────────────────────────────────────────┐
   │ fetchCsrfToken() called automatically   │
   └─────────────────┬───────────────────────┘
                     │
                     ▼
   ┌─────────────────────────────────────────┐
   │ GET /api/auth/csrf-token                │
   │ (Browser auto-includes cookies)         │
   └─────────────────┬───────────────────────┘
                     │
                     ▼
   ┌─────────────────────────────────────────┐
   │ Backend receives request                │
   │ CSRF middleware generates token         │
   │ Sets _csrf cookie (HTTP-Only)           │
   └─────────────────┬───────────────────────┘
                     │
                     ▼
   ┌─────────────────────────────────────────┐
   │ Response: { csrfToken: "abc123..." }    │
   │ Set-Cookie: _csrf=...; HttpOnly         │
   └─────────────────┬───────────────────────┘
                     │
                     ▼
   ┌─────────────────────────────────────────┐
   │ Frontend stores token in memory         │
   │ Ready for form submissions              │
   └─────────────────────────────────────────┘

2. FORM SUBMISSION (e.g., Login)
   ┌─────────────────────────────────────────┐
   │ User enters email & password            │
   │ Clicks "Sign In"                        │
   └─────────────────┬───────────────────────┘
                     │
                     ▼
   ┌─────────────────────────────────────────┐
   │ POST /api/auth/login                    │
   │ {                                       │
   │   email: "user@example.com",            │
   │   password: "****"                      │
   │ }                                       │
   └─────────────────┬───────────────────────┘
                     │
                     ▼
   ┌─────────────────────────────────────────┐
   │ API Interceptor adds CSRF header:       │
   │ X-CSRF-Token: abc123...                 │
   │                                         │
   │ Browser auto-includes cookie:           │
   │ Cookie: _csrf=abc123...                 │
   └─────────────────┬───────────────────────┘
                     │
                     ▼
   ┌─────────────────────────────────────────┐
   │ Backend receives request                │
   │ CSRF middleware validates:              │
   │ - Header token matches cookie           │
   │ - Signature is valid                    │
   │ - Not tampered with                     │
   └─────────────────┬───────────────────────┘
                     │
                     ▼
   ┌─────────────────────────────────────────┐
   │ ✅ Token valid!                          │
   │ Request processed normally              │
   │ User logged in                          │
   └─────────────────────────────────────────┘

3. ATTACKER SCENARIO
   ┌─────────────────────────────────────────┐
   │ Attacker sends fake request:            │
   │ POST /api/tasks                         │
   │ (no X-CSRF-Token header)                │
   └─────────────────┬───────────────────────┘
                     │
                     ▼
   ┌─────────────────────────────────────────┐
   │ Backend receives request                │
   │ Checks for X-CSRF-Token header          │
   │ ❌ Header missing!                       │
   └─────────────────┬───────────────────────┘
                     │
                     ▼
   ┌─────────────────────────────────────────┐
   │ 403 Forbidden                           │
   │ {                                       │
   │   "error": "Invalid CSRF token",        │
   │   "message": "validation failed..."     │
   │ }                                       │
   │ ❌ Malicious request blocked!            │
   └─────────────────────────────────────────┘
```

## Token Lifecycle

```
Timeline:
─────────────────────────────────────────────────────

T0: User visits app
    │
    ├─→ fetchCsrfToken()
    │   └─→ Token generated (valid for session)
    │
    └─→ Token stored in memory + HTTP-Only cookie

T1-T(n): Multiple requests
    │
    ├─→ GET /tasks (reads data - no token needed)
    │
    ├─→ POST /tasks (creates task)
    │   └─→ Token added to X-CSRF-Token header
    │   └─→ ✅ Validated & processed
    │
    ├─→ PUT /tasks/:id (updates task)
    │   └─→ Token added to X-CSRF-Token header
    │   └─→ ✅ Validated & processed
    │
    └─→ DELETE /tasks/:id (deletes task)
        └─→ Token added to X-CSRF-Token header
        └─→ ✅ Validated & processed

T(exit): User logs out or closes browser
    │
    └─→ Token invalidated
        └─→ New token needed on next visit
```

## Code Flow in Frontend

```
src/lib/api.ts
│
├─→ fetchCsrfToken()
│   │
│   ├─→ GET /api/auth/csrf-token
│   ├─→ Parse response
│   └─→ Store in csrfToken variable
│
├─→ Request Interceptor
│   │
│   ├─→ Check request method (GET vs POST/PUT/DELETE)
│   │
│   └─→ If POST/PUT/DELETE/PATCH:
│       ├─→ Check if token exists
│       ├─→ Add X-CSRF-Token header
│       └─→ Include in request
│
└─→ Response Interceptor
    │
    ├─→ If 401 (unauthorized)
    │   └─→ Refresh token and retry
    │
    └─→ Return response

src/lib/useAuth.ts
│
└─→ useEffect on mount
    │
    ├─→ Load access token from localStorage
    ├─→ Set user state
    └─→ Call fetchCsrfToken() ← CSRF initialization!
```

## Security Guarantees

```
CSRF Token Protection Layers:

Layer 1: Stored Securely
  HTTP-Only Cookie
  ├─ Not accessible by JavaScript
  ├─ Not vulnerable to XSS
  └─ Auto-sent by browser to same-origin

Layer 2: Transmitted Safely
  Custom Header (X-CSRF-Token)
  ├─ Must be in request body or header
  ├─ CORS policy prevents cross-origin access
  └─ Attackers can't read from cookies (Same-Origin)

Layer 3: Validated Rigorously
  Signature Verification
  ├─ Token signature verified
  ├─ Token matches session
  ├─ Expiration checked
  └─ Integrity confirmed (not tampered)

Layer 4: Enforced Strictly
  SameSite=Strict
  ├─ Cookie only sent to same-site requests
  ├─ Cross-site navigation doesn't send cookie
  └─ Even less vulnerable than Layer 1

Result:
  ✅ Attacker can't forge requests
  ✅ Attacker can't steal tokens (HTTP-Only)
  ✅ Attacker can't bypass validation
  ✅ User data protected against CSRF attacks
```

## Integration Points

```
When CSRF Protection Active:

✅ All login attempts
   ├─ Required: X-CSRF-Token header
   └─ Verified before password checked

✅ All registration attempts
   ├─ Required: X-CSRF-Token header
   └─ Verified before user created

✅ All task creations
   ├─ Required: X-CSRF-Token header
   └─ Verified before task inserted

✅ All task updates
   ├─ Required: X-CSRF-Token header
   └─ Verified before task modified

✅ All task deletions
   ├─ Required: X-CSRF-Token header
   └─ Verified before task removed

✅ All logout attempts
   ├─ Required: X-CSRF-Token header
   └─ Verified before session cleared

❌ All GET requests (reads)
   ├─ No CSRF needed (no state change)
   └─ Read-only operations allowed

❌ Public endpoints without auth
   ├─ Still protected by middleware
   ├─ CSRF token required
   └─ Prevents state changes by unauthenticated users
```
