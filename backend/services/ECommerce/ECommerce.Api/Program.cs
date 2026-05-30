using ECommerce.Application;
using ECommerce.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Add clean architecture layers
builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration);

// Register RabbitMQ Messaging Services
builder.Services.AddSingleton<Shared.Messaging.IEventBus>(sp => 
{
    var rabbitHost = builder.Configuration["MessageBus:Host"] ?? "localhost";
    return new Shared.Messaging.RabbitMQEventBus(sp, rabbitHost);
});
builder.Services.AddScoped<ECommerce.Infrastructure.Messaging.ChargeSucceededConsumer>();
builder.Services.AddHostedService<ECommerce.Api.BackgroundServices.RabbitMQConsumerBackgroundService>();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo 
    { 
        Title = "CRM Portal & E-commerce - Storefront API", 
        Version = "v1",
        Description = "Hệ thống E-commerce bán lẻ đồ len/handmade và tích hợp đặt hàng cổng thanh toán Stripe Checkout."
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
