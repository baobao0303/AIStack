using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Identity.Domain.Entities;
using Identity.Domain.Constants;
using Identity.Application.Common.Interfaces;

namespace Identity.Infrastructure.Persistence
{
    public class IdentityDbContext : DbContext, IIdentityDbContext
    {
        public DbSet<Tenant> Tenants => Set<Tenant>();
        public DbSet<User> Users => Set<User>();
        public DbSet<Role> Roles => Set<Role>();
        public DbSet<UserRole> UserRoles => Set<UserRole>();

        public IdentityDbContext(DbContextOptions<IdentityDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // 1. Tenant Configuration
            modelBuilder.Entity<Tenant>(entity =>
            {
                entity.ToTable("tenants");
                entity.HasKey(t => t.Id);
                entity.Property(t => t.Name).IsRequired().HasMaxLength(255);
                entity.Property(t => t.Domain).IsRequired().HasMaxLength(100);
                entity.HasIndex(t => t.Domain).IsUnique();
            });

            // 2. User Configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("users");
                entity.HasKey(u => u.Id);
                entity.Property(u => u.Email).IsRequired().HasMaxLength(255);
                entity.Property(u => u.PasswordHash).IsRequired().HasMaxLength(255);
                entity.Property(u => u.FirstName).HasMaxLength(100);
                entity.Property(u => u.LastName).HasMaxLength(100);
                entity.HasIndex(u => u.Email).IsUnique();
            });

            // 3. Role Configuration
            modelBuilder.Entity<Role>(entity =>
            {
                entity.ToTable("roles");
                entity.HasKey(r => r.Id);
                entity.Property(r => r.Name).IsRequired().HasMaxLength(50);
                entity.HasIndex(r => r.Name).IsUnique();

                // Pre-seed static roles
                entity.HasData(
                    new Role(RoleIds.SuperAdmin, "Super Admin", "Full administrative control of the system and tenants."),
                    new Role(RoleIds.Admin, "Admin", "Administrative control over a specific tenant workspace."),
                    new Role(RoleIds.Manager, "Manager", "Manages support sales staff and reviews reports."),
                    new Role(RoleIds.SupportRep, "Support Rep", "Provides live chat assistance and manages wool catalog/orders.")
                );
            });

            // 4. UserRole Configuration
            modelBuilder.Entity<UserRole>(entity =>
            {
                entity.ToTable("user_roles");
                entity.HasKey(ur => new { ur.UserId, ur.RoleId });
            });
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            return base.SaveChangesAsync(cancellationToken);
        }
    }
}
