using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Chat.Api.Entities;
using Chat.Api.Persistence;
using Chat.Api.Services;

namespace Chat.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AiController : ControllerBase
    {
        private readonly IGeminiAiService _aiService;
        private readonly ChatDbContext _dbContext;

        public AiController(IGeminiAiService aiService, ChatDbContext dbContext)
        {
            _aiService = aiService;
            _dbContext = dbContext;
        }

        // POST: api/ai/suggest
        [HttpPost("suggest")]
        public async Task<ActionResult<List<string>>> SuggestReplies([FromBody] SuggestionRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.ProductContext))
            {
                return BadRequest(new { message = "Invalid request payload or empty product context." });
            }

            var suggestions = await _aiService.GenerateSuggestionsAsync(
                request.ProductContext, 
                request.RecentMessages ?? new List<string>());

            return Ok(suggestions);
        }

        // POST: api/ai/summarize/{sessionId}
        [HttpPost("summarize/{sessionId}")]
        public async Task<IActionResult> SummarizeSession(Guid sessionId, [FromQuery] int activeCartSize = 1)
        {
            var session = await _dbContext.ChatSessions.FindAsync(sessionId);
            if (session == null)
            {
                return NotFound(new { message = $"Chat session with ID {sessionId} not found." });
            }

            // Fetch chat history chronologically
            var messages = await _dbContext.ChatMessages
                .AsNoTracking()
                .Where(m => m.SessionId == sessionId)
                .OrderBy(m => m.SentAt)
                .ToListAsync();

            var chatHistory = messages
                .Select(m => $"[{m.SentAt:yyyy-MM-dd HH:mm:ss}] {m.SenderType} ({m.SenderName}): {m.Content}")
                .ToList();

            // Fallback to empty if there are no messages in the database
            if (!chatHistory.Any())
            {
                chatHistory.Add("[System]: Chat initiated. No messages exchanged yet.");
            }

            // Invoke Gemini AI analysis
            var (summary, buyerScore) = await _aiService.AnalyzeSessionAsync(chatHistory, activeCartSize);

            // Update database record
            session.Summary = summary;
            session.BuyerScore = buyerScore;
            
            await _dbContext.SaveChangesAsync();

            return Ok(new
            {
                SessionId = sessionId,
                CustomerEmail = session.CustomerEmail,
                Summary = summary,
                BuyerScore = buyerScore
            });
        }
    }

    public class SuggestionRequest
    {
        public string ProductContext { get; set; } = null!;
        public List<string>? RecentMessages { get; set; }
    }
}
