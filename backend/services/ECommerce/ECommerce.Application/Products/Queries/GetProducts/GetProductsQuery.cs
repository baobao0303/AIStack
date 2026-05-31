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

    public class ColorDto
    {
        public string Name { get; set; } = null!;
        public string Hex { get; set; } = null!;
        public string? ImageUrl { get; set; }
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
        public string WoolType { get; set; } = "Milk Cotton";
        public List<string>? Images { get; set; }
        public List<ColorDto>? Colors { get; set; }
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

            return products.Select(p => {
                var woolType = "Milk Cotton";
                List<string>? images = null;
                List<ColorDto>? colors = null;

                var name = p.Name.ToLowerInvariant();
                if (name.Contains("gấu bông len dệt")) {
                    woolType = "Merino Wool";
                }
                else if (name.Contains("áo khoác merino")) {
                    woolType = "Merino Wool";
                }
                else if (name.Contains("khăn choàng mùa đông")) {
                    woolType = "Organic Cotton";
                }
                else if (name.Contains("cozy alpaca beanie")) {
                    woolType = "Alpaca Wool";
                }
                else if (name.Contains("merino knit cardigan")) {
                    woolType = "Merino Wool";
                }
                else if (name.Contains("octopus") || name.Contains("bạch tuộc")) {
                    woolType = "Organic Cotton";
                }
                else if (name.Contains("cờ việt nam mix hoa")) {
                    woolType = "Organic Cotton";
                    images = new List<string> { "/vietnam_strap.png", "/vietnam_strap_pink.png", "/vietnam_strap_blue.png", "/vietnam_strap_both.png" };
                    colors = new List<ColorDto> {
                        new ColorDto { Name = "Hồng", Hex = "#ECBAC1", ImageUrl = "/vietnam_strap_pink.png" },
                        new ColorDto { Name = "Xanh biển", Hex = "#84A9C0", ImageUrl = "/vietnam_strap_blue.png" },
                        new ColorDto { Name = "Hồng + Xanh", Hex = "#C4D3E6", ImageUrl = "/vietnam_strap_both.png" }
                    };
                }
                else if (name.Contains("cỏ 4 lá")) {
                    woolType = "Organic Cotton";
                    images = new List<string> { "/clover_strap.png", "/clover_strap_pink.png", "/clover_strap_green.png" };
                    colors = new List<ColorDto> {
                        new ColorDto { Name = "2 Hồng", Hex = "#ECBAC1", ImageUrl = "/clover_strap_pink.png" },
                        new ColorDto { Name = "2 Xanh lá", Hex = "#8DAA91", ImageUrl = "/clover_strap_green.png" }
                    };
                }
                else if (name.Contains("móc khóa cờ việt nam")) {
                    woolType = "Milk Cotton";
                    images = new List<string> { "/vn_keychain.png", "/vn_keychain_2.png", "/vn_keychain_3.png" };
                    colors = new List<ColorDto> {
                        new ColorDto { Name = "2 Lá cờ", Hex = "#E05A47", ImageUrl = "/vn_keychain.png" },
                        new ColorDto { Name = "2 Huy hiệu cài áo", Hex = "#D4AF37", ImageUrl = "/vn_keychain_2.png" },
                        new ColorDto { Name = "2 Kẹp tóc", Hex = "#E08585", ImageUrl = "/vn_keychain_3.png" },
                        new ColorDto { Name = "Lá cờ + kẹp tóc", Hex = "#DF907B", ImageUrl = "/vn_keychain.png" },
                        new ColorDto { Name = "Lá cờ + huy hiệu", Hex = "#E0AA5E", ImageUrl = "/vn_keychain_2.png" },
                        new ColorDto { Name = "Huy hiệu + kẹp tóc", Hex = "#D6BC67", ImageUrl = "/vn_keychain_3.png" }
                    };
                }
                else if (name.Contains("vòng tay mix hoa")) {
                    woolType = "Organic Cotton";
                    images = new List<string> { "/flower_bracelet.png", "/flower_bracelet_green.png", "/flower_bracelet_pink.png", "/flower_bracelet_blue.png" };
                    colors = new List<ColorDto> {
                        new ColorDto { Name = "Xanh lá", Hex = "#8DAA91", ImageUrl = "/flower_bracelet_green.png" },
                        new ColorDto { Name = "Hồng", Hex = "#ECBAC1", ImageUrl = "/flower_bracelet_pink.png" },
                        new ColorDto { Name = "Xanh dương", Hex = "#84A9C0", ImageUrl = "/flower_bracelet_blue.png" }
                    };
                }
                else if (name.Contains("calcifer")) {
                    woolType = "Milk Cotton";
                    images = new List<string> { "/calcifer_keychain.png", "/calcifer_keychain_blue.png", "/calcifer_keychain_red.png", "/calcifer_keychain_both.png" };
                    colors = new List<ColorDto> {
                        new ColorDto { Name = "Lửa xanh", Hex = "#84A9C0", ImageUrl = "/calcifer_keychain_blue.png" },
                        new ColorDto { Name = "Lửa đỏ", Hex = "#E05A47", ImageUrl = "/calcifer_keychain_red.png" },
                        new ColorDto { Name = "Cả đôi", Hex = "#DDA7A5", ImageUrl = "/calcifer_keychain_both.png" }
                    };
                }
                else if (name.Contains("judy")) {
                    woolType = "Milk Cotton";
                    colors = new List<ColorDto> {
                        new ColorDto { Name = "Thỏ Judy", Hex = "#FAF9F6" },
                        new ColorDto { Name = "Cáo Nick", Hex = "#E29A67" },
                        new ColorDto { Name = "Thỏ và Cáo", Hex = "#C9B6A6" }
                    };
                }
                else if (name.Contains("doraemon")) {
                    woolType = "Chenille Velvet";
                    colors = new List<ColorDto> {
                        new ColorDto { Name = "Doraemon", Hex = "#5A9FD4" },
                        new ColorDto { Name = "Dorami", Hex = "#FBEA7A" }
                    };
                }
                else if (name.Contains("ma halloween")) {
                    woolType = "Milk Cotton";
                    colors = new List<ColorDto> {
                        new ColorDto { Name = "Ma bí đỏ", Hex = "#FAF9F6" },
                        new ColorDto { Name = "Ma mắt mèo", Hex = "#000000" },
                        new ColorDto { Name = "Ma nhện", Hex = "#8C6CA6" }
                    };
                }
                else if (name.Contains("charm xanh lá")) {
                    woolType = "Organic Cotton";
                    images = new List<string> { "/charm_bracelet_green.png" };
                    colors = new List<ColorDto> {
                        new ColorDto { Name = "Xanh lá", Hex = "#8DAA91", ImageUrl = "/charm_bracelet_green.png" }
                    };
                }
                else if (name.Contains("nhung gấu")) {
                    woolType = "Chenille Velvet";
                    images = new List<string> { "/mini_plush_keychain.png" };
                    colors = new List<ColorDto> {
                        new ColorDto { Name = "Gấu Pooh", Hex = "#EAA035" },
                        new ColorDto { Name = "Cinnamoroll", Hex = "#9BB7D4" },
                        new ColorDto { Name = "Hello kitty", Hex = "#ECBAC1" },
                        new ColorDto { Name = "Doraemon", Hex = "#5A9FD4" },
                        new ColorDto { Name = "Doraemi", Hex = "#FBEA7A" },
                        new ColorDto { Name = "Chim cánh cụt", Hex = "#A7B3A3" },
                        new ColorDto { Name = "Koala", Hex = "#96A19C" },
                        new ColorDto { Name = "Cún Pocha", Hex = "#EAE7DF" },
                        new ColorDto { Name = "Thỏ Judy", Hex = "#CDC9C9" },
                        new ColorDto { Name = "Cáo Nick", Hex = "#E29A67" },
                        new ColorDto { Name = "Gấu trúc", Hex = "#4A4A4A" },
                        new ColorDto { Name = "Cá hề", Hex = "#DF733F" },
                        new ColorDto { Name = "Kuromi", Hex = "#705470" },
                        new ColorDto { Name = "Thỏ", Hex = "#FAF9F6" },
                        new ColorDto { Name = "Vịt Donal", Hex = "#C9D3E6" }
                    };
                }
                else if (name.Contains("18 bông")) {
                    woolType = "Milk Cotton";
                    images = new List<string> { "/bouquet_18_flowers.png" };
                    colors = new List<ColorDto> {
                        new ColorDto { Name = "Đen hoa đỏ", Hex = "#A32E30" },
                        new ColorDto { Name = "Xanh hoa hồng", Hex = "#85A2B5" },
                        new ColorDto { Name = "Xanh pastel hoa mix", Hex = "#B1C9CD" },
                        new ColorDto { Name = "Be hoa đỏ", Hex = "#D9C3B0" },
                        new ColorDto { Name = "Xanh hoa hồng xanh", Hex = "#6C8B9E" },
                        new ColorDto { Name = "Hồng mix 2 màu hoa", Hex = "#DF8B9B" },
                        new ColorDto { Name = "Xanh pastel hoa đỏ", Hex = "#AECBC7" },
                        new ColorDto { Name = "Mix pastel + mint", Hex = "#BED4BE" }
                    };
                }
                else if (name.Contains("choàng cổ")) {
                    woolType = "Merino Wool";
                    images = new List<string> { "/merino_scarf.png" };
                    colors = new List<ColorDto> {
                        new ColorDto { Name = "Trắng xám", Hex = "#EAE8E4" },
                        new ColorDto { Name = "Đen", Hex = "#1A1C1A" },
                        new ColorDto { Name = "Đỏ Đô", Hex = "#8B1E2B" },
                        new ColorDto { Name = "Trắng kem", Hex = "#FAF9F6" },
                        new ColorDto { Name = "Ghi Đậm", Hex = "#5A5C5A" },
                        new ColorDto { Name = "Xám nhạt", Hex = "#B5B7B5" }
                    };
                }
                else if (name.Contains("cờ tổ quốc")) {
                    woolType = "Organic Cotton";
                    images = new List<string> { "/vietnam_flower_strap.png" };
                    colors = new List<ColorDto> {
                        new ColorDto { Name = "Hồng", Hex = "#ECBAC1" },
                        new ColorDto { Name = "Xanh biển", Hex = "#84A9C0" },
                        new ColorDto { Name = "Xanh lá", Hex = "#8DAA91" },
                        new ColorDto { Name = "Vàng", Hex = "#F3D078" },
                        new ColorDto { Name = "Đỏ", Hex = "#E05A47" }
                    };
                }

                return new ProductDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Price = p.Price,
                    Category = p.Category,
                    InventoryStock = p.InventoryStock,
                    ImageUrl = p.ImageUrl,
                    WoolType = woolType,
                    Images = images,
                    Colors = colors
                };
            }).ToList();
        }
    }
}
