using System;

namespace ECommerce.Domain.Entities
{
    public class OutboxEvent
    {
        public Guid Id { get; private set; }
        public string Type { get; private set; }
        public string Content { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public DateTime? ProcessedAt { get; private set; }

        private OutboxEvent()
        {
            Type = null!;
            Content = null!;
        } // Required for EF Core

        public OutboxEvent(Guid id, string type, string content)
        {
            Id = id;
            Type = type;
            Content = content;
            CreatedAt = DateTime.UtcNow;
        }

        public void MarkAsProcessed()
        {
            ProcessedAt = DateTime.UtcNow;
        }
    }
}
