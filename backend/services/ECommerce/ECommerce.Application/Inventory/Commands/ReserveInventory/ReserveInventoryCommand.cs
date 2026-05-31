using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using ECommerce.Application.Common.Interfaces;
using ECommerce.Domain.Entities;
using ECommerce.Application.Common.Events;

namespace ECommerce.Application.Inventory.Commands.ReserveInventory
{
    public class ReserveInventoryCommand : IRequest<bool>
    {
        public Guid ProductId { get; set; }
        public int Quantity { get; set; }
    }

    public class ReserveInventoryCommandHandler : IRequestHandler<ReserveInventoryCommand, bool>
    {
        private readonly IECommerceDbContext _context;
        private readonly IOutboxService _outbox;

        public ReserveInventoryCommandHandler(IECommerceDbContext context, IOutboxService outbox)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _outbox = outbox ?? throw new ArgumentNullException(nameof(outbox));
        }

        public async Task<bool> Handle(ReserveInventoryCommand request, CancellationToken cancellationToken)
        {
            if (request.Quantity <= 0)
                throw new ArgumentException("Quantity to reserve must be greater than zero.", nameof(request.Quantity));

            var dbContext = _context as DbContext;
            if (dbContext == null)
            {
                throw new InvalidOperationException("DbContext context is null or incompatible.");
            }

            IDbContextTransaction? transaction = null;
            var isInMemory = dbContext.Database.ProviderName == "Microsoft.EntityFrameworkCore.InMemory";

            if (!isInMemory)
            {
                transaction = await dbContext.Database.BeginTransactionAsync(cancellationToken);
            }

            try
            {
                Product? product;

                if (isInMemory)
                {
                    product = await _context.Products
                        .FirstOrDefaultAsync(p => p.Id == request.ProductId, cancellationToken);
                }
                else
                {
                    product = await _context.Products
                        .FromSqlRaw("SELECT * FROM products WHERE \"Id\" = {0} FOR UPDATE", request.ProductId)
                        .FirstOrDefaultAsync(cancellationToken);
                }

                if (product == null)
                {
                    throw new InvalidOperationException($"Product with ID {request.ProductId} not found.");
                }

                // Reserve the inventory stock inside domain entity
                product.ReserveStock(request.Quantity);

                // Create a temporary StockHold with a 15-minute TTL
                var expiryTime = DateTimeOffset.UtcNow.AddMinutes(15);
                var hold = new StockHold(Guid.NewGuid(), product.Id, request.Quantity, expiryTime);
                await _context.StockHolds.AddAsync(hold, cancellationToken);

                // Stage outbox event for external services (Cart, Orders, etc.)
                var stockChangedEvent = new ProductStockChangedEvent(product.Id, product.InventoryStock);
                await _outbox.StageEventAsync(stockChangedEvent, cancellationToken);

                // Atomically persist changes
                await _context.SaveChangesAsync(cancellationToken);

                if (transaction != null)
                {
                    await transaction.CommitAsync(cancellationToken);
                }

                return true;
            }
            catch (Exception)
            {
                if (transaction != null)
                {
                    await transaction.RollbackAsync(cancellationToken);
                }
                throw;
            }
            finally
            {
                if (transaction != null)
                {
                    await transaction.DisposeAsync();
                }
            }
        }
    }
}
