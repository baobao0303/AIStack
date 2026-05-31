using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ECommerce.Application.Common.Interfaces;
using ECommerce.Domain.Entities;
using ECommerce.Domain.Enums;

namespace ECommerce.Infrastructure.Persistence
{
    public class ECommerceDbContext : DbContext, IECommerceDbContext
    {
        public DbSet<Product> Products => Set<Product>();
        public DbSet<Order> Orders => Set<Order>();
        public DbSet<OrderItem> OrderItems => Set<OrderItem>();
        public DbSet<Category> Categories => Set<Category>();
        public DbSet<Review> Reviews => Set<Review>();
        public DbSet<OutboxEvent> OutboxEvents => Set<OutboxEvent>();
        public DbSet<StockHold> StockHolds => Set<StockHold>();

        public ECommerceDbContext(DbContextOptions<ECommerceDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // 1. Category Configuration
            modelBuilder.Entity<Category>(entity =>
            {
                entity.ToTable("categories");
                entity.HasKey(c => c.Id);
                entity.Property(c => c.Name).IsRequired().HasMaxLength(100);

                entity.HasData(
                    new Category(Guid.Parse("c1111111-1111-1111-1111-111111111111"), "Wool"),
                    new Category(Guid.Parse("c2222222-2222-2222-2222-222222222222"), "Handmade")
                );
            });

            // 2. Product Configuration
            modelBuilder.Entity<Product>(entity =>
            {
                entity.ToTable("products");
                entity.HasKey(p => p.Id);
                entity.Property(p => p.Name).IsRequired().HasMaxLength(255);
                entity.Property(p => p.Description).IsRequired().HasMaxLength(1000);
                entity.Property(p => p.Price).HasPrecision(18, 2);
                entity.Property(p => p.Category).IsRequired().HasMaxLength(100);

                entity.Property(p => p.Sku).IsRequired().HasMaxLength(100);
                entity.Property(p => p.Slug).IsRequired().HasMaxLength(150);
                entity.Property(p => p.WoolType).IsRequired().HasMaxLength(100);
                
                entity.Property(p => p.ImagesJson).HasColumnName("images_json");
                entity.Property(p => p.VideosJson).HasColumnName("videos_json");
                entity.Property(p => p.ColorsJson).HasColumnName("colors_json");
                entity.Property(p => p.TypesJson).HasColumnName("types_json");
                entity.Property(p => p.TagsJson).HasColumnName("tags_json");

                entity.Property(p => p.Width).IsRequired();
                entity.Property(p => p.Height).IsRequired();
                entity.Property(p => p.Depth);
                entity.Property(p => p.Weight);
                entity.Property(p => p.Rating).IsRequired();
                entity.Property(p => p.ReviewCount).IsRequired();
                entity.Property(p => p.Status).IsRequired().HasConversion<string>().HasMaxLength(50);
                
                entity.Property(p => p.ReservedStock).IsRequired();

                entity.HasIndex(p => p.Slug).IsUnique();
                entity.HasIndex(p => p.Sku).IsUnique();

                // Relationship configuration
                entity.HasOne(p => p.CategoryRelation)
                    .WithMany(c => c.Products)
                    .HasForeignKey(p => p.CategoryId)
                    .OnDelete(DeleteBehavior.SetNull);

                // Seed products using anonymous objects to map extended DDD columns seamlessly
                entity.HasData(
                    new
                    {
                        Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                        Name = "Len Merino Cao Cấp",
                        Description = "Sợi len merino siêu mịn, nhập khẩu nguyên cuộn, thích hợp đan móc khăn và áo khoác ấm áp mùa đông.",
                        Price = 120000m,
                        Category = "wool",
                        InventoryStock = 150,
                        ImageUrl = "/images/wool_merino.jpg",
                        Sku = "SKU-LENMERINOCAOCAP-1111",
                        Slug = "len-merino-cao-cap",
                        CategoryId = Guid.Parse("c1111111-1111-1111-1111-111111111111"),
                        WoolType = "Milk Cotton",
                        Width = 10.0,
                        Height = 10.0,
                        Rating = 5.0,
                        ReviewCount = 1,
                        Status = ProductStatus.Active,
                        ReservedStock = 0,
                        CreatedAt = DateTimeOffset.UtcNow
                    },
                    new
                    {
                        Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                        Name = "Khăn Len Handmade Mùa Đông",
                        Description = "Khăn len quàng cổ được dệt thủ công tỉ mỉ bằng sợi len merino cao cấp, màu sắc trung tính thời thượng.",
                        Price = 350000m,
                        Category = "handmade",
                        InventoryStock = 50,
                        ImageUrl = "/images/scarf_handmade.jpg",
                        Sku = "SKU-KHANLENHANDMADEMUADONG-2222",
                        Slug = "khan-len-handmade-mua-dong",
                        CategoryId = Guid.Parse("c2222222-2222-2222-2222-222222222222"),
                        WoolType = "Milk Cotton",
                        Width = 20.0,
                        Height = 150.0,
                        Rating = 5.0,
                        ReviewCount = 1,
                        Status = ProductStatus.Active,
                        ReservedStock = 0,
                        CreatedAt = DateTimeOffset.UtcNow
                    },
                    new
                    {
                        Id = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                        Name = "Áo Khoác Len Thủ Công",
                        Description = "Áo cardigan dệt kim phong cách retro, 100% làm bằng tay từ các nghệ nhân lành nghề.",
                        Price = 750000m,
                        Category = "handmade",
                        InventoryStock = 20,
                        ImageUrl = "/images/cardigan_handmade.jpg",
                        Sku = "SKU-AOKHOACLENTHUCONG-3333",
                        Slug = "ao-khoac-len-thu-cong",
                        CategoryId = Guid.Parse("c2222222-2222-2222-2222-222222222222"),
                        WoolType = "Chenille Velvet",
                        Width = 50.0,
                        Height = 70.0,
                        Rating = 5.0,
                        ReviewCount = 1,
                        Status = ProductStatus.Active,
                        ReservedStock = 0,
                        CreatedAt = DateTimeOffset.UtcNow
                    },
                    new
                    {
                        Id = Guid.Parse("44444444-4444-4444-4444-444444444444"),
                        Name = "Sợi Len Nhung Đan Móc",
                        Description = "Sợi len nhung đan móc siêu mềm mại, chuyên dùng móc thú bông và chăn bông an toàn cho da em bé.",
                        Price = 45000m,
                        Category = "wool",
                        InventoryStock = 300,
                        ImageUrl = "/images/wool_velvet.jpg",
                        Sku = "SKU-SOILENNHUNGDANMOC-4444",
                        Slug = "soi-len-nhung-dan-moc",
                        CategoryId = Guid.Parse("c1111111-1111-1111-1111-111111111111"),
                        WoolType = "Chenille Velvet",
                        Width = 8.0,
                        Height = 8.0,
                        Rating = 5.0,
                        ReviewCount = 1,
                        Status = ProductStatus.Active,
                        ReservedStock = 0,
                        CreatedAt = DateTimeOffset.UtcNow
                    }
                );
            });

            // 3. Order Configuration
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

            // 4. OrderItem Configuration
            modelBuilder.Entity<OrderItem>(entity =>
            {
                entity.ToTable("order_items");
                entity.HasKey(oi => oi.Id);
                entity.Property(oi => oi.ProductName).IsRequired().HasMaxLength(255);
                entity.Property(oi => oi.Price).HasPrecision(18, 2);
            });

            // 5. Review Configuration
            modelBuilder.Entity<Review>(entity =>
            {
                entity.ToTable("reviews");
                entity.HasKey(r => r.Id);
                entity.Property(r => r.Comment).IsRequired().HasMaxLength(2000);
                entity.Property(r => r.Rating).IsRequired();
            });

            // 6. OutboxEvent Configuration
            modelBuilder.Entity<OutboxEvent>(entity =>
            {
                entity.ToTable("outbox_events");
                entity.HasKey(oe => oe.Id);
                entity.Property(oe => oe.Type).IsRequired().HasMaxLength(255);
                entity.Property(oe => oe.Content).IsRequired();
            });

            // 7. StockHold Configuration
            modelBuilder.Entity<StockHold>(entity =>
            {
                entity.ToTable("stock_holds");
                entity.HasKey(sh => sh.Id);
                entity.Property(sh => sh.ProductId).IsRequired();
                entity.Property(sh => sh.Quantity).IsRequired();
                entity.Property(sh => sh.ExpiryTime).IsRequired();
                entity.Property(sh => sh.Status).IsRequired().HasMaxLength(50);
            });
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            return base.SaveChangesAsync(cancellationToken);
        }
    }
}
