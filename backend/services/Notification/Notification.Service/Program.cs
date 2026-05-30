using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Shared.Messaging;
using Notification.Service.Messaging;
using Notification.Service.Services;

var builder = Host.CreateDefaultBuilder(args)
    .ConfigureServices((hostContext, services) =>
    {
        // 1. Configure the Shared RabbitMQ Event Bus
        services.AddSingleton<IEventBus>(sp =>
        {
            var rabbitHost = hostContext.Configuration["MessageBus:Host"] ?? "localhost";
            return new RabbitMQEventBus(sp, rabbitHost);
        });

        // 2. Register SMTP Email Sender
        services.AddTransient<IEmailSender, EmailSender>();

        // 3. Register RabbitMQ Integration Event Handler
        services.AddTransient<ChargeSucceededEventHandler>();

        // 4. Register the Hosted Worker Background Service
        services.AddHostedService<Notification.Service.Worker>();
    });

var host = builder.Build();
host.Run();
