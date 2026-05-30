using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Identity.Application.Authentication.Commands.RegisterTenant;
using Identity.Application.Authentication.Queries.Login;
using Identity.Application.Authentication.Commands.RefreshToken;
using Identity.Application.Authentication.Commands.Logout;
using Identity.Application.Authentication.Queries.GetMe;

namespace Identity.Api.Controllers
{
    [ApiController]
    [Route("api/auth")]
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
                return StatusCode(StatusCodes.Status201Created, result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
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
                SetRefreshTokenCookie(result.RefreshToken);
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
                return StatusCode(StatusCodes.Status401Unauthorized, new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { error = "An internal server error occurred.", details = ex.Message });
            }
        }

        [HttpPost("refresh-token")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest? requestBody)
        {
            try
            {
                // Read from cookie first, fall back to JSON body
                var token = Request.Cookies["refreshToken"] ?? requestBody?.RefreshToken;

                if (string.IsNullOrWhiteSpace(token))
                {
                    return StatusCode(StatusCodes.Status401Unauthorized, new { error = "Refresh token is required." });
                }

                var command = new RefreshTokenCommand { RefreshToken = token };
                var result = await Mediator.Send(command);

                SetRefreshTokenCookie(result.RefreshToken);

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
                return StatusCode(StatusCodes.Status401Unauthorized, new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { error = "An internal server error occurred.", details = ex.Message });
            }
        }

        [HttpPost("logout")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> Logout([FromBody] RefreshTokenRequest? requestBody)
        {
            try
            {
                // Read from cookie first, fall back to JSON body
                var token = Request.Cookies["refreshToken"] ?? requestBody?.RefreshToken;

                if (!string.IsNullOrWhiteSpace(token))
                {
                    var command = new LogoutCommand { RefreshToken = token };
                    await Mediator.Send(command);
                }

                // Clear Cookie in all cases
                Response.Cookies.Delete("refreshToken", new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.Strict,
                    Path = "/api/auth"
                });

                return Ok(new { message = "Logged out successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { error = "An internal server error occurred.", details = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("me")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(GetMeResponse))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> Me()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                                  ?? User.FindFirst("sub")?.Value;

                if (string.IsNullOrEmpty(userIdClaim))
                {
                    return StatusCode(StatusCodes.Status401Unauthorized, new { error = "Unauthorized." });
                }

                var query = new GetMeQuery { UserId = Guid.Parse(userIdClaim) };
                var result = await Mediator.Send(query);

                return Ok(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(StatusCodes.Status401Unauthorized, new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { error = "An internal server error occurred.", details = ex.Message });
            }
        }

        private void SetRefreshTokenCookie(string token)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Path = "/api/auth",
                MaxAge = TimeSpan.FromDays(7)
            };
            Response.Cookies.Append("refreshToken", token, cookieOptions);
        }
    }

    public class RefreshTokenRequest
    {
        public string? RefreshToken { get; set; }
    }
}
