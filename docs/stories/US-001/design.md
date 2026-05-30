# Design: US-001 Register User and Workspace Tenant

## Domain Model

Inside `src/services/Identity/Identity.Domain/`:
- **Tenant** (Aggregate Root):
  - `Id` (UUID)
  - `Name` (String, required, e.g. "Acme Corp")
  - `Domain` (String, required, unique, e.g. "acme")
  - `SubscriptionPlan` (String, e.g. "Free")
  - `CreatedAt` (DateTimeOffset)
- **User** (Entity):
  - `Id` (UUID)
  - `TenantId` (UUID, FK)
  - `Email` (EmailAddress value object)
  - `PasswordHash` (String, required)
  - `FirstName` (String)
  - `LastName` (String)
  - `EmailVerified` (Boolean, default: false)
  - `CreatedAt` (DateTimeOffset)
- **Role** (Entity):
  - `Id` (UUID)
  - `Name` (String, required, unique) - Pre-seeded with "Super Admin", "Admin", "Manager", "Sales", "Customer Support".

---

## Application Flow

We use **CQRS with MediatR** to coordinate the business actions:

```text
HTTP POST /api/v1/auth/register
   -> RegisterTenantRequest DTO
   -> FluentValidation (Checks input rules)
   -> MediatR.Send(RegisterTenantCommand)
   -> RegisterTenantCommandHandler:
        1. Checks unique Tenant Domain
        2. Checks unique User Email
        3. Begins Database Transaction
        4. Inserts new Tenant
        5. Hashes password using BCrypt
        6. Inserts User with TenantId
        7. Maps User to "Super Admin" role in user_roles
        8. Commits Transaction
   -> Returns RegisterTenantResponse DTO (TenantId, UserId, Email, CreatedAt)
```

---

## Interface Contract

- **Route**: `POST /api/v1/auth/register`
- **Request Body (JSON)**:
  ```json
  {
    "companyName": "Acme Corp",
    "companyDomain": "acme",
    "email": "owner@acme.com",
    "password": "StrongPassword123!",
    "firstName": "John",
    "lastName": "Doe"
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "tenantId": "d3b07384-d113-4bf5-a5f1-395781a702b8",
    "userId": "9a0a038f-cc9c-4828-897d-6f7d6e4dfdf9",
    "email": "owner@acme.com",
    "companyDomain": "acme",
    "createdAt": "2026-05-30T16:30:00Z"
  }
  ```
- **Error Response (400 Bad Request)**:
  ```json
  {
    "status": 400,
    "title": "One or more validation errors occurred.",
    "errors": {
      "companyDomain": [
        "Company domain 'acme' is already taken."
      ]
    }
  }
  ```

---

## Data Model

We will build the schema inside PostgreSQL as designed in ADR 0007. 
- **Indexes**:
  - `idx_tenants_domain` on `tenants(domain)` (Unique).
  - `idx_users_email` on `users(email)` (Unique).
- **Migrations**: Standard EF Core migration `001_InitIdentitySchema`.

---

## Observability

- **Application Logs**:
  - Emits `JSON` log lines:
    - On start: `[INFO] Attempting to register tenant acme with email owner@acme.com`
    - On success: `[INFO] Successfully registered tenant acme (Id: d3b07...) and user (Id: 9a0a0...)`
    - On failure: `[WARN] Registration failed for domain acme: Domain already exists`
- **Audit Logs**:
  - Automatically records a row in the system audit logs: `Action: TenantRegistration, User: System, Details: Registered tenant acme`.
