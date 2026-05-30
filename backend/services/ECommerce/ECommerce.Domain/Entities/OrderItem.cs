using System;

namespace ECommerce.Domain.Entities
{
    public class OrderItem
    {
        public Guid Id { get; private set; }
        public Guid OrderId { get; private set; }
        public Guid ProductId { get; private set; }
        public string ProductName { get; private set; }
        public decimal Price { get; private set; }
        public int Quantity { get; private set; }

        private OrderItem()
        {
            ProductName = null!;
        } // Required for EF Core

        public OrderItem(Guid id, Guid orderId, Guid productId, string productName, decimal price, int quantity)
        {
            if (string.IsNullOrWhiteSpace(productName))
                throw new ArgumentException("Product name cannot be empty.", nameof(productName));
            if (price < 0)
                throw new ArgumentException("Item price cannot be negative.", nameof(price));
            if (quantity <= 0)
                throw new ArgumentException("Item quantity must be greater than zero.", nameof(quantity));

            Id = id;
            OrderId = orderId;
            ProductId = productId;
            ProductName = productName.Trim();
            Price = price;
            Quantity = quantity;
        }
    }
}
