using System;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using ECommerce.Application.Orders.Commands.CreateOrder;
using ECommerce.Application.Orders.Commands.CompleteOrder;
using ECommerce.Application.Common.Interfaces;

namespace ECommerce.Api.Controllers
{
    [ApiController]
    [Route("api/orders")]
    public class OrdersController : ApiControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IStripePaymentService _stripePaymentService;

        public OrdersController(IConfiguration configuration, IStripePaymentService stripePaymentService)
        {
            _configuration = configuration;
            _stripePaymentService = stripePaymentService;
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(CreateOrderResponse))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Create([FromBody] CreateOrderCommand command)
        {
            try
            {
                var result = await Mediator.Send(command);
                return StatusCode(StatusCodes.Status201Created, result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { error = "An error occurred while placing the order.", details = ex.Message });
            }
        }

        [HttpPost("webhook")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> StripeWebhook()
        {
            try
            {
                // 1. Read the raw request body stream
                using var reader = new StreamReader(Request.Body, Encoding.UTF8);
                var jsonPayload = await reader.ReadToEndAsync();

                // 2. Extract Stripe Signature header
                var stripeSignature = Request.Headers["Stripe-Signature"];
                var webhookSecret = _configuration["Stripe:WebhookSecret"] ?? "whsec_test";

                if (string.IsNullOrEmpty(stripeSignature))
                {
                    return BadRequest(new { error = "Missing Stripe-Signature header." });
                }

                // 3. Crytpographically verify the webhook
                var stripeSessionId = await _stripePaymentService.VerifyWebhookAndGetSessionIdAsync(jsonPayload, stripeSignature, webhookSecret);

                if (string.IsNullOrEmpty(stripeSessionId))
                {
                    return BadRequest(new { error = "Invalid signature or unhandled event type." });
                }

                // 4. Complete order payment mapping
                var command = new CompleteOrderCommand { StripeSessionId = stripeSessionId };
                var success = await Mediator.Send(command);

                if (success)
                {
                    return Ok(new { received = true, status = "Order completed successfully." });
                }

                return Ok(new { received = true, status = "Webhook received but order was not pending or not found." });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { error = "Webhook processing failed.", details = ex.Message });
            }
        }
    }
}
