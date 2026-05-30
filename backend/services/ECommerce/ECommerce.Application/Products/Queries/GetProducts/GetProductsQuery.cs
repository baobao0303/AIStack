using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using ECommerce.Application.Common.Interfaces;

namespace ECommerce.Application.Products.Queries.GetProducts
{
    public class GetProductsQuery : IRequest<List<ProductDto>>
    {
        public string? Category { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
    }

    public class ProductDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
        public string Description { get; set; } = null!;
        public decimal Price { get; set; }
        public string Category { get; set; } = null!;
        public int InventoryStock { get; set; }
        public string? ImageUrl { get; set; }
    }

    public class GetProductsQueryHandler : IRequestHandler<GetProductsQuery, List<ProductDto>>
    {
        private readonly IECommerceDbContext _context;

        public GetProductsQueryHandler(IECommerceDbContext context)
        {
            _context = context;
        }

        public async Task<List<ProductDto>> Handle(GetProductsQuery request, CancellationToken cancellationToken)
        {
            var query = _context.Products.AsNoTracking();

            // 1. Filter by Category (case-insensitive)
            if (!string.IsNullOrWhiteSpace(request.Category))
            {
                var categoryLower = request.Category.ToLowerInvariant().Trim();
                query = query.Where(p => p.Category == categoryLower);
            }

            // 2. Filter by MinPrice
            if (request.MinPrice.HasValue)
            {
                query = query.Where(p => p.Price >= request.MinPrice.Value);
            }

            // 3. Filter by MaxPrice
            if (request.MaxPrice.HasValue)
            {
                query = query.Where(p => p.Price <= request.MaxPrice.Value);
            }

            var products = await query.ToListAsync(cancellationToken);

            return products.Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Price = p.Price,
                Category = p.Category,
                InventoryStock = p.InventoryStock,
                ImageUrl = p.ImageUrl
            }).ToList();
        }
    }
}
