using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Chat.Api.Entities;
using Chat.Api.Hubs;
using Chat.Api.Persistence;

namespace Chat.Api.Services
{
    public class ShiftMonitoringBackgroundService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly IHubContext<ChatHub> _hubContext;
        private readonly ILogger<ShiftMonitoringBackgroundService> _logger;
        
        // Monitoring period. Default is 60 seconds. Can be customized via environment variables.
        private readonly TimeSpan _monitoringInterval = TimeSpan.FromSeconds(60);

        public ShiftMonitoringBackgroundService(
            IServiceScopeFactory scopeFactory,
            IHubContext<ChatHub> hubContext,
            ILogger<ShiftMonitoringBackgroundService> logger)
        {
            _scopeFactory = scopeFactory;
            _hubContext = hubContext;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("[ShiftMonitor] Starting background shift schedule monitoring daemon...");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await MonitorActiveShiftsAsync(stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "[ShiftMonitor] An error occurred while executing shift monitoring loop.");
                }

                await Task.Delay(_monitoringInterval, stoppingToken);
            }

            _logger.LogInformation("[ShiftMonitor] Stopping background shift schedule monitoring daemon...");
        }

        public async Task MonitorActiveShiftsAsync(CancellationToken cancellationToken)
        {
            var now = DateTimeOffset.UtcNow;
            _logger.LogInformation("[ShiftMonitor] Checking agent shifts at: {Time}", now);

            using var scope = _scopeFactory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ChatDbContext>();

            // 1. Fetch all employees currently marked as Online or Busy
            var activeEmployees = await context.Employees
                .Where(e => e.ActiveChatStatus == ActiveChatStatuses.Online || e.ActiveChatStatus == ActiveChatStatuses.Busy)
                .ToListAsync(cancellationToken);

            if (!activeEmployees.Any())
            {
                _logger.LogInformation("[ShiftMonitor] No active support agents (Online/Busy) found. Skipping checks.");
                return;
            }

            // 2. Identify employees who have no active shifts covering the current time
            foreach (var employee in activeEmployees)
            {
                var hasActiveShift = await context.EmployeeShifts
                    .AnyAsync(s => s.EmployeeId == employee.Id && s.ShiftStart <= now && s.ShiftEnd >= now, cancellationToken);

                if (!hasActiveShift)
                {
                    _logger.LogWarning("[ShiftMonitor] Agent {Name} ({Email}) has no active scheduled shift at {Time}. Changing status to Offline.", 
                        $"{employee.FirstName} {employee.LastName}", employee.Email, now);

                    // Update status in database
                    employee.ActiveChatStatus = ActiveChatStatuses.Offline;

                    // 3. Broadcast status update in real-time to active SignalR clients
                    try
                    {
                        await _hubContext.Clients.All.SendAsync("UserStatusChanged", new
                        {
                            UserId = employee.Id,
                            Email = employee.Email,
                            Status = ActiveChatStatuses.Offline,
                            Timestamp = now
                        }, cancellationToken);

                        _logger.LogInformation("[ShiftMonitor] Successfully broadcasted Offline status for Agent {Email} to all SignalR clients.", employee.Email);
                    }
                    catch (Exception hubEx)
                    {
                        _logger.LogError(hubEx, "[ShiftMonitor] Failed to broadcast user status change to SignalR clients.");
                    }
                }
            }

            await context.SaveChangesAsync(cancellationToken);
        }
    }
}
