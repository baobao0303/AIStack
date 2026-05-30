using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Shared.Messaging;
using Shared.Messaging.Events;
using Notification.Service.Messaging;

namespace Notification.Service
{
    public class Worker : BackgroundService
    {
        private readonly IEventBus _eventBus;
        private readonly ILogger<Worker> _logger;

        public Worker(IEventBus eventBus, ILogger<Worker> logger)
        {
            _eventBus = eventBus;
            _logger = logger;
        }

        protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("==================================================");
            _logger.LogInformation("🧶  Tiệm Nhà Zịt - .NET Notification Service Bootstrapping...  ");
            _logger.LogInformation("==================================================");

            // Register the RabbitMQ consumer subscriber.
            // This binds a durable queue "ChargeSucceededEvent_queue" to the topic exchange
            // and starts asynchronous polling in the background!
            _logger.LogInformation("Connecting to RabbitMQ event bus and registering subscription for ChargeSucceededEvent...");
            _eventBus.Subscribe<ChargeSucceededEvent, ChargeSucceededEventHandler>();

            _logger.LogInformation("[Background Worker] Successfully wired up RabbitMQ event bus. Idle and waiting for integration events.");
            return Task.CompletedTask;
        }
    }
}
