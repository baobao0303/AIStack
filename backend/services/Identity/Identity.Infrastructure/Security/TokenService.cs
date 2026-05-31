using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Identity.Domain.Entities;
using Identity.Application.Common.Interfaces;

namespace Identity.Infrastructure.Security
{
    public class TokenService : ITokenService
    {
        private readonly IConfiguration _configuration;
        private readonly IHostEnvironment? _hostEnvironment;

        public TokenService(IConfiguration configuration, IHostEnvironment? hostEnvironment = null)
        {
            _configuration = configuration;
            _hostEnvironment = hostEnvironment;
        }

        private string GetSecretKey()
        {
            var secretKey = _configuration["Jwt:Secret"];
            if (string.IsNullOrEmpty(secretKey))
            {
                if (_hostEnvironment != null && _hostEnvironment.IsProduction())
                {
                    throw new InvalidOperationException("Critical security error: JWT Secret is not configured in production environment!");
                }
                secretKey = "ThisIsASuperSecretKeyForSigningJWTTokens1234567890!";
            }
            return secretKey;
        }

        public string GenerateAccessToken(User user, string[] roles)
        {
            var secretKey = GetSecretKey();
            var issuer = _configuration["Jwt:Issuer"] ?? "Identity.Api";
            var audience = _configuration["Jwt:Audience"] ?? "CRMPortal";

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim("tenant_id", user.TenantId.ToString())
            };

            // Add role claims
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(15), // Access Token expires in 15 minutes
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public string GenerateRefreshToken(User user, string jti, DateTimeOffset absoluteExpiry)
        {
            var secretKey = GetSecretKey();
            var issuer = _configuration["Jwt:Issuer"] ?? "Identity.Api";
            var audience = _configuration["Jwt:Audience"] ?? "CRMPortal";

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, jti),
                new Claim("absolute_exp", absoluteExpiry.ToUnixTimeSeconds().ToString())
            };

            // Sliding expiration is 7 days from now, but capped by absolute maximum lifetime
            var slidingExpiry = DateTime.UtcNow.AddDays(7);
            if (slidingExpiry > absoluteExpiry.UtcDateTime)
            {
                slidingExpiry = absoluteExpiry.UtcDateTime;
            }

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: slidingExpiry,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
