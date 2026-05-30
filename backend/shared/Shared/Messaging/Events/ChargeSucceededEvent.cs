using System;

namespace Shared.Messaging.Events
{
    public class ChargeSucceededEvent
    {
        public string StripeSessionId { get; set; } = null!;
        public DateTimeOffset Timestamp { get; set; } = DateTimeOffset.UtcNow;
    }
}
