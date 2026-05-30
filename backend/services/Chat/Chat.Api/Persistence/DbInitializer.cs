using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Chat.Api.Entities;

namespace Chat.Api.Persistence
{
    public static class DbInitializer
    {
        private static readonly Guid SeedTenantId = Guid.Parse("11111111-1111-1111-1111-111111111111");

        public static async Task SeedAsync(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ChatDbContext>();
            var logger = scope.ServiceProvider.GetRequiredService<ILogger<ChatDbContext>>();

            try
            {
                logger.LogInformation("[DbInitializer] Ensuring database is created and migrating schemas...");
                
                // Automatically create tables if they do not exist
                await context.Database.EnsureCreatedAsync();

                if (await context.Employees.AnyAsync())
                {
                    logger.LogInformation("[DbInitializer] Database already seeded. Skipping employee/shift seeding.");
                    return;
                }

                logger.LogInformation("[DbInitializer] Seeding default workspace support staff and shift schedules...");

                // 1. Seed Employees
                var john = new Employee
                {
                    Id = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                    TenantId = SeedTenantId,
                    FirstName = "John",
                    LastName = "Doe",
                    Email = "john.doe@test.com",
                    Department = "Support",
                    ActiveChatStatus = ActiveChatStatuses.Online
                };

                var sally = new Employee
                {
                    Id = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                    TenantId = SeedTenantId,
                    FirstName = "Sally",
                    LastName = "Smith",
                    Email = "sally.smith@test.com",
                    Department = "Support Manager",
                    ActiveChatStatus = ActiveChatStatuses.Online
                };

                var bob = new Employee
                {
                    Id = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccccc"),
                    TenantId = SeedTenantId,
                    FirstName = "Bob",
                    LastName = "Miller",
                    Email = "bob.miller@test.com",
                    Department = "Support",
                    ActiveChatStatus = ActiveChatStatuses.Offline
                };

                await context.Employees.AddRangeAsync(john, sally, bob);
                await context.SaveChangesAsync();

                // 2. Seed Employee Shifts (Active shift spanning from 4 hours ago to 8 hours from now)
                var now = DateTimeOffset.UtcNow;
                var shiftStart = now.AddHours(-4);
                var shiftEnd = now.AddHours(8);

                var johnShift = new EmployeeShift
                {
                    Id = Guid.NewGuid(),
                    TenantId = SeedTenantId,
                    EmployeeId = john.Id,
                    ShiftStart = shiftStart,
                    ShiftEnd = shiftEnd,
                    Notes = "Ca trực hỗ trợ buổi sáng & chiều đồ len handmade"
                };

                var sallyShift = new EmployeeShift
                {
                    Id = Guid.NewGuid(),
                    TenantId = SeedTenantId,
                    EmployeeId = sally.Id,
                    ShiftStart = shiftStart,
                    ShiftEnd = shiftEnd,
                    Notes = "Ca trực quản lý hỗ trợ & giám sát SignalR"
                };

                await context.EmployeeShifts.AddRangeAsync(johnShift, sallyShift);
                await context.SaveChangesAsync();

                logger.LogInformation("[DbInitializer] Database successfully seeded with 3 employees and 2 active shifts.");
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "[DbInitializer] An error occurred while seeding default PostgreSQL database details.");
                throw;
            }
        }
    }
}
