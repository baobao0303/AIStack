# Design: US-002 Secure Login with JWT & Redis-backed Session

## Domain Model
No new database models are required for core login, as we reuse `User`, `Role`, and `UserRole` tables from US-001. Active sessions are cached logically inside **Redis**:
- **Redis Key Schema**: `sessions:{userId}:{refreshToken}`
  - *Value*: `tenantId` (to fast-lookup tenant context).
  - *Expiry (TTL)*: **7 days** (matching Refresh Token lifespan).

---

## Application Flow

```text
HTTP POST /api/v1/auth/login
   -> LoginCommand DTO
   -> Handler matches email in PostgreSQL
   -> Handler verifies hashed password using BCrypt
   -> If valid:
        1. Queries user roles from database
        2. ITokenService generates JWT Access Token (15 mins)
        3. ITokenService generates rotated Refresh Token (Opaque UUID)
        4. Saves Refresh Token in Redis with 7 days TTL
        5. Sets HttpOnly cookie on HttpResponse
        6. Returns Access Token in Response Body
```

---

## Interface Contract

- **Route**: `POST /api/v1/auth/login`
- **Request Body (JSON)**:
  ```json
  {
    "email": "owner@acme.com",
    "password": "SecureP@ssword123!"
  }
  ```
- **Success Response (200 OK)**:
  - *Response Headers*:
    - `Set-Cookie: refreshToken=9a0a038f-cc9c-4828-897d-6f7d6e4dfdf9; HttpOnly; Secure; SameSite=Strict; Path=/api/v1/auth; Max-Age=604800`
  - *Response Body*:
    ```json
    {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey...",
      "expiresIn": 900,
      "userId": "9a0a038f-cc9c-4828-897d-6f7d6e4dfdf9",
      "email": "owner@acme.com"
    }
    ```
- **Error Response (401 Unauthorized)**:
  ```json
  {
    "error": "Invalid email address or password."
  }
  ```

---

## Data Model
- No database migrations are required.
- Requires a local Redis instance running on `localhost:6379`.

---

## Observability
- **Application Logs**:
  - `[INFO] Attempting user login: owner@acme.com`
  - `[INFO] User logged in successfully: owner@acme.com (UserId: 9a0a0...)`
  - `[WARN] Login failed: invalid password for user owner@acme.com`
- **Session Audit**:
  - Audit log recorded: `Action: UserLogin, User: owner@acme.com, Target: PortalSession`.
