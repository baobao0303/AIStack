using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Chat.Api.Entities;
using Chat.Api.Persistence;

namespace Chat.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ChatSessionsController : ControllerBase
    {
        private readonly ChatDbContext _context;

        public ChatSessionsController(ChatDbContext context)
        {
            _context = context;
        }

        // GET: api/chatsessions
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ChatSession>>> GetChatSessions([FromQuery] string? status, [FromQuery] Guid? employeeId)
        {
            var query = _context.ChatSessions.AsNoTracking();

            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(cs => cs.Status == status);
            }

            if (employeeId.HasValue)
            {
                query = query.Where(cs => cs.AssignedEmployeeId == employeeId.Value);
            }

            return await query.OrderByDescending(cs => cs.CreatedAt).ToListAsync();
        }

        // GET: api/chatsessions/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<ChatSession>> GetChatSession(Guid id)
        {
            var session = await _context.ChatSessions.FindAsync(id);

            if (session == null)
            {
                return NotFound(new { message = $"Chat session with ID {id} not found." });
            }

            return session;
        }

        // GET: api/chatsessions/{id}/messages
        [HttpGet("{id}/messages")]
        public async Task<ActionResult<IEnumerable<ChatMessage>>> GetSessionMessages(Guid id)
        {
            var sessionExists = await _context.ChatSessions.AnyAsync(cs => cs.Id == id);
            if (!sessionExists)
            {
                return NotFound(new { message = $"Chat session with ID {id} not found." });
            }

            var messages = await _context.ChatMessages
                .AsNoTracking()
                .Where(m => m.SessionId == id)
                .OrderBy(m => m.SentAt)
                .ToListAsync();

            return messages;
        }

        // PUT: api/chatsessions/{id}/assign
        [HttpPut("{id}/assign")]
        public async Task<IActionResult> AssignSession(Guid id, [FromBody] AssignSessionRequest request)
        {
            if (request == null || request.EmployeeId == Guid.Empty)
            {
                return BadRequest(new { message = "Invalid request payload or empty Employee ID." });
            }

            var session = await _context.ChatSessions.FindAsync(id);
            if (session == null)
            {
                return NotFound(new { message = $"Chat session with ID {id} not found." });
            }

            // Verify if employee exists
            var employeeExists = await _context.Employees.AnyAsync(e => e.Id == request.EmployeeId);
            if (!employeeExists)
            {
                return BadRequest(new { message = $"Employee with ID {request.EmployeeId} does not exist." });
            }

            session.AssignedEmployeeId = request.EmployeeId;
            if (session.Status == ChatSessionStatuses.Queued)
            {
                session.Status = ChatSessionStatuses.Active;
            }

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

    public class AssignSessionRequest
    {
        public Guid EmployeeId { get; set; }
    }
}
