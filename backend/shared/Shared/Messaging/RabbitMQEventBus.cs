using System;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace Shared.Messaging
{
    public class RabbitMQEventBus : IEventBus, IDisposable
    {
        private const string BrokerName = "crm_event_bus";
        private readonly string _hostName;
        private readonly IServiceProvider _serviceProvider;
        private IConnection? _connection;
        private IModel? _channel;

        public RabbitMQEventBus(IServiceProvider serviceProvider, string hostName = "localhost")
        {
            _serviceProvider = serviceProvider;
            _hostName = hostName;
            InitializeRabbitMQ();
        }

        private void InitializeRabbitMQ()
        {
            var factory = new ConnectionFactory() 
            { 
                HostName = _hostName,
                DispatchConsumersAsync = true // Enable async event handlers in 6.x
            };

            // Retry connection if RabbitMQ is still booting up (e.g. in Docker Compose)
            int retries = 5;
            for (int i = 0; i < retries; i++)
            {
                try
                {
                    _connection = factory.CreateConnection();
                    _channel = _connection.CreateModel();
                    _channel.ExchangeDeclare(exchange: BrokerName, type: ExchangeType.Topic);
                    break;
                }
                catch (Exception)
                {
                    if (i == retries - 1) throw;
                    System.Threading.Thread.Sleep(3000);
                }
            }
        }

        public Task PublishAsync<TEvent>(TEvent @event) where TEvent : class
        {
            if (_channel == null) throw new InvalidOperationException("RabbitMQ channel is not initialized.");

            var eventName = @event.GetType().Name;
            var json = JsonSerializer.Serialize(@event);
            var body = Encoding.UTF8.GetBytes(json);

            _channel.BasicPublish(
                exchange: BrokerName,
                routingKey: eventName,
                basicProperties: null,
                body: body);

            return Task.CompletedTask;
        }

        public void Subscribe<TEvent, THandler>()
            where TEvent : class
            where THandler : IEventHandler<TEvent>
        {
            if (_channel == null) throw new InvalidOperationException("RabbitMQ channel is not initialized.");

            var eventName = typeof(TEvent).Name;
            var queueName = $"{eventName}_queue";

            _channel.QueueDeclare(queue: queueName, durable: true, exclusive: false, autoDelete: false, arguments: null);
            _channel.QueueBind(queue: queueName, exchange: BrokerName, routingKey: eventName);

            var consumer = new AsyncEventingBasicConsumer(_channel);
            consumer.Received += async (model, ea) =>
            {
                var body = ea.Body.ToArray();
                var message = Encoding.UTF8.GetString(body);
                var @event = JsonSerializer.Deserialize<TEvent>(message);

                if (@event != null)
                {
                    // Create a scope to resolve scoped handlers (like DbContext dependencies)
                    using var scope = _serviceProvider.CreateScope();
                    var handler = scope.ServiceProvider.GetRequiredService<THandler>();
                    await handler.HandleAsync(@event);
                }

                _channel.BasicAck(ea.DeliveryTag, multiple: false);
            };

            _channel.BasicConsume(queue: queueName, autoAck: false, consumer: consumer);
        }

        public void Dispose()
        {
            _channel?.Dispose();
            _connection?.Dispose();
        }
    }
}
