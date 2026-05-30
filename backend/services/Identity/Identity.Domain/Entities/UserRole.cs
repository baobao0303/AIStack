using System;

namespace Identity.Domain.Entities
{
    public class UserRole
    {
        public Guid UserId { get; private set; }
        public Guid RoleId { get; private set; }

        private UserRole() { } // Required for EF Core

        public UserRole(Guid userId, Guid roleId)
        {
            UserId = userId;
            RoleId = roleId;
        }
    }
}
// Pre-seeded static Role IDs for seed integrity
namespace Identity.Domain.Constants
{
    public static class RoleIds
    {
        public static readonly Guid SuperAdmin = Guid.Parse("11111111-1111-1111-1111-111111111111");
        public static readonly Guid Admin = Guid.Parse("22222222-2222-2222-2222-222222222222");
        public static readonly Guid Manager = Guid.Parse("33333333-3333-3333-3333-333333333333");
        public static readonly Guid SupportRep = Guid.Parse("44444444-4444-4444-4444-444444444444");
    }
}
