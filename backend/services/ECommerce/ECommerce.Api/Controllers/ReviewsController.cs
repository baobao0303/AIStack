using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ECommerce.Application.Reviews;

namespace ECommerce.Api.Controllers
{
    [ApiController]
    public class ReviewsController : ApiControllerBase
    {
        [HttpGet("api/products/{productId:guid}/reviews")]
        [HttpGet("api/v1/products/{productId:guid}/reviews")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<ReviewDto>))]
        public async Task<IActionResult> GetByProduct(Guid productId)
        {
            var query = new GetProductReviewsQuery { ProductId = productId };
            var result = await Mediator.Send(query);
            return Ok(result);
        }

        [HttpPost("api/products/{productId:guid}/reviews")]
        [HttpPost("api/v1/products/{productId:guid}/reviews")]
        [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(Guid))]
        public async Task<IActionResult> Create(Guid productId, [FromBody] CreateReviewRequest request)
        {
            var command = new CreateReviewCommand
            {
                ProductId = productId,
                Rating = request.Rating,
                Comment = request.Comment
            };

            var reviewId = await Mediator.Send(command);
            return CreatedAtAction(nameof(GetByProduct), new { productId = productId }, reviewId);
        }
    }

    public class CreateReviewRequest
    {
        public int Rating { get; set; }
        public string Comment { get; set; } = null!;
    }
}
