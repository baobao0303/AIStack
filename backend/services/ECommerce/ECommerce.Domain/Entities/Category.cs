using System;
using System.Collections.Generic;
using Shared.Domain;

namespace ECommerce.Domain.Entities
{
    public class Category : BaseEntity
    {
        public string Name { get; private set; }
        
        public ICollection<Product> Products { get; private set; } = new List<Product>();

        private Category()
        {
            Name = null!;
        } // Required for EF Core

        public Category(Guid id, string name) : base(id)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Category name cannot be empty.", nameof(name));

            Name = name.Trim();
        }

        public void UpdateName(string newName)
        {
            if (string.IsNullOrWhiteSpace(newName))
                throw new ArgumentException("Category name cannot be empty.", nameof(newName));

            Name = newName.Trim();
        }
    }
}
