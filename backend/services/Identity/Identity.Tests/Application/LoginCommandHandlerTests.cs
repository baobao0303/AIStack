using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Configuration;
using Xunit;
using Identity.Domain.Entities;
using Identity.Domain.Constants;
using Identity.Application.Authentication.Queries.Login;
using Identity.Application.Common.Interfaces;
using Identity.Infrastructure.Persistence;
using Identity.Infrastructure.Security;

namespace Identity.Tests.Application
{
    public class FakeDistributedCache : IDistributedCache
    {
        private readonly Dictionary<string, byte[]> _cache = new();

        public byte[] Get(string key)
        {
            _cache.TryGetValue(key, out var value);
            return value!;
        }

        public Task<byte[]> GetAsync(string key, CancellationToken token = default)
        {
            return Task.FromResult(Get(key));
        }

        public void Set(string key, byte[] value, DistributedCacheEntryOptions options)
        {
            _cache[key] = value;
        }

        public Task SetAsync(string key, byte[] value, DistributedCacheEntryOptions options, CancellationToken token = default)
        {
            Set(key, value, options);
            return Task.CompletedTask;
        }

        public void Refresh(string key)
        {
        }

        public Task RefreshAsync(string key, CancellationToken token = default)
        {
            return Task.CompletedTask;
        }

        public void Remove(string key)
        {
            _cache.Remove(key);
        }

        public Task RemoveAsync(string key, CancellationToken token = default)
        {
            Remove(key);
            return Task.CompletedTask;
        }

        public bool KeyExists(string key)
        {
            return _cache.ContainsKey(key);
        }

        public string GetString(string key)
        {
            var val = Get(key);
            return val != null ? Encoding.UTF8.GetString(val) : null!;
        }
    }

    public class LoginCommandHandlerTests
    {
        private readonly DbContextOptions<IdentityDbContext> _dbContextOptions;
        private readonly FakePasswordHasher _passwordHasher;
        private readonly ITokenService _tokenService;
        private readonly FakeDistributedCache _cache;
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
            _cache = new FakeDistributedCache();
        }

        private IdentityDbContext CreateDbContext() => new IdentityDbContext(_dbContextOptions);

        [Fact]
        public async Task Login_With_Valid_Credentials_Should_Succeed_And_Cache_Session()
        {
            // Arrange
            using var context = CreateDbContext();
            
            // 1. Seed Tenant
            var tenantId = Guid.NewGuid();
            var tenant = new Tenant(tenantId, "Test Tenant", "test");
            await context.Tenants.AddAsync(tenant);

            // 2. Seed User
            var userId = Guid.NewGuid();
            var user = new User(userId, tenantId, "owner@test.com", "SecureP@ssword123!_hashed", "John", "Doe");
            await context.Users.AddAsync(user);

            // 3. Seed Role and UserRole
            var role = new Role(RoleIds.SuperAdmin, "SuperAdmin");
            var userRole = new UserRole(userId, RoleIds.SuperAdmin);
            await context.Roles.AddAsync(role);
            await context.UserRoles.AddAsync(userRole);
            await context.SaveChangesAsync();

            var handler = new LoginCommandHandler(context, _passwordHasher, _tokenService, _cache);
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

            // Verify JWT Token Claims
            var handlerToken = new JwtSecurityTokenHandler();
            var jwtToken = handlerToken.ReadJwtToken(result.AccessToken);
            Assert.Equal(userId.ToString(), jwtToken.Subject);
            Assert.Equal("owner@test.com", jwtToken.Payload["email"]);
            Assert.Equal(tenantId.ToString(), jwtToken.Payload["tenant_id"]);

            // Verify Redis Session Cache
            var cacheKey = $"sessions:{userId}:{result.RefreshToken}";
            Assert.True(_cache.KeyExists(cacheKey));
            Assert.Equal(tenantId.ToString(), _cache.GetString(cacheKey));
        }

        [Fact]
        public async Task Login_With_Wrong_Password_Should_Throw_UnauthorizedAccessException()
        {
            // Arrange
            using var context = CreateDbContext();
            var tenantId = Guid.NewGuid();
            var user = new User(Guid.NewGuid(), tenantId, "owner@test.com", "SecureP@ssword123!_hashed", "John", "Doe");
            await context.Users.AddAsync(user);
            await context.SaveChangesAsync();

            var handler = new LoginCommandHandler(context, _passwordHasher, _tokenService, _cache);
            var command = new LoginCommand
            {
                Email = "owner@test.com",
                Password = "WrongPassword!"
            };

            // Act & Assert
            await Assert.ThrowsAsync<UnauthorizedAccessException>(() => handler.Handle(command, CancellationToken.None));
        }

        [Fact]
        public async Task Login_With_Unregistered_Email_Should_Throw_UnauthorizedAccessException()
        {
            // Arrange
            using var context = CreateDbContext();

            var handler = new LoginCommandHandler(context, _passwordHasher, _tokenService, _cache);
            var command = new LoginCommand
            {
                Email = "nonexistent@test.com",
                Password = "SecureP@ssword123!"
            };

            // Act & Assert
            await Assert.ThrowsAsync<UnauthorizedAccessException>(() => handler.Handle(command, CancellationToken.None));
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
            var handlerToken = new JwtSecurityTokenHandler();
            var jwtToken = handlerToken.ReadJwtToken(accessToken);
            
            Assert.Equal(userId.ToString(), jwtToken.Subject);
            Assert.Equal("owner@test.com", jwtToken.Payload["email"]);
            Assert.Equal(tenantId.ToString(), jwtToken.Payload["tenant_id"]);

            // Extract Roles from token claims
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
        public void TokenService_GenerateRefreshToken_Should_Be_Valid_UUID()
        {
            // Act
            var refreshToken = _tokenService.GenerateRefreshToken();

            // Assert
            Assert.NotEmpty(refreshToken);
            Assert.True(Guid.TryParse(refreshToken, out _));
        }
    }
}
