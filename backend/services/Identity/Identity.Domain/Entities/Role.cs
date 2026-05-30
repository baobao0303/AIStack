using System;

namespace Identity.Domain.Entities
{
    public class Role
    {
        public Guid Id { get; private set; }
        public string Name { get; private set; }
        public string? Description { get; private set; }

        private Role() 
        { 
            Name = null!;
        } // Required for EF Core

        public Role(Guid id, string name, string? description = null)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Role name cannot be empty.", nameof(name));

            Id = id;
            Name = name.Trim();
            Description = description?.Trim();
        }
    }
}
