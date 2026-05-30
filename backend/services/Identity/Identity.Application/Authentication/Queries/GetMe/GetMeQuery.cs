using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Identity.Application.Common.Interfaces;

namespace Identity.Application.Authentication.Queries.GetMe
{
    public class GetMeQuery : IRequest<GetMeResponse>
    {
        public Guid UserId { get; set; }
    }

    public class GetMeResponse
    {
        public Guid Id { get; set; }
        public Guid TenantId { get; set; }
        public string Email { get; set; } = null!;
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
    }

    public class GetMeQueryHandler : IRequestHandler<GetMeQuery, GetMeResponse>
    {
        private readonly IIdentityDbContext _context;

        public GetMeQueryHandler(IIdentityDbContext context)
        {
            _context = context;
        }

        public async Task<GetMeResponse> Handle(GetMeQuery request, CancellationToken cancellationToken)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == request.UserId, cancellationToken);

            if (user == null)
            {
                throw new UnauthorizedAccessException("User not found.");
            }

            return new GetMeResponse
            {
                Id = user.Id,
                TenantId = user.TenantId,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName
            };
        }
    }
}
