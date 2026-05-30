# Exec Plan: US-002 Secure Login with JWT & Redis-backed Session

## Goal
Implement a secure, production-ready authentication engine in .NET 6 utilizing JWT signing, HttpOnly secure cookies, and Redis-backed refresh token verification.

## Scope

In scope:
- Configure JWT Authentication middleware in `Identity.Api` (`Microsoft.AspNetCore.Authentication.JwtBearer`).
- Implement the login Use Case (`LoginCommand` & `LoginCommandHandler`) via MediatR.
- Design token generation services (`ITokenService` & `TokenService`) creating Access and Refresh tokens.
- Add Redis Cache client configurations using **StackExchange.Redis** or standard `Microsoft.Extensions.Caching.StackExchangeRedis`.
- Implement `POST /api/v1/auth/login` endpoint.
- Provide a robust xUnit integration test suite proving secure session generation, credentials validation, and token revocation.

Out of scope:
- Frontend layout login page implementation (Next.js client).
- Dynamic RBAC routing protection on Gateway (handled in US-003).

## Risk Classification

Risk flags:
- **Auth**: Direct authentication credentials verification.
- **Authorization**: Attaching roles to JWT claim payloads.
- **Audit/security**: Token signature signing and secret key management.

Hard gates:
- Signing keys (Client Secret) must never be committed to git (read from environment configuration or `appsettings.json` development keys).
- Refresh tokens must never be sent in the JSON body; they must utilize HttpOnly cookies to prevent script-based extraction.

## Work Phases
1. **Discovery & Setup**: Install JWT and Redis NuGet dependencies.
2. **Application Layer**: Write the `LoginCommand`, `LoginCommandHandler`, DTOs, and the `ITokenService` contract.
3. **Infrastructure Layer**: Implement `TokenService` using `System.IdentityModel.Tokens.Jwt` and configure Redis connection pools.
4. **Interface Layer**: Connect controllers and wire up JWT authentication filters in `Program.cs`.
5. **Verification**: Write xUnit unit/integration tests covering successful tokens generation, credential matching, and Redis caching.

## Stop Conditions

Pause for human confirmation if:
- Redis infrastructure connection details require custom clusters or local overrides.
- Secret key storage strategies need adjustment.
