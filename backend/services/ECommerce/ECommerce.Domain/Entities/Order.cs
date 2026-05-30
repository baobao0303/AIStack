using System;
using System.Collections.Generic;

namespace ECommerce.Domain.Entities
{
    public static class OrderStatus
    {
        public const string Pending = "pending";
        public const string Paid = "paid";
        public const string Shipped = "shipped";
        public const string Cancelled = "cancelled";
    }

    public class Order
    {
        public Guid Id { get; private set; }
        public string BuyerEmail { get; private set; }
        public decimal TotalAmount { get; private set; }
        public string Status { get; private set; }
        public string? StripeSessionId { get; private set; }
        public DateTimeOffset CreatedAt { get; private set; }
        
        private readonly List<OrderItem> _orderItems = new();
        public IReadOnlyCollection<OrderItem> OrderItems => _orderItems.AsReadOnly();

        private Order()
        {
            BuyerEmail = null!;
            Status = OrderStatus.Pending;
        } // Required for EF Core

        public Order(Guid id, string buyerEmail, decimal totalAmount, string? stripeSessionId = null)
        {
            if (string.IsNullOrWhiteSpace(buyerEmail))
                throw new ArgumentException("Buyer email cannot be empty.", nameof(buyerEmail));
            if (totalAmount < 0)
                throw new ArgumentException("Order total amount cannot be negative.", nameof(totalAmount));

            Id = id;
            BuyerEmail = buyerEmail.ToLowerInvariant().Trim();
            TotalAmount = totalAmount;
            Status = OrderStatus.Pending;
            StripeSessionId = stripeSessionId;
            CreatedAt = DateTimeOffset.UtcNow;
        }

        public void AddItem(Guid productId, string productName, decimal price, int quantity)
        {
            if (quantity <= 0)
                throw new ArgumentException("Quantity must be greater than zero.", nameof(quantity));

            var item = new OrderItem(Guid.NewGuid(), Id, productId, productName, price, quantity);
            _orderItems.Add(item);
        }

        public void SetPaid(string stripeSessionId)
        {
            if (Status != OrderStatus.Pending)
                throw new InvalidOperationException($"Cannot mark order as Paid from current status: {Status}");

            Status = OrderStatus.Paid;
            StripeSessionId = stripeSessionId;
        }

        public void Ship()
        {
            if (Status != OrderStatus.Paid)
                throw new InvalidOperationException($"Cannot ship order unless it is Paid. Current status: {Status}");

            Status = OrderStatus.Shipped;
        }

        public void Cancel()
        {
            if (Status == OrderStatus.Shipped)
                throw new InvalidOperationException("Cannot cancel an order that has already been shipped.");

            Status = OrderStatus.Cancelled;
        }
    }
}
