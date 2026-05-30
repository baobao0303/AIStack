using System;

namespace Identity.Domain.Entities
{
    public class RefreshToken
    {
        public Guid Id { get; private set; }
        public Guid UserId { get; private set; }
        public string TokenHash { get; private set; }
        public string JwtId { get; private set; }
        public DateTimeOffset CreatedAt { get; private set; }
        public DateTimeOffset ExpiresAt { get; private set; }
        public bool IsRevoked { get; private set; }
        public DateTimeOffset? RevokedAt { get; private set; }

        private RefreshToken()
        {
            TokenHash = null!;
            JwtId = null!;
        } // Required for EF Core

        public RefreshToken(Guid id, Guid userId, string tokenHash, string jwtId, DateTimeOffset createdAt, DateTimeOffset expiresAt)
        {
            if (string.IsNullOrWhiteSpace(tokenHash))
                throw new ArgumentException("Token hash cannot be empty.", nameof(tokenHash));
            if (string.IsNullOrWhiteSpace(jwtId))
                throw new ArgumentException("JWT ID cannot be empty.", nameof(jwtId));

            Id = id;
            UserId = userId;
            TokenHash = tokenHash;
            JwtId = jwtId;
            CreatedAt = createdAt;
            ExpiresAt = expiresAt;
            IsRevoked = false;
        }

        public void Revoke(DateTimeOffset revokedAt)
        {
            IsRevoked = true;
            RevokedAt = revokedAt;
        }
    }
}
