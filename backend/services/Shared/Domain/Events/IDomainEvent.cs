using System;

namespace Shared.Domain.Events
{
    public interface IDomainEvent
    {
        Guid EventId { get; }
        DateTimeOffset OccurredOn { get; }
    }
}
