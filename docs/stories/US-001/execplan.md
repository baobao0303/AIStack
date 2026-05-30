# Exec Plan: US-001 Register User and Workspace Tenant

## Goal
Implement a fully functional .NET 8 Identity Service backend skeleton utilizing Clean Architecture patterns to register isolated workspace tenants and their primary administrator accounts, validating database inserts via PostgreSQL.

## Scope

In scope:
- Scaffold the `Identity Service` Clean Architecture project layout inside the workspace.
- Define domain aggregates, entities, and value-objects (`Tenant`, `User`, `Role`, `UserRole`).
- Implement the registration Use Case (`RegisterTenantCommand` & `RegisterTenantCommandHandler`) via **CQRS / MediatR**.
- Set up **Entity Framework Core** with PostgreSQL.
- Implement input validation using **FluentValidation / Zod-like Zod equivalents**.
- Provide a robust API endpoint `/api/v1/auth/register` returning proper response envelopes.

Out of scope:
- JWT signing and session management (deferred to US-002).
- API Gateway (YARP) setup (we will call the service directly at its port for validation).
- RabbitMQ event-driven notification alerts for registration (handled in Phase 2).

## Risk Classification

Risk flags:
- **Auth**: Creating credentials and passwords.
- **Authorization**: Assigning initial administrator role mappings.
- **Data model**: Creating schemas, entities, and unique database constraint indexes.

Hard gates:
- Data validation at boundaries must prevent empty company names, wrong email formats, or weak passwords from hitting database.
- Cryptographic hashing of passwords before persistence (BCrypt or PBKDF2).

## Work Phases
1. **Discovery & Setup**: Setup the solution structure and projects.
2. **Domain Layer**: Write pure domain entities and business rules (e.g. unique constraints, password strength policies).
3. **Application Layer**: Write the MediatR request, handler, validation schemas, and DTOs.
4. **Infrastructure Layer**: Set up EF Core database context, repositories, and password hasher.
5. **Interface Layer**: Create the HTTP REST controller with correct status codes.
6. **Verification**: Run unit tests and integration tests checking PostgreSQL table inserts.

## Stop Conditions

Pause for human confirmation if:
- Database schema strategy requires changes.
- Password hashing library choices or complexity constraints need adjustments.
