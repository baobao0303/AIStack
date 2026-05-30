using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Identity.Domain.Entities;
using Identity.Domain.Constants;
using Identity.Application.Common.Interfaces;

namespace Identity.Application.Authentication.Commands.RegisterTenant
{
    public class RegisterTenantCommand : IRequest<RegisterTenantResponse>
    {
        public string CompanyName { get; set; } = null!;
        public string CompanyDomain { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
    }

    public class RegisterTenantResponse
    {
        public Guid TenantId { get; set; }
        public Guid UserId { get; set; }
        public string Email { get; set; } = null!;
        public string CompanyDomain { get; set; } = null!;
        public DateTimeOffset CreatedAt { get; set; }
    }

    public class RegisterTenantCommandHandler : IRequestHandler<RegisterTenantCommand, RegisterTenantResponse>
    {
        private readonly IIdentityDbContext _context;
        private readonly IPasswordHasher _passwordHasher;

        public RegisterTenantCommandHandler(IIdentityDbContext context, IPasswordHasher passwordHasher)
        {
            _context = context;
            _passwordHasher = passwordHasher;
        }

        public async Task<RegisterTenantResponse> Handle(RegisterTenantCommand request, CancellationToken cancellationToken)
        {
            // Normalize domain
            var normalizedDomain = request.CompanyDomain.ToLowerInvariant().Trim();

            // 1. Check duplicate Tenant Domain
            var domainExists = await _context.Tenants
                .AnyAsync(t => t.Domain == normalizedDomain, cancellationToken);
            if (domainExists)
            {
                throw new InvalidOperationException($"Company domain '{normalizedDomain}' is already taken.");
            }

            // 2. Check duplicate User Email
            var normalizedEmail = request.Email.ToLowerInvariant().Trim();
            var emailExists = await _context.Users
                .AnyAsync(u => u.Email == normalizedEmail, cancellationToken);
            if (emailExists)
            {
                throw new InvalidOperationException($"Email address '{normalizedEmail}' is already registered.");
            }

            // 3. Create Tenant
            var tenantId = Guid.NewGuid();
            var tenant = new Tenant(tenantId, request.CompanyName, normalizedDomain);

            // 4. Create User with hashed password
            var userId = Guid.NewGuid();
            var hashedPassword = _passwordHasher.HashPassword(request.Password);
            var user = new User(
                userId,
                tenantId,
                normalizedEmail,
                hashedPassword,
                request.FirstName,
                request.LastName
            );

            // 5. Create UserRole mapping (Seed dynamic Super Admin role mapping)
            var userRole = new UserRole(userId, RoleIds.SuperAdmin);

            // 6. Persist changes
            await _context.Tenants.AddAsync(tenant, cancellationToken);
            await _context.Users.AddAsync(user, cancellationToken);
            await _context.UserRoles.AddAsync(userRole, cancellationToken);

            await _context.SaveChangesAsync(cancellationToken);

            return new RegisterTenantResponse
            {
                TenantId = tenantId,
                UserId = userId,
                Email = user.Email,
                CompanyDomain = tenant.Domain,
                CreatedAt = tenant.CreatedAt
            };
        }
    }
}
