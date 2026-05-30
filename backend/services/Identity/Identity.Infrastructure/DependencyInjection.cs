using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Identity.Application.Common.Interfaces;
using Identity.Infrastructure.Persistence;
using Identity.Infrastructure.Security;

namespace Identity.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
        {
            // Register PostgreSQL database context
            var connectionString = configuration.GetConnectionString("DefaultConnection");
            
            services.AddDbContext<IdentityDbContext>(options =>
                options.UseNpgsql(connectionString,
                    b => b.MigrationsAssembly(typeof(IdentityDbContext).Assembly.FullName)));

            // Map IIdentityDbContext to the DbContext instance
            services.AddScoped<IIdentityDbContext>(provider => provider.GetRequiredService<IdentityDbContext>());

            // Register security utilities
            services.AddSingleton<IPasswordHasher, PasswordHasher>();

            return services;
        }
    }
}
