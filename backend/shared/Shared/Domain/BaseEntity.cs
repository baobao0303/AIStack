using System;

namespace Shared.Domain
{
    public abstract class BaseEntity
    {
        public Guid Id { get; protected set; }
        public DateTimeOffset CreatedAt { get; protected set; } = DateTimeOffset.UtcNow;

        protected BaseEntity()
        {
            Id = Guid.NewGuid();
        }

        protected BaseEntity(Guid id)
        {
            Id = id;
        }
    }
}
