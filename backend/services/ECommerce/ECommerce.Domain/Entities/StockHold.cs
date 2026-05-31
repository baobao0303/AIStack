using System;
using Shared.Domain;

namespace ECommerce.Domain.Entities
{
    public static class StockHoldStatus
    {
        public const string Pending = "Pending";
        public const string Confirmed = "Confirmed";
        public const string Released = "Released";
    }

    public class StockHold : BaseEntity
    {
        public Guid ProductId { get; private set; }
        public int Quantity { get; private set; }
        public DateTimeOffset ExpiryTime { get; private set; }
        public string Status { get; private set; }

        private StockHold()
        {
            Status = StockHoldStatus.Pending;
        } // Required for EF Core

        public StockHold(Guid id, Guid productId, int quantity, DateTimeOffset expiryTime) : base(id)
        {
            if (quantity <= 0)
                throw new ArgumentException("Quantity must be greater than zero.", nameof(quantity));

            ProductId = productId;
            Quantity = quantity;
            ExpiryTime = expiryTime;
            Status = StockHoldStatus.Pending;
        }

        public void Confirm()
        {
            if (Status != StockHoldStatus.Pending)
                throw new InvalidOperationException($"Cannot confirm stock hold from status: {Status}");

            Status = StockHoldStatus.Confirmed;
        }

        public void Release()
        {
            if (Status != StockHoldStatus.Pending)
                throw new InvalidOperationException($"Cannot release stock hold from status: {Status}");

            Status = StockHoldStatus.Released;
        }
        
        public bool IsExpired => Status == StockHoldStatus.Pending && DateTimeOffset.UtcNow >= ExpiryTime;
    }
}
