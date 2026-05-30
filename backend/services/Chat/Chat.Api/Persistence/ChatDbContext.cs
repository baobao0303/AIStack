using Microsoft.EntityFrameworkCore;
using Chat.Api.Entities;

namespace Chat.Api.Persistence
{
    public class ChatDbContext : DbContext
    {
        public DbSet<Employee> Employees => Set<Employee>();
        public DbSet<EmployeeShift> EmployeeShifts => Set<EmployeeShift>();
        public DbSet<ChatSession> ChatSessions => Set<ChatSession>();
        public DbSet<ChatMessage> ChatMessages => Set<ChatMessage>();

        public ChatDbContext(DbContextOptions<ChatDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // 1. Employees Configuration
            modelBuilder.Entity<Employee>(entity =>
            {
                entity.ToTable("employees");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.FirstName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.LastName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
                entity.Property(e => e.Department).HasMaxLength(100);
                entity.Property(e => e.ActiveChatStatus).IsRequired().HasMaxLength(50);
                entity.HasIndex(e => e.Email).IsUnique();
            });

            // 2. EmployeeShifts Configuration
            modelBuilder.Entity<EmployeeShift>(entity =>
            {
                entity.ToTable("employee_shifts");
                entity.HasKey(es => es.Id);
                entity.Property(es => es.Notes).HasMaxLength(500);

                entity.HasOne<Employee>()
                    .WithMany()
                    .HasForeignKey(es => es.EmployeeId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // 3. ChatSessions Configuration
            modelBuilder.Entity<ChatSession>(entity =>
            {
                entity.ToTable("chat_sessions");
                entity.HasKey(cs => cs.Id);
                entity.Property(cs => cs.CustomerEmail).IsRequired().HasMaxLength(255);
                entity.Property(cs => cs.Status).IsRequired().HasMaxLength(50);
                entity.Property(cs => cs.Summary).HasMaxLength(2000);
                entity.Property(cs => cs.BuyerScore);

                entity.HasOne<Employee>()
                    .WithMany()
                    .HasForeignKey(cs => cs.AssignedEmployeeId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // 4. ChatMessages Configuration
            modelBuilder.Entity<ChatMessage>(entity =>
            {
                entity.ToTable("chat_messages");
                entity.HasKey(cm => cm.Id);
                entity.Property(cm => cm.SenderType).IsRequired().HasMaxLength(50);
                entity.Property(cm => cm.SenderName).IsRequired().HasMaxLength(255);
                entity.Property(cm => cm.Content).IsRequired().HasMaxLength(2000);

                entity.HasOne<ChatSession>()
                    .WithMany()
                    .HasForeignKey(cm => cm.SessionId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
