using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using ECommerce.Application.Common.Interfaces;
using ECommerce.Domain.Entities;
using ECommerce.Application.Common.Events;

namespace ECommerce.Application.Products.Commands
{
    public class CreateProductCommand : IRequest<Guid>
    {
        public string Name { get; set; } = null!;
        public string Description { get; set; } = null!;
        public decimal Price { get; set; }
        public string Category { get; set; } = null!;
        public int InventoryStock { get; set; }
        public string? ImageUrl { get; set; }
        
        public Guid? CategoryId { get; set; }
        public string WoolType { get; set; } = "Milk Cotton";
        public List<string>? Images { get; set; }
        public List<string>? Videos { get; set; }
        public string? ColorsJson { get; set; }
        public List<string>? Tags { get; set; }
        
        public double Width { get; set; }
        public double Height { get; set; }
        public double? Depth { get; set; }
        public double? Weight { get; set; }
    }

    public class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, Guid>
    {
        private readonly IECommerceDbContext _context;
        private readonly IOutboxService _outbox;

        public CreateProductCommandHandler(IECommerceDbContext context, IOutboxService outbox)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _outbox = outbox ?? throw new ArgumentNullException(nameof(outbox));
        }

        public async Task<Guid> Handle(CreateProductCommand request, CancellationToken cancellationToken)
        {
            var product = new Product(
                Guid.NewGuid(),
                request.Name,
                request.Description,
                request.Price,
                request.Category,
                request.InventoryStock,
                request.ImageUrl ?? request.Images?.FirstOrDefault()
            );

            // Update detailed properties and JSON collections
            product.UpdateDetails(
                request.Name,
                request.Description,
                request.Price,
                request.Category,
                request.CategoryId,
                request.WoolType,
                request.Images,
                request.Videos,
                request.ColorsJson,
                request.Tags,
                request.Width,
                request.Height,
                request.Depth,
                request.Weight
            );

            await _context.Products.AddAsync(product, cancellationToken);

            // Stage transaction outbox events
            var createdEvent = new ProductCreatedEvent(product.Id);
            await _outbox.StageEventAsync(createdEvent, cancellationToken);

            var stockEvent = new ProductStockChangedEvent(product.Id, product.InventoryStock);
            await _outbox.StageEventAsync(stockEvent, cancellationToken);

            await _context.SaveChangesAsync(cancellationToken);

            return product.Id;
        }
    }

    public class UpdateProductCommand : IRequest<bool>
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
        public string Description { get; set; } = null!;
        public decimal Price { get; set; }
        public string Category { get; set; } = null!;
        
        public Guid? CategoryId { get; set; }
        public string WoolType { get; set; } = "Milk Cotton";
        public List<string>? Images { get; set; }
        public List<string>? Videos { get; set; }
        public string? ColorsJson { get; set; }
        public List<string>? Tags { get; set; }
        
        public double Width { get; set; }
        public double Height { get; set; }
        public double? Depth { get; set; }
        public double? Weight { get; set; }
    }

    public class UpdateProductCommandHandler : IRequestHandler<UpdateProductCommand, bool>
    {
        private readonly IECommerceDbContext _context;
        private readonly IOutboxService _outbox;

        public UpdateProductCommandHandler(IECommerceDbContext context, IOutboxService outbox)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _outbox = outbox ?? throw new ArgumentNullException(nameof(outbox));
        }

        public async Task<bool> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
        {
            var product = await _context.Products
                .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);

            if (product == null)
            {
                return false;
            }

            var oldPrice = product.Price;

            product.UpdateDetails(
                request.Name,
                request.Description,
                request.Price,
                request.Category,
                request.CategoryId,
                request.WoolType,
                request.Images,
                request.Videos,
                request.ColorsJson,
                request.Tags,
                request.Width,
                request.Height,
                request.Depth,
                request.Weight
            );

            // Stage price changed outbox event if price differs
            if (oldPrice != request.Price)
            {
                var priceChangedEvent = new ProductPriceChangedEvent(product.Id, oldPrice, request.Price);
                await _outbox.StageEventAsync(priceChangedEvent, cancellationToken);
            }

            var updatedEvent = new ProductUpdatedEvent(product.Id);
            await _outbox.StageEventAsync(updatedEvent, cancellationToken);

            await _context.SaveChangesAsync(cancellationToken);

            return true;
        }
    }

    public class DeleteProductCommand : IRequest<bool>
    {
        public Guid Id { get; set; }
    }

    public class DeleteProductCommandHandler : IRequestHandler<DeleteProductCommand, bool>
    {
        private readonly IECommerceDbContext _context;
        private readonly IOutboxService _outbox;

        public DeleteProductCommandHandler(IECommerceDbContext context, IOutboxService outbox)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _outbox = outbox ?? throw new ArgumentNullException(nameof(outbox));
        }

        public async Task<bool> Handle(DeleteProductCommand request, CancellationToken cancellationToken)
        {
            var product = await _context.Products
                .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);

            if (product == null)
            {
                return false;
            }

            // Soft delete by archiving status
            product.Archive();

            var deletedEvent = new ProductDeletedEvent(product.Id);
            await _outbox.StageEventAsync(deletedEvent, cancellationToken);

            await _context.SaveChangesAsync(cancellationToken);

            return true;
        }
    }

    public class PublishProductCommand : IRequest<bool>
    {
        public Guid Id { get; set; }
    }

    public class PublishProductCommandHandler : IRequestHandler<PublishProductCommand, bool>
    {
        private readonly IECommerceDbContext _context;
        private readonly IOutboxService _outbox;

        public PublishProductCommandHandler(IECommerceDbContext context, IOutboxService outbox)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _outbox = outbox ?? throw new ArgumentNullException(nameof(outbox));
        }

        public async Task<bool> Handle(PublishProductCommand request, CancellationToken cancellationToken)
        {
            var product = await _context.Products
                .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);

            if (product == null)
            {
                return false;
            }

            product.Publish();

            var updatedEvent = new ProductUpdatedEvent(product.Id);
            await _outbox.StageEventAsync(updatedEvent, cancellationToken);

            await _context.SaveChangesAsync(cancellationToken);

            return true;
        }
    }

    public class ArchiveProductCommand : IRequest<bool>
    {
        public Guid Id { get; set; }
    }

    public class ArchiveProductCommandHandler : IRequestHandler<ArchiveProductCommand, bool>
    {
        private readonly IECommerceDbContext _context;
        private readonly IOutboxService _outbox;

        public ArchiveProductCommandHandler(IECommerceDbContext context, IOutboxService outbox)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _outbox = outbox ?? throw new ArgumentNullException(nameof(outbox));
        }

        public async Task<bool> Handle(ArchiveProductCommand request, CancellationToken cancellationToken)
        {
            var product = await _context.Products
                .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);

            if (product == null)
            {
                return false;
            }

            product.Archive();

            var updatedEvent = new ProductUpdatedEvent(product.Id);
            await _outbox.StageEventAsync(updatedEvent, cancellationToken);

            await _context.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}
