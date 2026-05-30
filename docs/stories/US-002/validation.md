# Validation: US-002 Secure Login with JWT & Redis-backed Session

## Proof Strategy
We will verify this high-risk authentication story through automated testing:
1. **Unit Tests**: Test credentials mapping and JWT token generation payload schemas.
2. **Integration Tests**: Set up a test database context and a Mock Redis Cache, execute `LoginCommandHandler`, and verify that Access/Refresh tokens are generated correctly and cached.
3. **Revocation Tests**: Verify that calling the logout or token revocation logic successfully invalidates active sessions inside Redis.

---

## Test Plan

| Layer | Cases |
| --- | --- |
| **Unit** | `TokenService_GenerateAccessToken_Should_Contain_Role_Claims` |
| | `TokenService_GenerateRefreshToken_Should_Be_Valid_UUID` |
| **Integration** | `LoginCommandHandler_With_Valid_Credentials_Should_Succeed_And_Cache_Session` |
| | `LoginCommandHandler_With_Wrong_Password_Should_Throw_UnauthorizedException` |
| | `LoginCommandHandler_With_Unregistered_Email_Should_Throw_UnauthorizedException` |
| | `RevokeSession_Should_Delete_Active_Key_From_Redis` |

---

## Fixtures
- **Development JWT Secret**: `ThisIsASuperSecretKeyForSigningJWTTokens1234567890!` (Minimum 256 bits required for HMAC-SHA256).
- **Default Database Tenant**: `Acme Corp` pre-seeded with administrator accounts.

---

## Commands
Verify compiling and testing with:
```bash
dotnet test backend/services/Identity/Identity.Tests/
```
