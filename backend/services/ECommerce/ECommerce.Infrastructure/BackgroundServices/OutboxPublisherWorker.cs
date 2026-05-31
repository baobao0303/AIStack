using System;
using System.Linq;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Shared.Messaging;
using ECommerce.Application.Common.Interfaces;
using ECommerce.Application.Common.Events;

namespace ECommerce.Infrastructure.BackgroundServices
{
    public class OutboxPublisherWorker : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<OutboxPublisherWorker> _logger;

        public OutboxPublisherWorker(IServiceScopeFactory scopeFactory, ILogger<OutboxPublisherWorker> logger)
        {
            _scopeFactory = scopeFactory ?? throw new ArgumentNullException(nameof(scopeFactory));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("OutboxPublisherWorker background service has started.");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await ProcessOutboxEventsAsync(stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred while processing outbox events.");
                }

                await Task.Delay(200, stoppingToken);
            }

            _logger.LogInformation("OutboxPublisherWorker background service has stopped.");
        }

        private async Task ProcessOutboxEventsAsync(CancellationToken stoppingToken)
        {
            using var scope = _scopeFactory.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<IECommerceDbContext>();
            var eventBus = scope.ServiceProvider.GetRequiredService<IEventBus>();

            // Fetch top 20 unprocessed outbox events
            var unprocessedEvents = await db.OutboxEvents
                .Where(oe => oe.ProcessedAt == null)
                .OrderBy(oe => oe.CreatedAt)
                .Take(20)
                .ToListAsync(stoppingToken);

            if (!unprocessedEvents.Any())
            {
                return;
            }

            _logger.LogInformation("Processing {Count} unprocessed outbox events.", unprocessedEvents.Count);

            foreach (var outboxEvent in unprocessedEvents)
            {
                try
                {
                    object? eventPayload = DeserializeEvent(outboxEvent.Type, outboxEvent.Content);
                    if (eventPayload != null)
                    {
                        // Publish asynchronously through the EventBus (RabbitMQ under the hood)
                        await eventBus.PublishAsync(eventPayload);
                        _logger.LogInformation("Successfully published outbox event of type {Type} with ID {Id}.", outboxEvent.Type, outboxEvent.Id);
                    }
                    else
                    {
                        _logger.LogWarning("Unable to deserialize outbox event of type {Type} with ID {Id}.", outboxEvent.Type, outboxEvent.Id);
                    }

                    // Mark as processed
                    outboxEvent.MarkAsProcessed();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to publish outbox event with ID {Id}.", outboxEvent.Id);
                    // Do not mark as processed so it will be retried in the next run
                }
            }

            // Save outbox status changes atomically
            await db.SaveChangesAsync(stoppingToken);
        }

        private object? DeserializeEvent(string typeName, string content)
        {
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

            if (typeName == typeof(ProductCreatedEvent).FullName || typeName == typeof(ProductCreatedEvent).Name)
            {
                return JsonSerializer.Deserialize<ProductCreatedEvent>(content, options);
            }
            if (typeName == typeof(ProductUpdatedEvent).FullName || typeName == typeof(ProductUpdatedEvent).Name)
            {
                return JsonSerializer.Deserialize<ProductUpdatedEvent>(content, options);
            }
            if (typeName == typeof(ProductDeletedEvent).FullName || typeName == typeof(ProductDeletedEvent).Name)
            {
                return JsonSerializer.Deserialize<ProductDeletedEvent>(content, options);
            }
            if (typeName == typeof(ProductPriceChangedEvent).FullName || typeName == typeof(ProductPriceChangedEvent).Name)
            {
                return JsonSerializer.Deserialize<ProductPriceChangedEvent>(content, options);
            }
            if (typeName == typeof(ProductStockChangedEvent).FullName || typeName == typeof(ProductStockChangedEvent).Name)
            {
                return JsonSerializer.Deserialize<ProductStockChangedEvent>(content, options);
            }

            return null;
        }
    }
}
