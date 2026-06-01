using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Identity.Domain.Entities;
using Identity.Domain.Constants;
using Identity.Application.Common.Interfaces;

namespace Identity.Infrastructure.Persistence
{
    public static class DbInitializer
    {
        public static async Task SeedAsync(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<IdentityDbContext>();
            var passwordHasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher>();
            var logger = scope.ServiceProvider.GetRequiredService<ILogger<IdentityDbContext>>();

            try
            {
                logger.LogInformation("[Identity DbInitializer] Migrating database schema in Supabase...");
                // Automatically run migrations to create tables on Supabase
                await context.Database.MigrateAsync();

                if (await context.Users.AnyAsync())
                {
                    logger.LogInformation("[Identity DbInitializer] Database is already populated. Skipping seeding.");
                    return;
                }

                logger.LogInformation("[Identity DbInitializer] Seeding default workspace tenant and administrative credentials...");

                // 1. Seed Tenant
                var tenantId = Guid.Parse("11111111-1111-1111-1111-111111111111");
                var tenant = new Tenant(tenantId, "Tiệm Nhà Zịt", "tiemnhazit.com");
                await context.Tenants.AddAsync(tenant);
                await context.SaveChangesAsync();

                // 2. Seed User (admin@tiemnhazit.com / admin123)
                var userId = Guid.Parse("99999999-9999-9999-9999-999999999999");
                var user = new User(userId, tenantId, "admin@tiemnhazit.com", passwordHasher.HashPassword("admin123"), "Admin", "Zịt");
                await context.Users.AddAsync(user);
                await context.SaveChangesAsync();

                // 3. Seed UserRole (Assign Super Admin role to our user)
                var userRole = new UserRole(userId, RoleIds.SuperAdmin);
                await context.UserRoles.AddAsync(userRole);
                await context.SaveChangesAsync();

                logger.LogInformation("[Identity DbInitializer] Database successfully seeded with Tenant (Tiệm Nhà Zịt) and Admin User (admin@tiemnhazit.com).");
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "[Identity DbInitializer] An error occurred during database migration or seeding.");
            }
        }
    }
}
