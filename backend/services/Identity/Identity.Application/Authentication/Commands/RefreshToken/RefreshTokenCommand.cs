using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Identity.Application.Common.Interfaces;
using Identity.Domain.Entities;

namespace Identity.Application.Authentication.Commands.RefreshToken
{
    public class RefreshTokenCommand : IRequest<RefreshTokenResponse>
    {
        public string RefreshToken { get; set; } = null!;
    }

    public class RefreshTokenResponse
    {
        public string AccessToken { get; set; } = null!;
        public string RefreshToken { get; set; } = null!;
        public int ExpiresIn => 900;
        public Guid UserId { get; set; }
        public string Email { get; set; } = null!;
    }

    public class RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand, RefreshTokenResponse>
    {
        private readonly IIdentityDbContext _context;
        private readonly ITokenService _tokenService;
        private readonly IConfiguration _configuration;

        public RefreshTokenCommandHandler(
            IIdentityDbContext context,
            ITokenService tokenService,
            IConfiguration configuration)
        {
            _context = context;
            _tokenService = tokenService;
            _configuration = configuration;
        }

        public async Task<RefreshTokenResponse> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.RefreshToken))
            {
                throw new UnauthorizedAccessException("Refresh token is required.");
            }

            // 1. Parse and Validate JWT Refresh Token Cryptographically
            string userIdString;
            string jti;

            try
            {
                var secretKey = _configuration["Jwt:Secret"] ?? "ThisIsASuperSecretKeyForSigningJWTTokens1234567890!";
                var issuer = _configuration["Jwt:Issuer"] ?? "Identity.Api";
                var audience = _configuration["Jwt:Audience"] ?? "CRMPortal";

                var tokenHandler = new JwtSecurityTokenHandler();
                var validationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = issuer,
                    ValidAudience = audience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
                    ClockSkew = TimeSpan.Zero // Reject immediately if expired
                };

                var principal = tokenHandler.ValidateToken(request.RefreshToken, validationParameters, out var validatedToken);
                
                userIdString = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                               ?? principal.FindFirst(JwtRegisteredClaimNames.Sub)?.Value!;
                
                jti = principal.FindFirst(JwtRegisteredClaimNames.Jti)?.Value!;

                if (string.IsNullOrEmpty(userIdString) || string.IsNullOrEmpty(jti))
                {
                    throw new UnauthorizedAccessException("Invalid refresh token claims.");
                }
            }
            catch (Exception ex)
            {
                throw new UnauthorizedAccessException("Invalid or expired refresh token.", ex);
            }

            var userId = Guid.Parse(userIdString);

            // 2. Hash raw Refresh Token and query database
            var incomingHash = ComputeSha256Hash(request.RefreshToken);
            var dbToken = await _context.RefreshTokens
                .FirstOrDefaultAsync(rt => rt.TokenHash == incomingHash && rt.UserId == userId, cancellationToken);

            if (dbToken == null || dbToken.IsRevoked || dbToken.ExpiresAt < DateTimeOffset.UtcNow)
            {
                throw new UnauthorizedAccessException("Refresh token is invalid, expired, or has been revoked.");
            }

            // 3. Retrieve User and Roles
            var user = await _context.Users.FindAsync(new object[] { userId }, cancellationToken);
            if (user == null)
            {
                throw new UnauthorizedAccessException("User associated with this refresh token does not exist.");
            }

            var roles = await (from ur in _context.UserRoles
                               join r in _context.Roles on ur.RoleId equals r.Id
                               where ur.UserId == user.Id
                               select r.Name).ToArrayAsync(cancellationToken);

            // 4. Revoke Old Token in database (Token Rotation)
            dbToken.Revoke(DateTimeOffset.UtcNow);

            // 5. Generate New Tokens
            var newJti = Guid.NewGuid().ToString();
            var newAccessToken = _tokenService.GenerateAccessToken(user, roles);
            var newRefreshToken = _tokenService.GenerateRefreshToken(user, newJti);

            // 6. Save new hashed Refresh Token in database
            var newHash = ComputeSha256Hash(newRefreshToken);
            var newDbToken = new Identity.Domain.Entities.RefreshToken(
                Guid.NewGuid(),
                user.Id,
                newHash,
                newJti,
                DateTimeOffset.UtcNow,
                DateTimeOffset.UtcNow.AddDays(7)
            );

            await _context.RefreshTokens.AddAsync(newDbToken, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            return new RefreshTokenResponse
            {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken,
                UserId = user.Id,
                Email = user.Email
            };
        }

        private static string ComputeSha256Hash(string rawData)
        {
            using var sha256Hash = SHA256.Create();
            byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(rawData));
            var builder = new StringBuilder();
            for (int i = 0; i < bytes.Length; i++)
            {
                builder.Append(bytes[i].ToString("x2"));
            }
            return builder.ToString();
        }
    }
}
