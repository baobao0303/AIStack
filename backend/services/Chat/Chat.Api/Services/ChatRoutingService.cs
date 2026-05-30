using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Chat.Api.Entities;
using Chat.Api.Persistence;

namespace Chat.Api.Services
{
    public class ChatRoutingService : IChatRoutingService
    {
        private readonly ChatDbContext _context;
        private readonly ILogger<ChatRoutingService> _logger;

        public ChatRoutingService(ChatDbContext context, ILogger<ChatRoutingService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<Guid?> AssignAgentAsync(Guid sessionId)
        {
            _logger.LogInformation("[Routing] Initiating agent matchmaking for chat session {SessionId}...", sessionId);

            // 1. Fetch chat session
            var session = await _context.ChatSessions
                .FirstOrDefaultAsync(s => s.Id == sessionId);

            if (session == null)
            {
                _logger.LogWarning("[Routing] Chat session {SessionId} not found in database.", sessionId);
                return null;
            }

            var now = DateTimeOffset.UtcNow;

            // 2. Query currently online employees on the same tenant
            var onlineEmployeesQuery = _context.Employees
                .Where(e => e.TenantId == session.TenantId && e.ActiveChatStatus == ActiveChatStatuses.Online);

            // 3. Filter employees who have an active shift right now
            var activeShiftsQuery = _context.EmployeeShifts
                .Where(s => s.TenantId == session.TenantId && s.ShiftStart <= now && s.ShiftEnd >= now);

            // Join employees with their active shifts in the database
            var activeOnlineEmployees = await onlineEmployeesQuery
                .Join(activeShiftsQuery,
                    e => e.Id,
                    s => s.EmployeeId,
                    (e, s) => e)
                .ToListAsync();

            if (!activeOnlineEmployees.Any())
            {
                _logger.LogWarning("[Routing] No online agents currently on active shift for tenant {TenantId}. Queueing session.", session.TenantId);
                session.Status = ChatSessionStatuses.Queued;
                session.AssignedEmployeeId = null;
                await _context.SaveChangesAsync();
                return null;
            }

            _logger.LogInformation("[Routing] Found {Count} active online agents on shift. Calculating workloads...", activeOnlineEmployees.Count);

            // 4. Load-balance: select the agent with the lowest number of active sessions
            Guid? assignedAgentId = null;
            int minWorkload = int.MaxValue;
            Employee? selectedAgent = null;

            foreach (var agent in activeOnlineEmployees)
            {
                int workload = await _context.ChatSessions
                    .CountAsync(s => s.AssignedEmployeeId == agent.Id && s.Status == ChatSessionStatuses.Active);

                _logger.LogInformation("[Routing] Agent {AgentName} ({AgentEmail}) workload: {Count} active chats.", agent.FirstName, agent.Email, workload);

                if (workload < minWorkload)
                {
                    minWorkload = workload;
                    selectedAgent = agent;
                    assignedAgentId = agent.Id;
                }
            }

            if (selectedAgent != null)
            {
                _logger.LogInformation("[Routing] Matchmaking successful! Assigning chat session {SessionId} to Agent {AgentName} (Workload: {Workload} chats).", 
                    sessionId, selectedAgent.FirstName, minWorkload);
                
                session.AssignedEmployeeId = assignedAgentId;
                session.Status = ChatSessionStatuses.Active;
                await _context.SaveChangesAsync();
                return assignedAgentId;
            }

            _logger.LogWarning("[Routing] Could not select an agent. Queueing session.");
            session.Status = ChatSessionStatuses.Queued;
            await _context.SaveChangesAsync();
            return null;
        }
    }
}
