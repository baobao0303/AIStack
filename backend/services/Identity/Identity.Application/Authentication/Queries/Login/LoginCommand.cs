using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using Identity.Application.Common.Interfaces;

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
        private readonly IDistributedCache _cache;

        public LoginCommandHandler(
            IIdentityDbContext context, 
            IPasswordHasher passwordHasher, 
            ITokenService tokenService,
            IDistributedCache cache)
        {
            _context = context;
            _passwordHasher = passwordHasher;
            _tokenService = tokenService;
            _cache = cache;
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
            var accessToken = _tokenService.GenerateAccessToken(user, roles);
            var refreshToken = _tokenService.GenerateRefreshToken();

            // 5. Cache the Refresh Token inside Redis (using Distributed Cache with 7 days sliding TTL)
            var cacheOptions = new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(7)
            };
            
            // Redis Key: sessions:{userId}:{refreshToken}
            var cacheKey = $"sessions:{user.Id}:{refreshToken}";
            await _cache.SetStringAsync(cacheKey, user.TenantId.ToString(), cacheOptions, cancellationToken);

            return new LoginCommandResponse
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                UserId = user.Id,
                Email = user.Email
            };
        }
    }
}
