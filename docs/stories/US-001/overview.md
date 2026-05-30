# Overview: US-001 Register User and Workspace Tenant

## Current Behavior
No application code or project architecture structure exists. There is no backend identity service, database setup, or endpoint to provision workspace tenants or register user profiles.

## Target Behavior
A running .NET 8 Web API microservice (`Identity Service`) built on **Clean Architecture** patterns, exposing a REST API endpoint `/api/v1/auth/register` to successfully:
1. Register a new corporate **Tenant** (Workspace) with a unique workspace domain.
2. Register a default **User** (the primary administrator) assigned with the dynamic `Super Admin` role inside that tenant workspace.
3. Establish data isolation boundaries so that Tenant metadata is persisted correctly in the database.

## Affected Users
- **Super Admin** (Business Owner / Creator of the workspace): Provisions their CRM tenant and sets up their administrative account.

## Affected Product Docs
- [crm-overview.md](file:///Users/bao312/Desktop/Test/docs/product/crm-overview.md)
- [crm-stories.md](file:///Users/bao312/Desktop/Test/docs/product/crm-stories.md)

## Non-Goals
- We are not implementing the login endpoint, MFA, email token generation, or dynamic RBAC checks (these will arrive in US-002 and US-003).
- We are not deploying to AWS EKS or setting up the YARP gateway configuration in this specific story.
