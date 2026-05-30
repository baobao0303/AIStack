using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using ECommerce.Application.Common.Interfaces;
using ECommerce.Domain.Entities;

namespace ECommerce.Application.Orders.Commands.CompleteOrder
{
    public class CompleteOrderCommand : IRequest<bool>
    {
        public string StripeSessionId { get; set; } = null!;
    }

    public class CompleteOrderCommandHandler : IRequestHandler<CompleteOrderCommand, bool>
    {
        private readonly IECommerceDbContext _context;

        public CompleteOrderCommandHandler(IECommerceDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Handle(CompleteOrderCommand request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.StripeSessionId))
            {
                return false;
            }

            // Find order by Stripe Session ID mapping
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o => o.StripeSessionId == request.StripeSessionId, cancellationToken);

            if (order != null && order.Status == OrderStatus.Pending)
            {
                // Mark order as paid
                order.SetPaid(request.StripeSessionId);
                await _context.SaveChangesAsync(cancellationToken);
                return true;
            }

            return false;
        }
    }
}
