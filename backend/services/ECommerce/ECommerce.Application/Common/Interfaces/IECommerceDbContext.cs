using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ECommerce.Domain.Entities;

namespace ECommerce.Application.Common.Interfaces
{
    public interface IECommerceDbContext
    {
        DbSet<Product> Products { get; }
        DbSet<Order> Orders { get; }
        DbSet<OrderItem> OrderItems { get; }
        DbSet<Category> Categories { get; }
        DbSet<Review> Reviews { get; }
        DbSet<OutboxEvent> OutboxEvents { get; }
        DbSet<StockHold> StockHolds { get; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    }
}
