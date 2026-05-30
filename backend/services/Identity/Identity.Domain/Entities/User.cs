using System;

namespace Identity.Domain.Entities
{
    public class User
    {
        public Guid Id { get; private set; }
        public Guid TenantId { get; private set; }
        public string Email { get; private set; }
        public string PasswordHash { get; private set; }
        public string? FirstName { get; private set; }
        public string? LastName { get; private set; }
        public bool EmailVerified { get; private set; }
        public DateTimeOffset CreatedAt { get; private set; }

        private User() 
        { 
            Email = null!;
            PasswordHash = null!;
        } // Required for EF Core

        public User(Guid id, Guid tenantId, string email, string passwordHash, string? firstName, string? lastName)
        {
            if (string.IsNullOrWhiteSpace(email))
                throw new ArgumentException("Email cannot be empty.", nameof(email));
            
            if (string.IsNullOrWhiteSpace(passwordHash))
                throw new ArgumentException("Password hash cannot be empty.", nameof(passwordHash));

            Id = id;
            TenantId = tenantId;
            Email = email.ToLowerInvariant().Trim();
            PasswordHash = passwordHash;
            FirstName = firstName?.Trim();
            LastName = lastName?.Trim();
            EmailVerified = false;
            CreatedAt = DateTimeOffset.UtcNow;
        }

        public void VerifyEmail()
        {
            EmailVerified = true;
        }
    }
}
