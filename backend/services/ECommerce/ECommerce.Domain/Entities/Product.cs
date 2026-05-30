using System;

namespace ECommerce.Domain.Entities
{
    public class Product
    {
        public Guid Id { get; private set; }
        public string Name { get; private set; }
        public string Description { get; private set; }
        public decimal Price { get; private set; }
        public string Category { get; private set; } // e.g. "wool", "handmade"
        public int InventoryStock { get; private set; }
        public string? ImageUrl { get; private set; }

        private Product()
        {
            Name = null!;
            Description = null!;
            Category = null!;
        } // Required for EF Core

        public Product(Guid id, string name, string description, decimal price, string category, int inventoryStock, string? imageUrl = null)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Product name cannot be empty.", nameof(name));
            if (price < 0)
                throw new ArgumentException("Product price cannot be negative.", nameof(price));
            if (inventoryStock < 0)
                throw new ArgumentException("Product inventory stock cannot be negative.", nameof(inventoryStock));

            Id = id;
            Name = name.Trim();
            Description = description.Trim();
            Price = price;
            Category = category.ToLowerInvariant().Trim();
            InventoryStock = inventoryStock;
            ImageUrl = imageUrl;
        }

        public void DecreaseStock(int quantity)
        {
            if (quantity < 0)
                throw new ArgumentException("Quantity to decrease must be positive.", nameof(quantity));
            if (InventoryStock - quantity < 0)
                throw new InvalidOperationException($"Insufficient inventory stock for product '{Name}'. Available: {InventoryStock}, requested: {quantity}");

            InventoryStock -= quantity;
        }

        public void IncreaseStock(int quantity)
        {
            if (quantity < 0)
                throw new ArgumentException("Quantity to increase must be positive.", nameof(quantity));

            InventoryStock += quantity;
        }
    }
}
