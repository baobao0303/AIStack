using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using ECommerce.Application.Common.Interfaces;
using ECommerce.Application.Products.Queries.GetProducts;

namespace ECommerce.Application.Products.Queries.GetProductBySlug
{
    public class GetProductBySlugQuery : IRequest<ProductDto?>
    {
        public string Slug { get; set; } = null!;
    }

    public class GetProductBySlugQueryHandler : IRequestHandler<GetProductBySlugQuery, ProductDto?>
    {
        private readonly IECommerceDbContext _context;

        public GetProductBySlugQueryHandler(IECommerceDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<ProductDto?> Handle(GetProductBySlugQuery request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.Slug))
            {
                return null;
            }

            var cleanSlug = request.Slug.ToLowerInvariant().Trim();

            var product = await _context.Products
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.Slug == cleanSlug, cancellationToken);

            if (product == null)
            {
                return null;
            }

            // Map and deserialize JSON properties if populated
            List<string>? imagesList = null;
            if (!string.IsNullOrWhiteSpace(product.ImagesJson))
            {
                try { imagesList = JsonSerializer.Deserialize<List<string>>(product.ImagesJson); } catch { }
            }

            List<ColorDto>? colorsList = null;
            if (!string.IsNullOrWhiteSpace(product.ColorsJson))
            {
                try { colorsList = JsonSerializer.Deserialize<List<ColorDto>>(product.ColorsJson); } catch { }
            }

            return new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                Category = product.Category,
                InventoryStock = product.InventoryStock,
                ImageUrl = product.ImageUrl,
                WoolType = product.WoolType,
                Images = imagesList,
                Colors = colorsList
            };
        }
    }
}
