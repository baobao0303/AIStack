using System;
using System.Collections.Generic;
using System.Text.Json;
using Shared.Domain;
using ECommerce.Domain.Enums;

namespace ECommerce.Domain.Entities
{
    public class Product : BaseEntity
    {
        public string Name { get; private set; }
        public string Description { get; private set; }
        public decimal Price { get; private set; }
        public string Category { get; private set; } // e.g. "wool", "handmade"
        public int InventoryStock { get; private set; }
        public string? ImageUrl { get; private set; }

        // Expanded properties matching SPEC_PRODUCT.md
        public string Sku { get; private set; }
        public string Slug { get; private set; }
        public Guid? CategoryId { get; private set; }
        public Category? CategoryRelation { get; private set; } // EF navigation property
        
        public string WoolType { get; private set; }
        public string? ImagesJson { get; private set; } // JSON serialized array of strings
        public string? VideosJson { get; private set; } // JSON serialized array of strings
        public string? ColorsJson { get; private set; } // JSON serialized array of Color objects
        public string? TypesJson { get; private set; }  // JSON serialized array of strings
        
        public double Width { get; private set; }
        public double Height { get; private set; }
        public double? Depth { get; private set; }
        public double? Weight { get; private set; }
        public string? TagsJson { get; private set; }   // JSON serialized array of strings

        public double Rating { get; private set; }
        public int ReviewCount { get; private set; }
        public ProductStatus Status { get; private set; }
        
        // Stock Reservation Booking for Concurrency Safety
        public int ReservedStock { get; private set; }
        public int AvailableStock => InventoryStock - ReservedStock;

        private Product()
        {
            Name = null!;
            Description = null!;
            Category = null!;
            Sku = null!;
            Slug = null!;
            WoolType = "Milk Cotton";
            Status = ProductStatus.Draft;
        } // Required for EF Core

        public Product(
            Guid id, 
            string name, 
            string description, 
            decimal price, 
            string category, 
            int inventoryStock, 
            string? imageUrl = null) : base(id)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Product name cannot be empty.", nameof(name));
            if (price < 0)
                throw new ArgumentException("Product price cannot be negative.", nameof(price));
            if (inventoryStock < 0)
                throw new ArgumentException("Product inventory stock cannot be negative.", nameof(inventoryStock));

            Name = name.Trim();
            Description = description.Trim();
            Price = price;
            Category = category.ToLowerInvariant().Trim();
            InventoryStock = inventoryStock;
            ImageUrl = imageUrl;

            // Sensible defaults to preserve backward compatibility with existing tests/seeds
            Sku = $"SKU-{Name.Replace(" ", "").ToUpper()}-{Id.ToString()[..4]}";
            Slug = Name.ToLowerInvariant().Replace(" ", "-").Replace("á", "a").Replace("à", "a").Replace("ạ", "a").Replace("ỏ", "o").Replace("ó", "o");
            WoolType = "Milk Cotton";
            Status = inventoryStock > 0 ? ProductStatus.Active : ProductStatus.OutOfStock;
            ReservedStock = 0;
            Rating = 5.0;
            ReviewCount = 1;
            Width = 10;
            Height = 10;
        }

        // Domain method for updating product details
        public void UpdateDetails(
            string name, 
            string description, 
            decimal price, 
            string category, 
            Guid? categoryId,
            string woolType,
            List<string>? images,
            List<string>? videos,
            string? colorsJson,
            List<string>? tags,
            double width,
            double height,
            double? depth,
            double? weight)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Product name cannot be empty.", nameof(name));
            if (price < 0)
                throw new ArgumentException("Product price cannot be negative.", nameof(price));

            Name = name.Trim();
            Description = description.Trim();
            Price = price;
            Category = category.ToLowerInvariant().Trim();
            CategoryId = categoryId;
            WoolType = woolType.Trim();
            
            ImagesJson = images != null ? JsonSerializer.Serialize(images) : null;
            VideosJson = videos != null ? JsonSerializer.Serialize(videos) : null;
            ColorsJson = colorsJson;
            TagsJson = tags != null ? JsonSerializer.Serialize(tags) : null;
            
            Width = width;
            Height = height;
            Depth = depth;
            Weight = weight;
        }

        // Domain method to publish product
        public void Publish()
        {
            Status = ProductStatus.Active;
        }

        // Domain method to archive product
        public void Archive()
        {
            Status = ProductStatus.Archived;
        }

        // Concurrency Stock Reservation method (Pessimistic Locking helper)
        public void ReserveStock(int quantity)
        {
            if (quantity <= 0)
                throw new ArgumentException("Quantity to reserve must be greater than zero.", nameof(quantity));

            if (AvailableStock < quantity)
                throw new InvalidOperationException($"Insufficient stock available. Requested: {quantity}, Available: {AvailableStock}");

            ReservedStock += quantity;
        }

        // Restores reserved stock (cancelling a hold)
        public void ReleaseStock(int quantity)
        {
            if (quantity <= 0)
                throw new ArgumentException("Quantity to release must be greater than zero.", nameof(quantity));

            if (ReservedStock - quantity < 0)
                throw new InvalidOperationException($"Cannot release more stock than currently reserved. Reserved: {ReservedStock}, Requested release: {quantity}");

            ReservedStock -= quantity;
        }

        // Confirms a purchase: transition from Reserved stock directly into decreased total stock
        public void ConfirmStock(int quantity)
        {
            if (quantity <= 0)
                throw new ArgumentException("Quantity to confirm must be greater than zero.", nameof(quantity));

            if (ReservedStock - quantity < 0)
                throw new InvalidOperationException($"Cannot confirm more stock than currently reserved. Reserved: {ReservedStock}, Requested confirm: {quantity}");

            if (InventoryStock - quantity < 0)
                throw new InvalidOperationException($"Insufficient inventory stock. Total: {InventoryStock}, Requested: {quantity}");

            ReservedStock -= quantity;
            InventoryStock -= quantity;

            if (InventoryStock == 0)
            {
                Status = ProductStatus.OutOfStock;
            }
        }

        public void DecreaseStock(int quantity)
        {
            if (quantity < 0)
                throw new ArgumentException("Quantity to decrease must be positive.", nameof(quantity));
            if (InventoryStock - quantity < 0)
                throw new InvalidOperationException($"Insufficient inventory stock for product '{Name}'. Available: {InventoryStock}, requested: {quantity}");

            InventoryStock -= quantity;

            if (InventoryStock == 0)
            {
                Status = ProductStatus.OutOfStock;
            }
        }

        public void IncreaseStock(int quantity)
        {
            if (quantity < 0)
                throw new ArgumentException("Quantity to increase must be positive.", nameof(quantity));

            InventoryStock += quantity;

            if (InventoryStock > 0 && Status == ProductStatus.OutOfStock)
            {
                Status = ProductStatus.Active;
            }
        }

        // Aggregate review rating updates
        public void AddReview(int rating)
        {
            if (rating < 1 || rating > 5)
                throw new ArgumentException("Rating must be between 1 and 5.", nameof(rating));

            double totalRatingScore = (Rating * ReviewCount) + rating;
            ReviewCount++;
            Rating = Math.Round(totalRatingScore / ReviewCount, 1);
        }
    }
}
