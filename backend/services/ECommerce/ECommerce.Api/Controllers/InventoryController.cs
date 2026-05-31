using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ECommerce.Application.Common.Interfaces;
using ECommerce.Application.Inventory.Commands.ReserveInventory;
using ECommerce.Application.Inventory.Commands.ReleaseInventory;

namespace ECommerce.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Route("api/v1/[controller]")]
    public class InventoryController : ApiControllerBase
    {
        private readonly IECommerceDbContext _context;

        public InventoryController(IECommerceDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        [HttpGet("{productId:guid}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Get(Guid productId)
        {
            var product = await _context.Products
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.Id == productId);

            if (product == null)
            {
                return NotFound($"Product inventory with ID {productId} not found.");
            }

            return Ok(new
            {
                inventoryStock = product.InventoryStock,
                reservedStock = product.ReservedStock,
                availableStock = product.AvailableStock
            });
        }

        [HttpPut("{productId:guid}")]
        [Authorize(Roles = "Admin,Manager")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Update(Guid productId, [FromBody] UpdateStockRequest request)
        {
            var product = await _context.Products
                .FirstOrDefaultAsync(p => p.Id == productId);

            if (product == null)
            {
                return NotFound($"Product with ID {productId} not found.");
            }

            if (request.InventoryStock < 0)
            {
                return BadRequest("Inventory stock cannot be negative.");
            }

            var difference = request.InventoryStock - product.InventoryStock;
            if (difference > 0)
            {
                product.IncreaseStock(difference);
            }
            else if (difference < 0)
            {
                product.DecreaseStock(Math.Abs(difference));
            }

            await _context.SaveChangesAsync(default);
            return Ok();
        }

        [HttpPost("reserve")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Reserve([FromBody] ReserveInventoryCommand command)
        {
            try
            {
                var result = await Mediator.Send(command);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("release")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Release([FromBody] ReleaseInventoryCommand command)
        {
            try
            {
                var result = await Mediator.Send(command);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }

    public class UpdateStockRequest
    {
        public int InventoryStock { get; set; }
    }
}
