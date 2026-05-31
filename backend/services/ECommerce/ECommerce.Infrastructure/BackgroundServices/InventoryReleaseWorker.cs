using System;
using System.Linq;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using ECommerce.Application.Common.Interfaces;
using ECommerce.Domain.Entities;
using ECommerce.Application.Common.Events;

namespace ECommerce.Infrastructure.BackgroundServices
{
    public class InventoryReleaseWorker : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<InventoryReleaseWorker> _logger;

        public InventoryReleaseWorker(IServiceScopeFactory scopeFactory, ILogger<InventoryReleaseWorker> logger)
        {
            _scopeFactory = scopeFactory ?? throw new ArgumentNullException(nameof(scopeFactory));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("InventoryReleaseWorker background service has started.");

            // Sweeps every 1 minute
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await ReleaseExpiredStockHoldsAsync(stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred while sweeping for expired stock holds.");
                }

                await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
            }

            _logger.LogInformation("InventoryReleaseWorker background service has stopped.");
        }

        private async Task ReleaseExpiredStockHoldsAsync(CancellationToken stoppingToken)
        {
            using var scope = _scopeFactory.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<IECommerceDbContext>();
            var outbox = scope.ServiceProvider.GetService<IOutboxService>();

            var now = DateTimeOffset.UtcNow;

            // Fetch expired holds that are still pending
            var expiredHolds = await db.StockHolds
                .Where(sh => sh.Status == StockHoldStatus.Pending && now >= sh.ExpiryTime)
                .ToListAsync(stoppingToken);

            if (!expiredHolds.Any())
            {
                return;
            }

            _logger.LogInformation("Found {Count} expired stock holds to release.", expiredHolds.Count);

            foreach (var hold in expiredHolds)
            {
                try
                {
                    // Find the corresponding product
                    var product = await db.Products
                        .FirstOrDefaultAsync(p => p.Id == hold.ProductId, stoppingToken);

                    if (product != null)
                    {
                        // Release stock booking pool
                        product.ReleaseStock(hold.Quantity);
                        
                        // Stage OutboxEvent for RabbitMQ stock changes
                        if (outbox != null)
                        {
                            var stockEvent = new ProductStockChangedEvent(product.Id, product.InventoryStock);
                            await outbox.StageEventAsync(stockEvent, stoppingToken);
                        }

                        _logger.LogInformation("Released {Quantity} reserved stock for product '{Name}' (ID {ProductId}) due to expired hold {HoldId}.", 
                            hold.Quantity, product.Name, product.Id, hold.Id);
                    }
                    else
                    {
                        _logger.LogWarning("Product with ID {ProductId} not found for expired hold {HoldId}.", hold.ProductId, hold.Id);
                    }

                    // Transition hold state to Released
                    hold.Release();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to release stock hold with ID {HoldId}.", hold.Id);
                }
            }

            // Atomically save all stock updates and outbox events
            await db.SaveChangesAsync(stoppingToken);
        }
    }
}
