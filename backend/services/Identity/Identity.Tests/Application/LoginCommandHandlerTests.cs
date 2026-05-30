using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Xunit;
using Identity.Domain.Entities;
using Identity.Domain.Constants;
using Identity.Application.Authentication.Queries.Login;
using Identity.Application.Authentication.Commands.RefreshToken;
using Identity.Application.Authentication.Commands.Logout;
using Identity.Application.Authentication.Queries.GetMe;
using Identity.Application.Common.Interfaces;
using Identity.Infrastructure.Persistence;
using Identity.Infrastructure.Security;

namespace Identity.Tests.Application
{
    public class LoginCommandHandlerTests
    {
        private readonly DbContextOptions<IdentityDbContext> _dbContextOptions;
        private readonly FakePasswordHasher _passwordHasher;
        private readonly ITokenService _tokenService;
        private readonly IConfiguration _configuration;

        public LoginCommandHandlerTests()
        {
            _dbContextOptions = new DbContextOptionsBuilder<IdentityDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _passwordHasher = new FakePasswordHasher();

            var inMemorySettings = new Dictionary<string, string>
            {
                {"Jwt:Secret", "ThisIsASuperSecretKeyForSigningJWTTokens1234567890!"},
                {"Jwt:Issuer", "Identity.Api"},
                {"Jwt:Audience", "CRMPortal"}
            };

            _configuration = new ConfigurationBuilder()
                .AddInMemoryCollection(inMemorySettings)
                .Build();

            _tokenService = new TokenService(_configuration);
        }

        private IdentityDbContext CreateDbContext() => new IdentityDbContext(_dbContextOptions);

        private static string ComputeSha256Hash(string rawData)
        {
            using var sha256Hash = SHA256.Create();
            byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(rawData));
            var builder = new StringBuilder();
            for (int i = 0; i < bytes.Length; i++)
            {
                builder.Append(bytes[i].ToString("x2"));
            }
            return builder.ToString();
        }

        [Fact]
        public async Task Login_With_Valid_Credentials_Should_Succeed_And_Save_Hashed_Token_In_Postgres()
        {
            // Arrange
            using var context = CreateDbContext();
            
            var tenantId = Guid.NewGuid();
            var tenant = new Tenant(tenantId, "Test Tenant", "test");
            await context.Tenants.AddAsync(tenant);

            var userId = Guid.NewGuid();
            var user = new User(userId, tenantId, "owner@test.com", "SecureP@ssword123!_hashed", "John", "Doe");
            await context.Users.AddAsync(user);

            var role = new Role(RoleIds.SuperAdmin, "SuperAdmin");
            var userRole = new UserRole(userId, RoleIds.SuperAdmin);
            await context.Roles.AddAsync(role);
            await context.UserRoles.AddAsync(userRole);
            await context.SaveChangesAsync();

            var handler = new LoginCommandHandler(context, _passwordHasher, _tokenService);
            var command = new LoginCommand
            {
                Email = "owner@test.com",
                Password = "SecureP@ssword123!"
            };

            // Act
            var result = await handler.Handle(command, CancellationToken.None);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("owner@test.com", result.Email);
            Assert.Equal(userId, result.UserId);
            Assert.NotEmpty(result.AccessToken);
            Assert.NotEmpty(result.RefreshToken);

            // Verify signed Refresh Token structure
            var jwtHandler = new JwtSecurityTokenHandler();
            var parsedRefreshToken = jwtHandler.ReadJwtToken(result.RefreshToken);
            Assert.Equal(userId.ToString(), parsedRefreshToken.Subject);
            Assert.NotNull(parsedRefreshToken.Id); // jti exists
            Assert.NotNull(parsedRefreshToken.Payload["absolute_exp"]);

            // Verify Refresh Token Hash is securely stored in database
            var expectedHash = ComputeSha256Hash(result.RefreshToken);
            var dbToken = await context.RefreshTokens.FirstOrDefaultAsync(rt => rt.TokenHash == expectedHash);
            Assert.NotNull(dbToken);
            Assert.Equal(userId, dbToken!.UserId);
            Assert.False(dbToken.IsRevoked);
            Assert.True(dbToken.AbsoluteExpiresAt > DateTimeOffset.UtcNow.AddDays(29));
        }

        [Fact]
        public async Task RefreshToken_With_Valid_Token_Should_Succeed_Rotate_And_Revoke_Old_Token()
        {
            // Arrange
            using var context = CreateDbContext();
            
            var tenantId = Guid.NewGuid();
            var userId = Guid.NewGuid();
            var user = new User(userId, tenantId, "owner@test.com", "hash", "John", "Doe");
            await context.Users.AddAsync(user);

            var role = new Role(RoleIds.SuperAdmin, "SuperAdmin");
            var userRole = new UserRole(userId, RoleIds.SuperAdmin);
            await context.Roles.AddAsync(role);
            await context.UserRoles.AddAsync(userRole);

            // Generate first token
            var jti = Guid.NewGuid().ToString();
            var absoluteExpiry = DateTimeOffset.UtcNow.AddDays(30);
            var rawRefreshToken = _tokenService.GenerateRefreshToken(user, jti, absoluteExpiry);
            var hash = ComputeSha256Hash(rawRefreshToken);

            var dbToken = new RefreshToken(
                Guid.NewGuid(),
                userId,
                hash,
                jti,
                DateTimeOffset.UtcNow,
                DateTimeOffset.UtcNow.AddDays(7),
                absoluteExpiry
            );
            await context.RefreshTokens.AddAsync(dbToken);
            await context.SaveChangesAsync();

            var handler = new RefreshTokenCommandHandler(context, _tokenService, _configuration);
            var command = new RefreshTokenCommand { RefreshToken = rawRefreshToken };

            // Act
            var result = await handler.Handle(command, CancellationToken.None);

            // Assert
            Assert.NotNull(result);
            Assert.NotEmpty(result.AccessToken);
            Assert.NotEmpty(result.RefreshToken);

            // Verify old token is revoked
            var oldDbToken = await context.RefreshTokens.FirstOrDefaultAsync(rt => rt.TokenHash == hash);
            Assert.NotNull(oldDbToken);
            Assert.True(oldDbToken!.IsRevoked);
            Assert.NotNull(oldDbToken.RevokedAt);

            // Verify new token is created and hashed
            var newHash = ComputeSha256Hash(result.RefreshToken);
            var newDbToken = await context.RefreshTokens.FirstOrDefaultAsync(rt => rt.TokenHash == newHash);
            Assert.NotNull(newDbToken);
            Assert.Equal(userId, newDbToken!.UserId);
            Assert.False(newDbToken.IsRevoked);
            Assert.Equal(absoluteExpiry.ToUnixTimeSeconds(), newDbToken.AbsoluteExpiresAt.ToUnixTimeSeconds());
        }

        [Fact]
        public async Task RefreshToken_With_Revoked_Token_Should_Throw_UnauthorizedAccessException()
        {
            // Arrange
            using var context = CreateDbContext();
            var userId = Guid.NewGuid();
            var user = new User(userId, Guid.NewGuid(), "owner@test.com", "hash", "John", "Doe");
            await context.Users.AddAsync(user);

            var jti = Guid.NewGuid().ToString();
            var absoluteExpiry = DateTimeOffset.UtcNow.AddDays(30);
            var rawRefreshToken = _tokenService.GenerateRefreshToken(user, jti, absoluteExpiry);
            var hash = ComputeSha256Hash(rawRefreshToken);

            var dbToken = new RefreshToken(
                Guid.NewGuid(),
                userId,
                hash,
                jti,
                DateTimeOffset.UtcNow,
                DateTimeOffset.UtcNow.AddDays(7),
                absoluteExpiry
            );
            dbToken.Revoke(DateTimeOffset.UtcNow); // Revoke it
            await context.RefreshTokens.AddAsync(dbToken);
            await context.SaveChangesAsync();

            var handler = new RefreshTokenCommandHandler(context, _tokenService, _configuration);
            var command = new RefreshTokenCommand { RefreshToken = rawRefreshToken };

            // Act & Assert
            await Assert.ThrowsAsync<UnauthorizedAccessException>(() => handler.Handle(command, CancellationToken.None));
        }

        [Fact]
        public async Task RefreshToken_When_Absolute_Expiration_Reached_Should_Throw_UnauthorizedAccessException()
        {
            // Arrange
            using var context = CreateDbContext();
            var userId = Guid.NewGuid();
            var user = new User(userId, Guid.NewGuid(), "owner@test.com", "hash", "John", "Doe");
            await context.Users.AddAsync(user);

            var jti = Guid.NewGuid().ToString();
            // Set absoluteExpiry in the past
            var absoluteExpiry = DateTimeOffset.UtcNow.AddMinutes(-5);
            var rawRefreshToken = _tokenService.GenerateRefreshToken(user, jti, absoluteExpiry);
            var hash = ComputeSha256Hash(rawRefreshToken);

            var dbToken = new RefreshToken(
                Guid.NewGuid(),
                userId,
                hash,
                jti,
                DateTimeOffset.UtcNow.AddDays(-10),
                DateTimeOffset.UtcNow.AddDays(-3), // sliding also expired
                absoluteExpiry
            );
            await context.RefreshTokens.AddAsync(dbToken);
            await context.SaveChangesAsync();

            var handler = new RefreshTokenCommandHandler(context, _tokenService, _configuration);
            var command = new RefreshTokenCommand { RefreshToken = rawRefreshToken };

            // Act & Assert
            await Assert.ThrowsAsync<UnauthorizedAccessException>(() => handler.Handle(command, CancellationToken.None));
        }

        [Fact]
        public async Task RefreshToken_When_Sliding_Expiration_Approaching_Absolute_Limit_Should_Be_Capped()
        {
            // Arrange
            using var context = CreateDbContext();
            
            var tenantId = Guid.NewGuid();
            var userId = Guid.NewGuid();
            var user = new User(userId, tenantId, "owner@test.com", "hash", "John", "Doe");
            await context.Users.AddAsync(user);

            var role = new Role(RoleIds.SuperAdmin, "SuperAdmin");
            var userRole = new UserRole(userId, RoleIds.SuperAdmin);
            await context.Roles.AddAsync(role);
            await context.UserRoles.AddAsync(userRole);

            // Absolute expiry is only 2 days away (less than sliding 7 days)
            var jti = Guid.NewGuid().ToString();
            var absoluteExpiry = DateTimeOffset.UtcNow.AddDays(2);
            var rawRefreshToken = _tokenService.GenerateRefreshToken(user, jti, absoluteExpiry);
            var hash = ComputeSha256Hash(rawRefreshToken);

            var dbToken = new RefreshToken(
                Guid.NewGuid(),
                userId,
                hash,
                jti,
                DateTimeOffset.UtcNow,
                DateTimeOffset.UtcNow.AddDays(1),
                absoluteExpiry
            );
            await context.RefreshTokens.AddAsync(dbToken);
            await context.SaveChangesAsync();

            var handler = new RefreshTokenCommandHandler(context, _tokenService, _configuration);
            var command = new RefreshTokenCommand { RefreshToken = rawRefreshToken };

            // Act
            var result = await handler.Handle(command, CancellationToken.None);

            // Assert
            Assert.NotNull(result);

            // Verify new token in database is capped exactly at absoluteExpiry
            var newHash = ComputeSha256Hash(result.RefreshToken);
            var newDbToken = await context.RefreshTokens.FirstOrDefaultAsync(rt => rt.TokenHash == newHash);
            Assert.NotNull(newDbToken);
            Assert.Equal(absoluteExpiry.ToUnixTimeSeconds(), newDbToken!.ExpiresAt.ToUnixTimeSeconds());
        }

        [Fact]
        public async Task Logout_With_Valid_Token_Should_Revoke_Token()
        {
            // Arrange
            using var context = CreateDbContext();
            var userId = Guid.NewGuid();
            var user = new User(userId, Guid.NewGuid(), "owner@test.com", "hash", "John", "Doe");
            await context.Users.AddAsync(user);

            var jti = Guid.NewGuid().ToString();
            var absoluteExpiry = DateTimeOffset.UtcNow.AddDays(30);
            var rawRefreshToken = _tokenService.GenerateRefreshToken(user, jti, absoluteExpiry);
            var hash = ComputeSha256Hash(rawRefreshToken);

            var dbToken = new RefreshToken(
                Guid.NewGuid(),
                userId,
                hash,
                jti,
                DateTimeOffset.UtcNow,
                DateTimeOffset.UtcNow.AddDays(7),
                absoluteExpiry
            );
            await context.RefreshTokens.AddAsync(dbToken);
            await context.SaveChangesAsync();

            var handler = new LogoutCommandHandler(context);
            var command = new LogoutCommand { RefreshToken = rawRefreshToken };

            // Act
            var result = await handler.Handle(command, CancellationToken.None);

            // Assert
            Assert.True(result);
            var updatedDbToken = await context.RefreshTokens.FirstOrDefaultAsync(rt => rt.TokenHash == hash);
            Assert.NotNull(updatedDbToken);
            Assert.True(updatedDbToken!.IsRevoked);
        }

        [Fact]
        public async Task GetMe_With_Valid_User_Should_Return_User_Details()
        {
            // Arrange
            using var context = CreateDbContext();
            var tenantId = Guid.NewGuid();
            var userId = Guid.NewGuid();
            var user = new User(userId, tenantId, "owner@test.com", "hash", "John", "Doe");
            await context.Users.AddAsync(user);
            await context.SaveChangesAsync();

            var handler = new GetMeQueryHandler(context);
            var query = new GetMeQuery { UserId = userId };

            // Act
            var result = await handler.Handle(query, CancellationToken.None);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(userId, result.Id);
            Assert.Equal("owner@test.com", result.Email);
            Assert.Equal("John", result.FirstName);
            Assert.Equal("Doe", result.LastName);
            Assert.Equal(tenantId, result.TenantId);
        }

        [Fact]
        public void TokenService_GenerateAccessToken_Should_Contain_Role_Claims()
        {
            // Arrange
            var tenantId = Guid.NewGuid();
            var userId = Guid.NewGuid();
            var user = new User(userId, tenantId, "owner@test.com", "hash", "John", "Doe");
            var roles = new[] { "SuperAdmin", "Manager" };

            // Act
            var accessToken = _tokenService.GenerateAccessToken(user, roles);

            // Assert
            Assert.NotEmpty(accessToken);
            var jwtHandler = new JwtSecurityTokenHandler();
            var jwtToken = jwtHandler.ReadJwtToken(accessToken);
            
            Assert.Equal(userId.ToString(), jwtToken.Subject);
            Assert.Equal("owner@test.com", jwtToken.Payload["email"]);
            Assert.Equal(tenantId.ToString(), jwtToken.Payload["tenant_id"]);

            var roleClaims = new List<string>();
            foreach (var claim in jwtToken.Claims)
            {
                if (claim.Type == ClaimTypes.Role || claim.Type == "role")
                {
                    roleClaims.Add(claim.Value);
                }
            }

            Assert.Contains("SuperAdmin", roleClaims);
            Assert.Contains("Manager", roleClaims);
        }

        [Fact]
        public void TokenService_GenerateRefreshToken_Should_Be_Valid_Signed_JWT()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var user = new User(userId, Guid.NewGuid(), "owner@test.com", "hash", "John", "Doe");
            var jti = Guid.NewGuid().ToString();
            var absoluteExpiry = DateTimeOffset.UtcNow.AddDays(30);

            // Act
            var refreshToken = _tokenService.GenerateRefreshToken(user, jti, absoluteExpiry);

            // Assert
            Assert.NotEmpty(refreshToken);
            var jwtHandler = new JwtSecurityTokenHandler();
            var jwtToken = jwtHandler.ReadJwtToken(refreshToken);
            
            Assert.Equal(userId.ToString(), jwtToken.Subject);
            Assert.Equal(jti, jwtToken.Payload["jti"]?.ToString());
            Assert.Equal(absoluteExpiry.ToUnixTimeSeconds().ToString(), jwtToken.Payload["absolute_exp"]?.ToString());
            Assert.True(jwtToken.ValidTo > DateTime.UtcNow);
            Assert.True(jwtToken.ValidFrom <= DateTime.UtcNow.AddSeconds(5));
        }
    }
}
