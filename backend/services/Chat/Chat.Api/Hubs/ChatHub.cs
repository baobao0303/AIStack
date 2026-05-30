using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Chat.Api.Entities;
using Chat.Api.Persistence;
using Chat.Api.Services;

namespace Chat.Api.Hubs
{
    public class ChatHub : Hub
    {
        private readonly ChatDbContext _context;
        private readonly IChatRoutingService _routingService;
        private readonly ILogger<ChatHub> _logger;

        public ChatHub(ChatDbContext context, IChatRoutingService routingService, ILogger<ChatHub> logger)
        {
            _context = context;
            _routingService = routingService;
            _logger = logger;
        }

        /// <summary>
        /// Initiates a live chat session for a shopper and automatically assigns the best online agent.
        /// </summary>
        /// <param name="tenantIdStr">The company tenant workspace GUID.</param>
        /// <param name="customerEmail">The shopper's email.</param>
        /// <returns>The generated Chat Session ID.</returns>
        public async Task<string> InitiateChat(string tenantIdStr, string customerEmail)
        {
            if (!Guid.TryParse(tenantIdStr, out Guid tenantId))
            {
                tenantId = Guid.Parse("11111111-1111-1111-1111-111111111111"); // Seed default tenant fallback
            }

            _logger.LogInformation("[Hub] Shopper {CustomerEmail} requesting live chat connection...", customerEmail);

            // 1. Create a new chat session in database
            var session = new ChatSession
            {
                Id = Guid.NewGuid(),
                TenantId = tenantId,
                CustomerEmail = customerEmail.ToLowerInvariant().Trim(),
                Status = ChatSessionStatuses.Queued,
                CreatedAt = DateTimeOffset.UtcNow
            };

            await _context.ChatSessions.AddAsync(session);
            await _context.SaveChangesAsync();

            string sessionId = session.Id.ToString();

            // 2. Add shopper's active socket connection to the SignalR Session Group
            await Groups.AddToGroupAsync(Context.ConnectionId, sessionId);

            // 3. Execute the workload matchmaking routing algorithm to assign an online shift agent
            Guid? assignedAgentId = await _routingService.AssignAgentAsync(session.Id);

            if (assignedAgentId.HasValue)
            {
                var agent = await _context.Employees.FindAsync(assignedAgentId.Value);
                string agentName = agent != null ? $"{agent.FirstName} {agent.LastName}" : "Hỗ trợ viên";
                
                _logger.LogInformation("[Hub] Assigned Agent {AgentName} ({AgentId}) to session {SessionId}.", agentName, assignedAgentId.Value, sessionId);

                // Notify both customer and agent inside the session group that routing is successful
                await Clients.Group(sessionId).SendAsync("AgentAssigned", assignedAgentId.ToString(), agentName);
            }
            else
            {
                _logger.LogInformation("[Hub] No agents online or active for session {SessionId}. Placed in queue.", sessionId);
                await Clients.Group(sessionId).SendAsync("ChatQueued");
            }

            return sessionId;
        }

        /// <summary>
        /// Joins an existing active session. Used by CRM Agents to enter a customer's session room.
        /// </summary>
        /// <param name="sessionId">The active chat session ID.</param>
        public async Task JoinSession(string sessionId)
        {
            _logger.LogInformation("[Hub] Connection {ConnectionId} joining SignalR group for session {SessionId}...", Context.ConnectionId, sessionId);
            await Groups.AddToGroupAsync(Context.ConnectionId, sessionId);
        }

        /// <summary>
        /// Relays real-time messages to all active socket clients in the session room and persists them to SQL logs.
        /// </summary>
        /// <param name="sessionId">The chat session ID room.</param>
        /// <param name="senderType">Shopper, Employee, or AI.</param>
        /// <param name="senderName">The visible name of the sender.</param>
        /// <param name="content">The message payload.</param>
        public async Task SendMessage(string sessionId, string senderType, string senderName, string content)
        {
            if (!Guid.TryParse(sessionId, out Guid sessionGuid))
            {
                _logger.LogWarning("[Hub] Invalid session ID received in SendMessage: {SessionId}", sessionId);
                return;
            }

            _logger.LogInformation("[Hub] Message sent in room {SessionId} by {SenderName}: {Content}", sessionId, senderName, content);

            // 1. Persist message instantly to PostgreSQL log database
            var message = new ChatMessage
            {
                Id = Guid.NewGuid(),
                SessionId = sessionGuid,
                SenderType = senderType,
                SenderName = senderName,
                Content = content,
                SentAt = DateTimeOffset.UtcNow
            };

            await _context.ChatMessages.AddAsync(message);
            await _context.SaveChangesAsync();

            // 2. Broadcast the message in real-time to all WebSocket clients registered in the SignalR group room
            await Clients.Group(sessionId).SendAsync("ReceiveMessage", senderType, senderName, content, message.SentAt.ToString("o"));
        }

        /// <summary>
        /// Terminate a session room, update postgres records, and close socket groups.
        /// </summary>
        /// <param name="sessionId">The chat session ID room.</param>
        public async Task CloseChat(string sessionId)
        {
            if (!Guid.TryParse(sessionId, out Guid sessionGuid)) return;

            _logger.LogInformation("[Hub] Session {SessionId} closed by connection {ConnectionId}.", sessionId, Context.ConnectionId);

            var session = await _context.ChatSessions.FindAsync(sessionGuid);
            if (session != null)
            {
                session.Status = ChatSessionStatuses.Closed;
                session.ClosedAt = DateTimeOffset.UtcNow;
                await _context.SaveChangesAsync();
            }

            // Broadcast closing notice to clients
            await Clients.Group(sessionId).SendAsync("ChatClosed");
        }
    }
}
