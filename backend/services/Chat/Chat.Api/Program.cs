using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Chat.Api.Hubs;
using Chat.Api.Persistence;
using Chat.Api.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

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

    // Cấu hình nút Authorize bảo mật JWT Bearer trên giao diện Swagger
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Description = "Nhập Token JWT vào ô trống theo định dạng: Bearer {your_jwt_token}",
        Name = "Authorization",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Register Npgsql Database Context mapping employees, shifts, sessions, messages
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? "Host=localhost;Database=crm_shared;Username=postgres;Password=supersecretpassword";
builder.Services.AddDbContext<ChatDbContext>(options =>
    options.UseNpgsql(connectionString));

// Register Redis scale-out backend for SignalR socket communication synchronization
var redisConnectionString = builder.Configuration.GetConnectionString("RedisConnection") ?? "localhost:6379";
builder.Services.AddSignalR().AddStackExchangeRedis(redisConnectionString, options =>
{
    options.Configuration.ChannelPrefix = "crm_chat";
});

// Register Chat Business Logic Services
builder.Services.AddScoped<IChatRoutingService, ChatRoutingService>();
builder.Services.AddHostedService<ShiftMonitoringBackgroundService>();
builder.Services.AddHttpClient<IGeminiAiService, GeminiAiService>();

// Cấu hình xác thực bảo mật JWT Bearer cho Chat API
var secretKey = builder.Configuration["Jwt:Secret"] ?? "ThisIsASuperSecretKeyForSigningJWTTokens1234567890!";
var issuer = builder.Configuration["Jwt:Issuer"] ?? "Identity.Api";
var audience = builder.Configuration["Jwt:Audience"] ?? "CRMPortal";

var authBuilder = builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
});

if (builder.Environment.IsEnvironment("Testing"))
{
    // Cài đặt Scheme Test luôn luôn thành công cho kiểm thử tích hợp SignalR & API
    authBuilder.AddScheme<AuthenticationSchemeOptions, TestAuthHandler>(JwtBearerDefaults.AuthenticationScheme, options => {});
}
else
{
    authBuilder.AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = issuer,
            ValidAudience = audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
        };
    });
}

var app = builder.Build();

// Database Auto-Migration & Seeding on Startup
await DbInitializer.SeedAsync(app.Services);

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Map the SignalR WebSocket Hub endpoint
app.MapHub<ChatHub>("/hubs/chat");

app.Run();

public class TestAuthHandler : AuthenticationHandler<AuthenticationSchemeOptions>
{
    public TestAuthHandler(
        Microsoft.Extensions.Options.IOptionsMonitor<AuthenticationSchemeOptions> options,
        ILoggerFactory logger,
        System.Text.Encodings.Web.UrlEncoder encoder,
        ISystemClock clock)
        : base(options, logger, encoder, clock)
    {
    }

    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        var claims = new[] { 
            new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Name, "TestUser"),
            new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Role, "Admin") 
        };
        var identity = new System.Security.Claims.ClaimsIdentity(claims, "Test");
        var principal = new System.Security.Claims.ClaimsPrincipal(identity);
        var ticket = new AuthenticationTicket(principal, JwtBearerDefaults.AuthenticationScheme);

        return Task.FromResult(AuthenticateResult.Success(ticket));
    }
}

public partial class Program { }
