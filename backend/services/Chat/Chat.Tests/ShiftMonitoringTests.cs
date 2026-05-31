using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Chat.Api.Entities;
using Chat.Api.Hubs;
using Chat.Api.Persistence;
using Chat.Api.Services;
using Moq;
using Xunit;

namespace Chat.Tests
{
    public class ShiftMonitoringTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly WebApplicationFactory<Program> _factory;
        private static readonly Guid TestTenantId = Guid.Parse("22222222-2222-2222-2222-222222222222");

        public ShiftMonitoringTests(WebApplicationFactory<Program> factory)
        {
            _factory = factory.WithWebHostBuilder(builder =>
            {
                builder.UseEnvironment("Testing");
                builder.ConfigureTestServices(services =>
                {
                    // 1. Remove standard PostgreSQL DB registration
                    var descriptor = services.SingleOrDefault(
                        d => d.ServiceType == typeof(DbContextOptions<ChatDbContext>));
                    if (descriptor != null)
                    {
                        services.Remove(descriptor);
                    }

                    // 2. Register a unique InMemory Database instead for isolated testing
                    services.AddDbContext<ChatDbContext>(options =>
                        options.UseInMemoryDatabase("ShiftMonitoringTestsDb"));
                });
            });
        }

        [Fact]
        public async Task EmployeesController_CRUD_Should_Manage_Support_Staff()
        {
            var client = _factory.CreateClient();

            // 1. POST: Register new employee
            var newEmployee = new Employee
            {
                Id = Guid.NewGuid(),
                TenantId = TestTenantId,
                FirstName = "Alice",
                LastName = "Wunderland",
                Email = "alice@test.com",
                Department = "Support",
                ActiveChatStatus = ActiveChatStatuses.Online
            };

            var postResponse = await client.PostAsJsonAsync("/api/employees", newEmployee);
            Assert.Equal(HttpStatusCode.Created, postResponse.StatusCode);

            var createdEmployee = await postResponse.Content.ReadFromJsonAsync<Employee>();
            Assert.NotNull(createdEmployee);
            Assert.Equal("Alice", createdEmployee.FirstName);

            // 2. GET: List employees
            var getResponse = await client.GetAsync("/api/employees");
            Assert.Equal(HttpStatusCode.OK, getResponse.StatusCode);

            var employees = await getResponse.Content.ReadFromJsonAsync<List<Employee>>();
            Assert.NotNull(employees);
            Assert.Contains(employees, e => e.Email == "alice@test.com");

            // 3. PUT: Update employee
            createdEmployee.Department = "Lead Support";
            var putResponse = await client.PutAsJsonAsync($"/api/employees/{createdEmployee.Id}", createdEmployee);
            Assert.Equal(HttpStatusCode.NoContent, putResponse.StatusCode);

            // Verify update
            var getSingleResponse = await client.GetAsync($"/api/employees/{createdEmployee.Id}");
            var updatedEmployee = await getSingleResponse.Content.ReadFromJsonAsync<Employee>();
            Assert.NotNull(updatedEmployee);
            Assert.Equal("Lead Support", updatedEmployee.Department);

            // 4. DELETE: Delete employee
            var deleteResponse = await client.DeleteAsync($"/api/employees/{createdEmployee.Id}");
            Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);
        }

        [Fact]
        public async Task ShiftsController_CRUD_Should_Manage_Shifts()
        {
            var client = _factory.CreateClient();
            using var scope = _factory.Services.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ChatDbContext>();

            // Seed employee
            var employeeId = Guid.NewGuid();
            var emp = new Employee
            {
                Id = employeeId,
                TenantId = TestTenantId,
                FirstName = "Bob",
                LastName = "Builder",
                Email = "bob@test.com",
                Department = "Support",
                ActiveChatStatus = ActiveChatStatuses.Offline
            };
            await context.Employees.AddAsync(emp);
            await context.SaveChangesAsync();

            // 1. POST: Register new shift
            var shift = new EmployeeShift
            {
                Id = Guid.NewGuid(),
                TenantId = TestTenantId,
                EmployeeId = employeeId,
                ShiftStart = DateTimeOffset.UtcNow.AddHours(-1),
                ShiftEnd = DateTimeOffset.UtcNow.AddHours(2),
                Notes = "Standard shift"
            };

            var postResponse = await client.PostAsJsonAsync("/api/shifts", shift);
            Assert.Equal(HttpStatusCode.Created, postResponse.StatusCode);

            // 2. GET: Get active shifts
            var getActiveResponse = await client.GetAsync("/api/shifts/active");
            Assert.Equal(HttpStatusCode.OK, getActiveResponse.StatusCode);

            var activeShifts = await getActiveResponse.Content.ReadFromJsonAsync<List<EmployeeShift>>();
            Assert.NotNull(activeShifts);
            Assert.Contains(activeShifts, s => s.EmployeeId == employeeId);
        }

        [Fact]
        public async Task ShiftMonitoringBackgroundService_Should_Transition_Expired_Shifts_Offline()
        {
            using var scope = _factory.Services.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ChatDbContext>();

            // 1. Seed online employee
            var employeeId = Guid.NewGuid();
            var employee = new Employee
            {
                Id = employeeId,
                TenantId = TestTenantId,
                FirstName = "Charlie",
                LastName = "Brown",
                Email = "charlie@test.com",
                Department = "Support",
                ActiveChatStatus = ActiveChatStatuses.Online
            };
            await context.Employees.AddAsync(employee);

            // 2. Seed an EXPIRED shift (ended 1 hour ago)
            var expiredShift = new EmployeeShift
            {
                Id = Guid.NewGuid(),
                TenantId = TestTenantId,
                EmployeeId = employeeId,
                ShiftStart = DateTimeOffset.UtcNow.AddHours(-5),
                ShiftEnd = DateTimeOffset.UtcNow.AddHours(-1),
                Notes = "Expired shift"
            };
            await context.EmployeeShifts.AddAsync(expiredShift);
            await context.SaveChangesAsync();

            // 3. Setup Mock Hub Context to assert SignalR status change broadcast
            var mockHubContext = new Mock<IHubContext<ChatHub>>();
            var mockClients = new Mock<IHubClients>();
            var mockClientProxy = new Mock<IClientProxy>();

            mockHubContext.Setup(h => h.Clients).Returns(mockClients.Object);
            mockClients.Setup(c => c.All).Returns(mockClientProxy.Object);

            var scopeFactory = _factory.Services.GetRequiredService<IServiceScopeFactory>();
            var logger = new Mock<ILogger<ShiftMonitoringBackgroundService>>();

            // 4. Instantiate ShiftMonitoringBackgroundService and run MonitorActiveShiftsAsync directly
            var monitorService = new ShiftMonitoringBackgroundService(scopeFactory, mockHubContext.Object, logger.Object);
            await monitorService.MonitorActiveShiftsAsync(CancellationToken.None);

            // 5. Assert database updated status to Offline
            using var assertionScope = _factory.Services.CreateScope();
            var assertionContext = assertionScope.ServiceProvider.GetRequiredService<ChatDbContext>();
            var updatedEmployee = await assertionContext.Employees.FindAsync(employeeId);

            Assert.NotNull(updatedEmployee);
            Assert.Equal(ActiveChatStatuses.Offline, updatedEmployee.ActiveChatStatus);

            // 6. Assert SignalR broadcast triggered
            mockClientProxy.Verify(
                x => x.SendCoreAsync("UserStatusChanged", 
                    It.Is<object[]>(args => args.Length == 1), 
                    It.IsAny<CancellationToken>()), 
                Times.Once);
        }
    }
}
