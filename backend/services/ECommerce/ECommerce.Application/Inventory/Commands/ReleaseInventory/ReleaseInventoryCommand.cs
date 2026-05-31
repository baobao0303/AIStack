using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using ECommerce.Application.Common.Interfaces;
using ECommerce.Domain.Entities;
using ECommerce.Application.Common.Events;

namespace ECommerce.Application.Inventory.Commands.ReleaseInventory
{
    public class ReleaseInventoryCommand : IRequest<bool>
    {
        public Guid ProductId { get; set; }
        public int Quantity { get; set; }
    }

    public class ReleaseInventoryCommandHandler : IRequestHandler<ReleaseInventoryCommand, bool>
    {
        private readonly IECommerceDbContext _context;
        private readonly IOutboxService _outbox;

        public ReleaseInventoryCommandHandler(IECommerceDbContext context, IOutboxService outbox)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _outbox = outbox ?? throw new ArgumentNullException(nameof(outbox));
        }

        public async Task<bool> Handle(ReleaseInventoryCommand request, CancellationToken cancellationToken)
        {
            if (request.Quantity <= 0)
                throw new ArgumentException("Quantity to release must be greater than zero.", nameof(request.Quantity));

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
                // Find a pending stock hold matching criteria
                var hold = await _context.StockHolds
                    .FirstOrDefaultAsync(sh => sh.ProductId == request.ProductId && sh.Status == StockHoldStatus.Pending && sh.Quantity == request.Quantity, cancellationToken);

                var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == request.ProductId, cancellationToken);
                
                if (product != null)
                {
                    var quantityToRelease = hold != null ? hold.Quantity : request.Quantity;
                    
                    product.ReleaseStock(quantityToRelease);

                    if (hold != null)
                    {
                        hold.Release();
                    }

                    // Stage stock changed outbox event
                    var stockEvent = new ProductStockChangedEvent(product.Id, product.InventoryStock);
                    await _outbox.StageEventAsync(stockEvent, cancellationToken);

                    await _context.SaveChangesAsync(cancellationToken);

                    if (transaction != null)
                    {
                        await transaction.CommitAsync(cancellationToken);
                    }

                    return true;
                }

                return false;
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
