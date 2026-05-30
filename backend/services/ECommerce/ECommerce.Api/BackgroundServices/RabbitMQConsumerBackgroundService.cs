using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Shared.Messaging;
using Shared.Messaging.Events;
using ECommerce.Infrastructure.Messaging;

namespace ECommerce.Api.BackgroundServices
{
    public class RabbitMQConsumerBackgroundService : BackgroundService
    {
        private readonly IEventBus _eventBus;

        public RabbitMQConsumerBackgroundService(IEventBus eventBus)
        {
            _eventBus = eventBus;
        }

        protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {
            // Subscribe to the ChargeSucceededEvent and route to ChargeSucceededConsumer
            _eventBus.Subscribe<ChargeSucceededEvent, ChargeSucceededConsumer>();
            return Task.CompletedTask;
        }
    }
}
