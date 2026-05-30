using System;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Identity.Application.Common.Interfaces;
using Identity.Domain.Entities;

namespace Identity.Application.Authentication.Queries.Login
{
    public class LoginCommand : IRequest<LoginCommandResponse>
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }

    public class LoginCommandResponse
    {
        public string AccessToken { get; set; } = null!;
        public string RefreshToken { get; set; } = null!;
        public int ExpiresIn => 900; // 15 minutes in seconds
        public Guid UserId { get; set; }
        public string Email { get; set; } = null!;
    }

    public class LoginCommandHandler : IRequestHandler<LoginCommand, LoginCommandResponse>
    {
        private readonly IIdentityDbContext _context;
        private readonly IPasswordHasher _passwordHasher;
        private readonly ITokenService _tokenService;

        public LoginCommandHandler(
            IIdentityDbContext context, 
            IPasswordHasher passwordHasher, 
            ITokenService tokenService)
        {
            _context = context;
            _passwordHasher = passwordHasher;
            _tokenService = tokenService;
        }

        public async Task<LoginCommandResponse> Handle(LoginCommand request, CancellationToken cancellationToken)
        {
            var normalizedEmail = request.Email.ToLowerInvariant().Trim();

            // 1. Find User by Email
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == normalizedEmail, cancellationToken);
            
            if (user == null)
            {
                throw new UnauthorizedAccessException("Invalid email address or password.");
            }

            // 2. Verify Hashed Password
            var isValid = _passwordHasher.VerifyPassword(request.Password, user.PasswordHash);
            if (!isValid)
            {
                throw new UnauthorizedAccessException("Invalid email address or password.");
            }

            // 3. Query User Roles
            var roles = await (from ur in _context.UserRoles
                               join r in _context.Roles on ur.RoleId equals r.Id
                               where ur.UserId == user.Id
                               select r.Name).ToArrayAsync(cancellationToken);

            // 4. Generate Access and Refresh Tokens
            var jti = Guid.NewGuid().ToString();
            var absoluteExpiry = DateTimeOffset.UtcNow.AddDays(30);
            var accessToken = _tokenService.GenerateAccessToken(user, roles);
            var refreshToken = _tokenService.GenerateRefreshToken(user, jti, absoluteExpiry);

            // 5. Store Hashed Refresh Token in PostgreSQL database
            var tokenHash = ComputeSha256Hash(refreshToken);
            
            // Sliding expiration is 7 days
            var expiresAt = DateTimeOffset.UtcNow.AddDays(7);
            if (expiresAt > absoluteExpiry)
            {
                expiresAt = absoluteExpiry;
            }

            var dbToken = new RefreshToken(
                Guid.NewGuid(),
                user.Id,
                tokenHash,
                jti,
                DateTimeOffset.UtcNow,
                expiresAt,
                absoluteExpiry
            );

            await _context.RefreshTokens.AddAsync(dbToken, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            return new LoginCommandResponse
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
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
