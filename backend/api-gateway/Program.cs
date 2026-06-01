using Yarp.ReverseProxy;
using Yarp.ReverseProxy.Model;

var builder = WebApplication.CreateBuilder(args);

// Add CORS services to allow direct connection from storefront-web (3000) and crm-portal (4200)
builder.Services.AddCors(options =>
{
    options.AddPolicy("GatewayCorsPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:4200")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// Add Yarp Reverse Proxy services
builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

var app = builder.Build();

// Configure the HTTP request pipeline
app.UseRouting();

app.UseCors("GatewayCorsPolicy");

app.MapReverseProxy(proxyPipeline =>
{
    proxyPipeline.Use(async (context, next) =>
    {
        var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();
        var proxyFeature = context.GetReverseProxyFeature();
        var route = proxyFeature?.Route;
        var clusterId = route?.Config.ClusterId ?? "unknown";
        var routeId = route?.Config.RouteId ?? "unknown";

        logger.LogInformation("[Gateway Request] {Method} {Path} -> Target Cluster: {ClusterId} (Route: {RouteId})",
            context.Request.Method, context.Request.Path, clusterId, routeId);

        await next();

        var destination = proxyFeature?.ProxiedDestination;
        var destinationAddress = destination?.Model.Config.Address ?? "unknown";
        
        logger.LogInformation("[Gateway Response] {Method} {Path} -> Status: {StatusCode} (Routed to: {DestinationAddress})",
            context.Request.Method, context.Request.Path, context.Response.StatusCode, destinationAddress);
    });
});

app.Run();

