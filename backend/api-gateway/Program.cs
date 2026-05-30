var builder = WebApplication.CreateBuilder(args);

// Add Yarp Reverse Proxy services
builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

var app = builder.Build();

// Configure the HTTP request pipeline
app.UseRouting();

app.MapReverseProxy();

app.Run();
