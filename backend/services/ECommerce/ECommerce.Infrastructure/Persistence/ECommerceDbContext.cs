using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ECommerce.Application.Common.Interfaces;
using ECommerce.Domain.Entities;

namespace ECommerce.Infrastructure.Persistence
{
    public class ECommerceDbContext : DbContext, IECommerceDbContext
    {
        public DbSet<Product> Products => Set<Product>();
        public DbSet<Order> Orders => Set<Order>();
        public DbSet<OrderItem> OrderItems => Set<OrderItem>();

        public ECommerceDbContext(DbContextOptions<ECommerceDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // 1. Product Configuration
            modelBuilder.Entity<Product>(entity =>
            {
                entity.ToTable("products");
                entity.HasKey(p => p.Id);
                entity.Property(p => p.Name).IsRequired().HasMaxLength(255);
                entity.Property(p => p.Description).IsRequired().HasMaxLength(1000);
                entity.Property(p => p.Price).HasPrecision(18, 2);
                entity.Property(p => p.Category).IsRequired().HasMaxLength(100);

                // Seed baseline wool/handmade product catalog
                entity.HasData(
                    new Product(
                        Guid.Parse("11111111-1111-1111-1111-111111111111"),
                        "Len Merino Cao Cấp",
                        "Sợi len merino siêu mịn, nhập khẩu nguyên cuộn, thích hợp đan móc khăn và áo khoác ấm áp mùa đông.",
                        120000,
                        "wool",
                        150,
                        "/images/wool_merino.jpg"
                    ),
                    new Product(
                        Guid.Parse("22222222-2222-2222-2222-222222222222"),
                        "Khăn Len Handmade Mùa Đông",
                        "Khăn len quàng cổ được dệt thủ công tỉ mỉ bằng sợi len merino cao cấp, màu sắc trung tính thời thượng.",
                        350000,
                        "handmade",
                        50,
                        "/images/scarf_handmade.jpg"
                    ),
                    new Product(
                        Guid.Parse("33333333-3333-3333-3333-333333333333"),
                        "Áo Khoác Len Thủ Công",
                        "Áo cardigan dệt kim phong cách retro, 100% làm bằng tay từ các nghệ nhân lành nghề.",
                        750000,
                        "handmade",
                        20,
                        "/images/cardigan_handmade.jpg"
                    ),
                    new Product(
                        Guid.Parse("44444444-4444-4444-4444-444444444444"),
                        "Sợi Len Nhung Đan Móc",
                        "Sợi len nhung đan móc siêu mềm mại, chuyên dùng móc thú bông và chăn bông an toàn cho da em bé.",
                        45000,
                        "wool",
                        300,
                        "/images/wool_velvet.jpg"
                    )
                );
            });

            // 2. Order Configuration
            modelBuilder.Entity<Order>(entity =>
            {
                entity.ToTable("orders");
                entity.HasKey(o => o.Id);
                entity.Property(o => o.BuyerEmail).IsRequired().HasMaxLength(255);
                entity.Property(o => o.TotalAmount).HasPrecision(18, 2);
                entity.Property(o => o.Status).IsRequired().HasMaxLength(50);
                entity.Property(o => o.StripeSessionId).HasMaxLength(255);

                entity.HasMany(o => o.OrderItems)
                    .WithOne()
                    .HasForeignKey(oi => oi.OrderId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // 3. OrderItem Configuration
            modelBuilder.Entity<OrderItem>(entity =>
            {
                entity.ToTable("order_items");
                entity.HasKey(oi => oi.Id);
                entity.Property(oi => oi.ProductName).IsRequired().HasMaxLength(255);
                entity.Property(oi => oi.Price).HasPrecision(18, 2);
            });
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            return base.SaveChangesAsync(cancellationToken);
        }
    }
}
