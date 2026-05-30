using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Identity.Application.Authentication.Commands.RegisterTenant;
using Identity.Application.Authentication.Queries.Login;

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

        [HttpPost("login")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Login([FromBody] LoginCommand command)
        {
            try
            {
                var result = await Mediator.Send(command);
                
                // Write Refresh Token into HttpOnly secure cookie
                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.Strict,
                    Path = "/api/v1/auth",
                    MaxAge = TimeSpan.FromDays(7)
                };
                
                Response.Cookies.Append("refreshToken", result.RefreshToken, cookieOptions);
                
                // Return 200 OK with Access Token and user info in response body
                return Ok(new
                {
                    accessToken = result.AccessToken,
                    expiresIn = result.ExpiresIn,
                    userId = result.UserId,
                    email = result.Email
                });
            }
            catch (UnauthorizedAccessException ex)
            {
                // Return 401 Unauthorized on authentication failure
                return StatusCode(StatusCodes.Status401Unauthorized, new { error = ex.Message });
            }
            catch (Exception ex)
            {
                // General error handler
                return StatusCode(StatusCodes.Status500InternalServerError, new { error = "An internal server error occurred.", details = ex.Message });
            }
        }
    }
}
