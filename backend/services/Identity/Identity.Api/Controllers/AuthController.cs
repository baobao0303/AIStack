using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Identity.Application.Authentication.Commands.RegisterTenant;

namespace Identity.Api.Controllers
{
    [ApiController]
    [Route("api/v1/auth")]
    public class AuthController : ApiControllerBase
    {
        [HttpPost("register")]
        [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(RegisterTenantResponse))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Register([FromBody] RegisterTenantCommand command)
        {
            try
            {
                var result = await Mediator.Send(command);
                
                // Return 201 Created
                return StatusCode(StatusCodes.Status201Created, result);
            }
            catch (InvalidOperationException ex)
            {
                // Returns 400 Bad Request on business validation failure (duplicate domains/emails)
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                // General error handler
                return StatusCode(StatusCodes.Status500InternalServerError, new { error = "An internal server error occurred.", details = ex.Message });
            }
        }
    }
}
