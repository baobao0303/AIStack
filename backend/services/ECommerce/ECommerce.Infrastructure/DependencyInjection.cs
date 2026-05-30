using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ECommerce.Application.Common.Interfaces;
using ECommerce.Infrastructure.Persistence;
using ECommerce.Infrastructure.Payments;

namespace ECommerce.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
        {
            // Register PostgreSQL database context for Catalog & Orders
            var connectionString = configuration.GetConnectionString("ECommerceConnection");
            
            // Check if connectionString exists, otherwise use in-memory/default (for testing resilience)
            if (!string.IsNullOrWhiteSpace(connectionString))
            {
                services.AddDbContext<ECommerceDbContext>(options =>
                    options.UseNpgsql(connectionString,
                        b => b.MigrationsAssembly(typeof(ECommerceDbContext).Assembly.FullName)));
            }
            else
            {
                // Fallback for isolated developer environment
                services.AddDbContext<ECommerceDbContext>(options =>
                    options.UseInMemoryDatabase("ECommerceDb"));
            }

            services.AddScoped<IECommerceDbContext>(provider => provider.GetRequiredService<ECommerceDbContext>());

            // Register Stripe C# API integration payment client
            services.AddSingleton<IStripePaymentService, StripePaymentService>();

            return services;
        }
    }
}
