using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ECommerce.Application.Products.Queries.GetProducts;
using ECommerce.Application.Products.Queries.GetProductBySlug;
using ECommerce.Application.Products.Queries.GetProductSuggestions;
using ECommerce.Application.Products.Commands;

namespace ECommerce.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Route("api/v1/[controller]")]
    public class ProductsController : ApiControllerBase
    {
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<ProductDto>))]
        public async Task<IActionResult> Get([FromQuery] string? category, [FromQuery] decimal? minPrice, [FromQuery] decimal? maxPrice)
        {
            var query = new GetProductsQuery
            {
                Category = category,
                MinPrice = minPrice,
                MaxPrice = maxPrice
            };

            var result = await Mediator.Send(query);
            return Ok(result);
        }

        [HttpGet("{id:guid}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ProductDto))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById(Guid id)
        {
            // Reuses list query with ID filtering or calls get detail
            var query = new GetProductsQuery();
            var products = await Mediator.Send(query);
            var product = products.Find(p => p.Id == id);
            
            if (product == null)
            {
                return NotFound($"Product with ID {id} not found.");
            }

            return Ok(product);
        }

        [HttpGet("slug/{slug}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ProductDto))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetBySlug(string slug)
        {
            var query = new GetProductBySlugQuery { Slug = slug };
            var result = await Mediator.Send(query);
            
            if (result == null)
            {
                return NotFound($"Product with slug '{slug}' not found.");
            }

            return Ok(result);
        }

        [HttpGet("suggestions")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<string>))]
        public async Task<IActionResult> Suggestions([FromQuery(Name = "q")] string q)
        {
            var query = new GetProductSuggestionsQuery { Query = q };
            var result = await Mediator.Send(query);
            return Ok(result);
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Manager")]
        [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(Guid))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> Create([FromBody] CreateProductCommand command)
        {
            var productId = await Mediator.Send(command);
            return CreatedAtAction(nameof(GetById), new { id = productId }, productId);
        }

        [HttpPut("{id:guid}")]
        [Authorize(Roles = "Admin,Manager")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateProductCommand command)
        {
            command.Id = id;
            var result = await Mediator.Send(command);
            
            if (!result)
            {
                return NotFound($"Product with ID {id} not found.");
            }

            return Ok();
        }

        [HttpDelete("{id:guid}")]
        [Authorize(Roles = "Admin,Manager")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(Guid id)
        {
            var command = new DeleteProductCommand { Id = id };
            var result = await Mediator.Send(command);
            
            if (!result)
            {
                return NotFound($"Product with ID {id} not found.");
            }

            return Ok();
        }

        [HttpPatch("{id:guid}/publish")]
        [Authorize(Roles = "Admin,Manager")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Publish(Guid id)
        {
            var command = new PublishProductCommand { Id = id };
            var result = await Mediator.Send(command);
            
            if (!result)
            {
                return NotFound($"Product with ID {id} not found.");
            }

            return Ok();
        }

        [HttpPatch("{id:guid}/archive")]
        [Authorize(Roles = "Admin,Manager")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Archive(Guid id)
        {
            var command = new ArchiveProductCommand { Id = id };
            var result = await Mediator.Send(command);
            
            if (!result)
            {
                return NotFound($"Product with ID {id} not found.");
            }

            return Ok();
        }
    }
}
