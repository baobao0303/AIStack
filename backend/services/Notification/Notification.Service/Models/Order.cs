using System;
using System.Collections.Generic;

namespace Notification.Service.Models
{
    public class Order
    {
        public Guid Id { get; set; }
        public string BuyerEmail { get; set; } = null!;
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = null!;
        public string? StripeSessionId { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public List<OrderItem> OrderItems { get; set; } = new();
    }

    public class OrderItem
    {
        public Guid Id { get; set; }
        public Guid OrderId { get; set; }
        public Guid ProductId { get; set; }
        public string ProductName { get; set; } = null!;
        public decimal Price { get; set; }
        public int Quantity { get; set; }
    }
}
