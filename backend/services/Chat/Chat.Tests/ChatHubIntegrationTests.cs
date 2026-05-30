using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Chat.Api.Entities;
using Chat.Api.Persistence;
using Xunit;

namespace Chat.Tests
{
    public class ChatHubIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly WebApplicationFactory<Program> _factory;
        private static readonly Guid SeedTenantId = Guid.Parse("11111111-1111-1111-1111-111111111111");

        public ChatHubIntegrationTests(WebApplicationFactory<Program> factory)
        {
            // Configure custom WebApplicationFactory with an in-memory EF Core database for testing isolation
            _factory = factory.WithWebHostBuilder(builder =>
            {
                builder.ConfigureTestServices(services =>
                {
                    // 1. Remove standard PostgreSQL DB registration
                    var descriptor = services.SingleOrDefault(
                        d => d.ServiceType == typeof(DbContextOptions<ChatDbContext>));
                    if (descriptor != null)
                    {
                        services.Remove(descriptor);
                    }

                    // 2. Register InMemory Database instead
                    services.AddDbContext<ChatDbContext>(options =>
                        options.UseInMemoryDatabase("ChatTestsDb"));

                    // 3. Override HubLifetimeManager to use in-memory DefaultHubLifetimeManager instead of Redis
                    var lifetimeManagerDescriptor = services.SingleOrDefault(
                        d => d.ServiceType == typeof(Microsoft.AspNetCore.SignalR.HubLifetimeManager<Chat.Api.Hubs.ChatHub>));
                    if (lifetimeManagerDescriptor != null)
                    {
                        services.Remove(lifetimeManagerDescriptor);
                    }
                    services.AddSingleton<Microsoft.AspNetCore.SignalR.HubLifetimeManager<Chat.Api.Hubs.ChatHub>, Microsoft.AspNetCore.SignalR.DefaultHubLifetimeManager<Chat.Api.Hubs.ChatHub>>();
                });
            });
        }

        private async Task SeedOnlineAgentAsync()
        {
            using var scope = _factory.Services.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ChatDbContext>();

            // Seed online employee
            var johnId = Guid.Parse("11111111-2222-3333-4444-555555555555");
            var john = await context.Employees.FindAsync(johnId);
            if (john == null)
            {
                john = new Employee
                {
                    Id = johnId,
                    TenantId = SeedTenantId,
                    FirstName = "John",
                    LastName = "Doe",
                    Email = "john.doe@test.com",
                    Department = "Support",
                    ActiveChatStatus = ActiveChatStatuses.Online
                };
                await context.Employees.AddAsync(john);

                var now = DateTimeOffset.UtcNow;
                var shift = new EmployeeShift
                {
                    Id = Guid.NewGuid(),
                    TenantId = SeedTenantId,
                    EmployeeId = johnId,
                    ShiftStart = now.AddHours(-2),
                    ShiftEnd = now.AddHours(2),
                    Notes = "Test active shift"
                };
                await context.EmployeeShifts.AddAsync(shift);
                await context.SaveChangesAsync();
            }
        }

        [Fact]
        public async Task E2E_LiveChat_Workflow_Should_Route_To_Online_Agent_And_Relay_Messages()
        {
            // 1. Seed active, online support agent in DB
            await SeedOnlineAgentAsync();

            // 2. Build SignalR Connection Mock over internal in-memory test server handler
            var server = _factory.Server;
            var connection = new HubConnectionBuilder()
                .WithUrl("http://localhost/hubs/chat", options =>
                {
                    options.HttpMessageHandlerFactory = _ => server.CreateHandler();
                })
                .Build();

            // Setup real-time event listeners
            string? assignedAgentId = null;
            string? assignedAgentName = null;
            var agentAssignedSource = new TaskCompletionSource<bool>(TaskCreationOptions.RunContinuationsAsynchronously);

            connection.On<string, string>("AgentAssigned", (agentId, agentName) =>
            {
                assignedAgentId = agentId;
                assignedAgentName = agentName;
                agentAssignedSource.TrySetResult(true);
            });

            string? receivedSenderType = null;
            string? receivedContent = null;
            var messageReceivedSource = new TaskCompletionSource<bool>(TaskCreationOptions.RunContinuationsAsynchronously);

            connection.On<string, string, string, string>("ReceiveMessage", (senderType, senderName, content, sentAt) =>
            {
                receivedSenderType = senderType;
                receivedContent = content;
                messageReceivedSource.TrySetResult(true);
            });

            // Start socket handshake
            await connection.StartAsync();

            // 3. Initiate Chat Session as customer
            string customerEmail = "buyer@test.com";
            string sessionId = await connection.InvokeAsync<string>("InitiateChat", SeedTenantId.ToString(), customerEmail);

            Assert.False(string.IsNullOrWhiteSpace(sessionId));

            // Wait for agent matchmaking assignment event to trigger
            var routingCompleted = await Task.WhenAny(agentAssignedSource.Task, Task.Delay(5000)) == agentAssignedSource.Task;

            // 4. Assert routing matchmaking routing successfully completed
            Assert.True(routingCompleted, "Agent assignment timed out.");
            Assert.NotNull(assignedAgentId);
            Assert.Equal("John Doe", assignedAgentName);

            // 5. Send message and verify real-time broadcasting
            await connection.InvokeAsync("SendMessage", sessionId, SenderTypes.Customer, "Buyer", "Xin chào Tiệm Nhà Zịt!");

            var messageRelayed = await Task.WhenAny(messageReceivedSource.Task, Task.Delay(5000)) == messageReceivedSource.Task;

            Assert.True(messageRelayed, "Message relay timed out.");
            Assert.Equal(SenderTypes.Customer, receivedSenderType);
            Assert.Equal("Xin chào Tiệm Nhà Zịt!", receivedContent);

            // Cleanup
            await connection.StopAsync();
            await connection.DisposeAsync();
        }
    }
}
