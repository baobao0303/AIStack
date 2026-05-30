using System;
using System.Threading.Tasks;

namespace Chat.Api.Services
{
    public interface IChatRoutingService
    {
        /// <summary>
        /// Automatically assigns the next best online agent currently on shift to the given chat session.
        /// If no active/online agent is available, puts the session in a queued status.
        /// </summary>
        /// <param name="sessionId">The chat session ID.</param>
        /// <returns>The assigned agent ID, or null if queued.</returns>
        Task<Guid?> AssignAgentAsync(Guid sessionId);
    }
}
