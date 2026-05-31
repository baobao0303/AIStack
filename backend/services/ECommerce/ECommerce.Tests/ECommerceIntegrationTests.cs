using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Xunit;
using ECommerce.Domain.Entities;
using ECommerce.Application.Products.Queries.GetProducts;
using ECommerce.Application.Orders.Commands.CreateOrder;
using ECommerce.Application.Orders.Commands.CompleteOrder;
using ECommerce.Infrastructure.Persistence;
using ECommerce.Infrastructure.Payments;
using ECommerce.Application.Common.Interfaces;

namespace ECommerce.Tests
{
    public class ECommerceIntegrationTests
    {
        private readonly DbContextOptions<ECommerceDbContext> _dbContextOptions;
        private readonly IConfiguration _configuration;
        private readonly StripePaymentService _stripePaymentService;

        public ECommerceIntegrationTests()
        {
            _dbContextOptions = new DbContextOptionsBuilder<ECommerceDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            var inMemorySettings = new Dictionary<string, string>
            {
                {"Stripe:SecretKey", "sk_test_mock"},
                {"Stripe:WebhookSecret", "whsec_test"}
            };

            _configuration = new ConfigurationBuilder()
                .AddInMemoryCollection(inMemorySettings)
                .Build();

            _stripePaymentService = new StripePaymentService(_configuration);
        }

        private ECommerceDbContext CreateDbContext() => new ECommerceDbContext(_dbContextOptions);

        private async Task SeedCatalogAsync(ECommerceDbContext context)
        {
            var p1 = new Product(Guid.Parse("11111111-1111-1111-1111-111111111111"), "Len Merino", "Description", 100000, "wool", 100);
            var p2 = new Product(Guid.Parse("22222222-2222-2222-2222-222222222222"), "Scarf Handmade", "Description", 300000, "handmade", 50);
            var p3 = new Product(Guid.Parse("33333333-3333-3333-3333-333333333333"), "Wool Velvet", "Description", 50000, "wool", 200);

            await context.Products.AddRangeAsync(p1, p2, p3);
            await context.SaveChangesAsync();
        }

        [Fact]
        public async Task GetProductsQuery_With_Filters_Should_Return_Filtered_Subsets()
        {
            // Arrange
            using var context = CreateDbContext();
            await SeedCatalogAsync(context);

            var handler = new GetProductsQueryHandler(context);

            // Case A: Filter by Category = "wool"
            var queryA = new GetProductsQuery { Category = "wool" };
            var resultA = await handler.Handle(queryA, CancellationToken.None);
            Assert.Equal(2, resultA.Count);
            Assert.Contains(resultA, p => p.Name == "Len Merino");
            Assert.Contains(resultA, p => p.Name == "Wool Velvet");

            // Case B: Filter by Category = "handmade"
            var queryB = new GetProductsQuery { Category = "handmade" };
            var resultB = await handler.Handle(queryB, CancellationToken.None);
            Assert.Single(resultB);
            Assert.Equal("Scarf Handmade", resultB[0].Name);

            // Case C: Filter by MaxPrice = 150000
            var queryC = new GetProductsQuery { MaxPrice = 150000 };
            var resultC = await handler.Handle(queryC, CancellationToken.None);
            Assert.Equal(2, resultC.Count);
            Assert.DoesNotContain(resultC, p => p.Name == "Scarf Handmade");
        }

        [Fact]
        public async Task CreateOrderCommand_With_Valid_Cart_Should_Reserve_Stock_And_Return_Stripe_Session_Url()
        {
            // Arrange
            using var context = CreateDbContext();
            await SeedCatalogAsync(context);

            var handler = new CreateOrderCommandHandler(context, _stripePaymentService);
            var command = new CreateOrderCommand
            {
                BuyerEmail = "buyer@example.com",
                SuccessUrl = "https://example.com/success",
                CancelUrl = "https://example.com/cancel",
                CartItems = new List<CartItemDto>
                {
                    new CartItemDto { ProductId = Guid.Parse("11111111-1111-1111-1111-111111111111"), Quantity = 5 },
                    new CartItemDto { ProductId = Guid.Parse("22222222-2222-2222-2222-222222222222"), Quantity = 2 }
                }
            };

            // Act
            var result = await handler.Handle(command, CancellationToken.None);

            // Assert
            Assert.NotNull(result);
            Assert.NotEmpty(result.StripeCheckoutUrl);
            Assert.StartsWith("https://checkout.stripe.com/pay/", result.StripeCheckoutUrl);

            // Total: (100,000 * 5) + (300,000 * 2) = 1,100,000 VND
            Assert.Equal(1100000, result.TotalAmount);

            // Verify order persisted in database
            var order = await context.Orders
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o => o.Id == result.OrderId);
            
            Assert.NotNull(order);
            Assert.Equal("buyer@example.com", order!.BuyerEmail);
            Assert.Equal(OrderStatus.Pending, order.Status);
            Assert.Equal(2, order.OrderItems.Count);
            Assert.NotEmpty(order.StripeSessionId!);

            // Verify stock reserved/decreased in database
            var product1 = await context.Products.FindAsync(Guid.Parse("11111111-1111-1111-1111-111111111111"));
            var product2 = await context.Products.FindAsync(Guid.Parse("22222222-2222-2222-2222-222222222222"));
            
            Assert.Equal(95, product1!.InventoryStock); // 100 - 5 = 95
            Assert.Equal(48, product2!.InventoryStock); // 50 - 2 = 48
        }

        [Fact]
        public async Task CreateOrderCommand_With_Insufficient_Stock_Should_Throw_InvalidOperationException()
        {
            // Arrange
            using var context = CreateDbContext();
            await SeedCatalogAsync(context);

            var handler = new CreateOrderCommandHandler(context, _stripePaymentService);
            var command = new CreateOrderCommand
            {
                BuyerEmail = "buyer@example.com",
                SuccessUrl = "https://example.com/success",
                CancelUrl = "https://example.com/cancel",
                CartItems = new List<CartItemDto>
                {
                    new CartItemDto { ProductId = Guid.Parse("11111111-1111-1111-1111-111111111111"), Quantity = 105 } // 105 exceeds 100 in stock!
                }
            };

            // Act & Assert
            await Assert.ThrowsAsync<InvalidOperationException>(() => handler.Handle(command, CancellationToken.None));
        }

        [Fact]
        public async Task CompleteOrderCommand_With_Stripe_Session_Webhook_Should_Mark_Order_As_Paid()
        {
            // Arrange
            using var context = CreateDbContext();
            
            var orderId = Guid.NewGuid();
            var stripeSessionId = "cs_test_session_12345";
            var order = new Order(orderId, "buyer@example.com", 500000, stripeSessionId);
            
            await context.Orders.AddAsync(order);
            await context.SaveChangesAsync();

            var handler = new CompleteOrderCommandHandler(context);
            var command = new CompleteOrderCommand { StripeSessionId = stripeSessionId };

            // Act
            var result = await handler.Handle(command, CancellationToken.None);

            // Assert
            Assert.True(result);
            
            var updatedOrder = await context.Orders.FindAsync(orderId);
            Assert.NotNull(updatedOrder);
            Assert.Equal(OrderStatus.Paid, updatedOrder!.Status);
            Assert.Equal(stripeSessionId, updatedOrder.StripeSessionId);
        }

        [Fact]
        public async Task ReserveInventoryCommand_With_Valid_Quantity_Should_Book_Stock_And_Stage_Outbox_And_Hold()
        {
            // Arrange
            using var context = CreateDbContext();
            await SeedCatalogAsync(context);

            var mockOutbox = new MockOutboxService();
            var handler = new Application.Inventory.Commands.ReserveInventory.ReserveInventoryCommandHandler(context, mockOutbox);
            var productId = Guid.Parse("11111111-1111-1111-1111-111111111111");

            var command = new Application.Inventory.Commands.ReserveInventory.ReserveInventoryCommand
            {
                ProductId = productId,
                Quantity = 5
            };

            // Act
            var result = await handler.Handle(command, CancellationToken.None);

            // Assert
            Assert.True(result);

            var product = await context.Products.FindAsync(productId);
            Assert.NotNull(product);
            Assert.Equal(5, product!.ReservedStock);
            Assert.Equal(95, product.AvailableStock);

            // Verify a hold record is registered in db
            var hold = await context.StockHolds.FirstOrDefaultAsync(sh => sh.ProductId == productId);
            Assert.NotNull(hold);
            Assert.Equal(5, hold!.Quantity);
            Assert.Equal(StockHoldStatus.Pending, hold.Status);

            // Verify outbox staged events count
            Assert.Single(mockOutbox.StagedEvents);
        }

        [Fact]
        public async Task ReserveInventoryCommand_With_Insufficient_Stock_Should_Throw_InvalidOperationException()
        {
            // Arrange
            using var context = CreateDbContext();
            await SeedCatalogAsync(context);

            var mockOutbox = new MockOutboxService();
            var handler = new Application.Inventory.Commands.ReserveInventory.ReserveInventoryCommandHandler(context, mockOutbox);
            var productId = Guid.Parse("11111111-1111-1111-1111-111111111111");

            var command = new Application.Inventory.Commands.ReserveInventory.ReserveInventoryCommand
            {
                ProductId = productId,
                Quantity = 105 // exceeds 100 in stock!
            };

            // Act & Assert
            await Assert.ThrowsAsync<InvalidOperationException>(() => handler.Handle(command, CancellationToken.None));
        }

        private class MockOutboxService : IOutboxService
        {
            public List<object> StagedEvents { get; } = new();

            public Task StageEventAsync<T>(T domainEvent, CancellationToken cancellationToken) where T : class
            {
                StagedEvents.Add(domainEvent);
                return Task.CompletedTask;
            }
        }
    }
}
