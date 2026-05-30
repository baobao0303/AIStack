using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Xunit;
using Identity.Domain.Entities;
using Identity.Domain.Constants;
using Identity.Application.Authentication.Commands.RegisterTenant;
using Identity.Application.Common.Interfaces;
using Identity.Infrastructure.Persistence;

namespace Identity.Tests.Application
{
    public class FakePasswordHasher : IPasswordHasher
    {
        public string HashPassword(string password) => password + "_hashed";
        public bool VerifyPassword(string password, string hashedPassword) => hashedPassword == password + "_hashed";
    }

    public class RegisterTenantCommandHandlerTests
    {
        private readonly DbContextOptions<IdentityDbContext> _dbContextOptions;
        private readonly FakePasswordHasher _passwordHasher;

        public RegisterTenantCommandHandlerTests()
        {
            // Use EF Core InMemory Database for isolated unit database checks
            _dbContextOptions = new DbContextOptionsBuilder<IdentityDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _passwordHasher = new FakePasswordHasher();
        }

        private IdentityDbContext CreateDbContext() => new IdentityDbContext(_dbContextOptions);

        [Fact]
        public async Task Handle_Should_Create_Tenant_And_User_And_SuperAdmin_Role_Mapping()
        {
            // Arrange
            using var context = CreateDbContext();
            var handler = new RegisterTenantCommandHandler(context, _passwordHasher);
            
            var command = new RegisterTenantCommand
            {
                CompanyName = "Acme Corp",
                CompanyDomain = "acme",
                Email = "owner@acme.com",
                Password = "SecureP@ssword123!",
                FirstName = "John",
                LastName = "Doe"
            };

            // Act
            var result = await handler.Handle(command, CancellationToken.None);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("acme", result.CompanyDomain);
            Assert.Equal("owner@acme.com", result.Email);

            // Verify Tenant persisted
            var tenant = await context.Tenants.FindAsync(result.TenantId);
            Assert.NotNull(tenant);
            Assert.Equal("Acme Corp", tenant!.Name);
            Assert.Equal("acme", tenant.Domain);

            // Verify User persisted with hashed password
            var user = await context.Users.FindAsync(result.UserId);
            Assert.NotNull(user);
            Assert.Equal("owner@acme.com", user!.Email);
            Assert.Equal("SecureP@ssword123!_hashed", user.PasswordHash);
            Assert.Equal("John", user.FirstName);
            Assert.Equal("Doe", user.LastName);

            // Verify Super Admin Role Mapping assigned
            var userRole = await context.UserRoles.FindAsync(result.UserId, RoleIds.SuperAdmin);
            Assert.NotNull(userRole);
        }

        [Fact]
        public async Task Handle_Should_Throw_If_Domain_Is_Duplicate()
        {
            // Arrange
            using var context = CreateDbContext();
            
            // Seed an existing tenant with domain 'acme'
            var existingTenant = new Tenant(Guid.NewGuid(), "Acme Inc", "acme");
            await context.Tenants.AddAsync(existingTenant);
            await context.SaveChangesAsync();

            var handler = new RegisterTenantCommandHandler(context, _passwordHasher);
            
            var command = new RegisterTenantCommand
            {
                CompanyName = "Acme Corp",
                CompanyDomain = "acme", // duplicate domain
                Email = "owner@acme.com",
                Password = "SecureP@ssword123!"
            };

            // Act & Assert
            await Assert.ThrowsAsync<InvalidOperationException>(() => handler.Handle(command, CancellationToken.None));
        }
    }
}
