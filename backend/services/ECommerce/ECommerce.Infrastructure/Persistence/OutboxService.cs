using System;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using ECommerce.Application.Common.Interfaces;
using ECommerce.Domain.Entities;

namespace ECommerce.Infrastructure.Persistence
{
    public class OutboxService : IOutboxService
    {
        private readonly IECommerceDbContext _context;

        public OutboxService(IECommerceDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task StageEventAsync<T>(T domainEvent, CancellationToken cancellationToken) where T : class
        {
            if (domainEvent == null) throw new ArgumentNullException(nameof(domainEvent));

            var eventName = domainEvent.GetType().FullName ?? domainEvent.GetType().Name;
            var jsonPayload = JsonSerializer.Serialize(domainEvent);

            var outboxEvent = new OutboxEvent(Guid.NewGuid(), eventName, jsonPayload);

            await _context.OutboxEvents.AddAsync(outboxEvent, cancellationToken);
        }
    }
}
