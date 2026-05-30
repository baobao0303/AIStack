# Overview: US-002 Secure Login with JWT & Redis-backed Session

## Current Behavior
The Identity Service supports tenant and user registration (US-001) but lacks authentication endpoints. There is no mechanism for users to log in, verify credentials, generate secure JSON Web Tokens (JWT), or rotate sessions.

## Target Behavior
A running .NET 6 Web API Identity Service exposing `POST /api/v1/auth/login` to:
1. Validate email and password credentials.
2. Generate a secure, signed Access Token (JWT, 15 minutes validity) containing tenant, user, and role claims.
3. Generate a rotated Refresh Token (Opaque UUID, 7 days validity) stored in a secure `HttpOnly`, `SameSite=Strict`, `Secure` cookie.
4. Persist and validate refresh tokens against a high-performance **Redis Cache** session store.
5. Invalidate sessions (e.g. logging out or token revocation) by blacklisting active keys in Redis.

## Affected Users
- All users (Super Admins, CRM Managers, Support Representatives, and Store Shoppers) accessing E-commerce interfaces or CRM Portal settings.

## Affected Product Docs
- [crm-overview.md](file:///Users/bao312/Desktop/Test/docs/product/crm-overview.md)
- [crm-stories.md](file:///Users/bao312/Desktop/Test/docs/product/crm-stories.md)

## Non-Goals
- We are not implementing the SignalR chat broker security gateway in this story (handled in US-005).
- We are not deploying the live EKS clusters or Redis in AWS (local Docker/Redis in Tilt is used).
