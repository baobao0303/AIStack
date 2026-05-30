using System;
using System.Threading.Tasks;
using MediatR;
using Shared.Messaging;
using Shared.Messaging.Events;
using ECommerce.Application.Orders.Commands.CompleteOrder;

namespace ECommerce.Infrastructure.Messaging
{
    public class ChargeSucceededConsumer : IEventHandler<ChargeSucceededEvent>
    {
        private readonly IMediator _mediator;

        public ChargeSucceededConsumer(IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task HandleAsync(ChargeSucceededEvent @event)
        {
            if (string.IsNullOrWhiteSpace(@event.StripeSessionId))
            {
                return;
            }

            // Trigger the MediatR CompleteOrderCommand to update order status and inventory stock
            var command = new CompleteOrderCommand { StripeSessionId = @event.StripeSessionId };
            await _mediator.Send(command);
        }
    }
}
