using System;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Identity.Application.Common.Interfaces;

namespace Identity.Application.Authentication.Commands.Logout
{
    public class LogoutCommand : IRequest<bool>
    {
        public string RefreshToken { get; set; } = null!;
    }

    public class LogoutCommandHandler : IRequestHandler<LogoutCommand, bool>
    {
        private readonly IIdentityDbContext _context;

        public LogoutCommandHandler(IIdentityDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Handle(LogoutCommand request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.RefreshToken))
            {
                return false;
            }

            // 1. Hash raw Refresh Token and query database
            var incomingHash = ComputeSha256Hash(request.RefreshToken);
            var dbToken = await _context.RefreshTokens
                .FirstOrDefaultAsync(rt => rt.TokenHash == incomingHash, cancellationToken);

            if (dbToken != null && !dbToken.IsRevoked)
            {
                // 2. Revoke the token
                dbToken.Revoke(DateTimeOffset.UtcNow);
                await _context.SaveChangesAsync(cancellationToken);
                return true;
            }

            return false;
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
