using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Chat.Api.Hubs;
using Chat.Api.Persistence;
using Chat.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// 1. Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "CRM Portal & E-commerce - Support Chat API",
        Version = "v1",
        Description = "Hệ thống hỗ trợ hội thoại trực tuyến thời gian thực (Real-time SignalR Live Chat) cho khách hàng và nhân viên hỗ trợ."
    });
});

// 2. Register PostgreSQL DB Context mapping employees, shifts, sessions, messages
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? "Host=localhost;Database=crm_shared;Username=postgres;Password=supersecretpassword";
builder.Services.AddDbContext<ChatDbContext>(options =>
    options.UseNpgsql(connectionString));

// 3. Register Redis scale-out backend for SignalR socket communication synchronization
var redisConnectionString = builder.Configuration.GetConnectionString("RedisConnection") ?? "localhost:6379";
builder.Services.AddSignalR().AddStackExchangeRedis(redisConnectionString, options =>
{
    options.Configuration.ChannelPrefix = "crm_chat";
});

// 4. Register chat business logic services
builder.Services.AddScoped<IChatRoutingService, ChatRoutingService>();
builder.Services.AddHostedService<ShiftMonitoringBackgroundService>();

var app = builder.Build();

// 5. Database Auto-Migration & Seeding on Startup
await DbInitializer.SeedAsync(app.Services);

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

// 6. Map the SignalR WebSocket Hub endpoint
app.MapHub<ChatHub>("/hubs/chat");

app.Run();

public partial class Program { }
