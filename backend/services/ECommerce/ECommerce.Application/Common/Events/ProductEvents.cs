using System;

namespace ECommerce.Application.Common.Events
{
    public class ProductCreatedEvent
    {
        public Guid ProductId { get; set; }
        public DateTimeOffset Timestamp { get; set; } = DateTimeOffset.UtcNow;

        public ProductCreatedEvent() { }
        public ProductCreatedEvent(Guid productId)
        {
            ProductId = productId;
        }
    }

    public class ProductUpdatedEvent
    {
        public Guid ProductId { get; set; }
        public DateTimeOffset Timestamp { get; set; } = DateTimeOffset.UtcNow;

        public ProductUpdatedEvent() { }
        public ProductUpdatedEvent(Guid productId)
        {
            ProductId = productId;
        }
    }

    public class ProductDeletedEvent
    {
        public Guid ProductId { get; set; }
        public DateTimeOffset Timestamp { get; set; } = DateTimeOffset.UtcNow;

        public ProductDeletedEvent() { }
        public ProductDeletedEvent(Guid productId)
        {
            ProductId = productId;
        }
    }

    public class ProductPriceChangedEvent
    {
        public Guid ProductId { get; set; }
        public decimal OldPrice { get; set; }
        public decimal NewPrice { get; set; }
        public DateTimeOffset Timestamp { get; set; } = DateTimeOffset.UtcNow;

        public ProductPriceChangedEvent() { }
        public ProductPriceChangedEvent(Guid productId, decimal oldPrice, decimal newPrice)
        {
            ProductId = productId;
            OldPrice = oldPrice;
            NewPrice = newPrice;
        }
    }

    public class ProductStockChangedEvent
    {
        public Guid ProductId { get; set; }
        public int InventoryStock { get; set; }
        public DateTimeOffset Timestamp { get; set; } = DateTimeOffset.UtcNow;

        public ProductStockChangedEvent() { }
        public ProductStockChangedEvent(Guid productId, int inventoryStock)
        {
            ProductId = productId;
            InventoryStock = inventoryStock;
        }
    }
}
