using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Identity.Domain.Entities;

namespace Identity.Application.Common.Interfaces
{
    public interface IIdentityDbContext
    {
        DbSet<Tenant> Tenants { get; }
        DbSet<User> Users { get; }
        DbSet<Role> Roles { get; }
        DbSet<UserRole> UserRoles { get; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    }
}
