# Validation: US-001 Register User and Workspace Tenant

## Proof Strategy
We will verify this high-risk story through a complete validation ladder:
1. **Unit Tests**: Test domain rules (e.g. validating domain strings, parsing valid email formats) and mapping commands to aggregates.
2. **Integration Tests**: Set up a test database context connected to a PostgreSQL Docker container, execute migrations, and verify that saving tenants and users correctly commits data (and rolls back on duplicate database violations).
3. **Endpoint Tests**: Invoke the `/api/v1/auth/register` REST endpoint via standard C# `WebApplicationFactory` integration checks.

---

## Test Plan

| Layer | Cases |
| --- | --- |
| **Unit** | `Tenant_Create_With_Valid_Values_Should_Initialize_Properties` |
| | `User_Create_With_Weak_Password_Should_Fail_Validation` |
| | `EmailAddress_Create_With_Invalid_Format_Should_Throw_DomainException` |
| **Integration** | `RegisterTenantHandler_Should_Persist_Tenant_And_User_And_Role_In_Transaction` |
| | `RegisterTenantHandler_Should_Rollback_Entirely_If_User_Creation_Fails` |
| | `RegisterTenantHandler_Should_Throw_If_Domain_Is_Duplicate` |
| **Endpoint** | `Post_Register_Endpoint_Should_Return_201Created_And_Response_Envelope` |
| | `Post_Register_Endpoint_With_Invalid_Fields_Should_Return_400BadRequest` |
| **Observability**| `Log_Contains_Information_Message_Upon_Success` |

---

## Fixtures

For repeatable and deterministic validation:
- **Default Tenant**: `Acme Corp` (Domain: `acme`)
- **Default Admin**: `owner@acme.com` (Password: `SecureP@ssword123!`)
- **Pre-seeded Roles**: `Super Admin`, `Admin`, `Manager`, `Sales`, `Customer Support`

---

## Commands

Once test suites are established, run the verification with:
```bash
dotnet test src/services/Identity/Identity.Tests/
```
