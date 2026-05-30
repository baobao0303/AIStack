using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using ECommerce.Application.Common.Interfaces;
using ECommerce.Domain.Entities;

namespace ECommerce.Application.Orders.Commands.CreateOrder
{
    public class CreateOrderCommand : IRequest<CreateOrderResponse>
    {
        public string BuyerEmail { get; set; } = null!;
        public List<CartItemDto> CartItems { get; set; } = new();
        public string SuccessUrl { get; set; } = null!;
        public string CancelUrl { get; set; } = null!;
    }

    public class CartItemDto
    {
        public Guid ProductId { get; set; }
        public int Quantity { get; set; }
    }

    public class CreateOrderResponse
    {
        public Guid OrderId { get; set; }
        public string StripeCheckoutUrl { get; set; } = null!;
        public decimal TotalAmount { get; set; }
    }

    public class CreateOrderCommandHandler : IRequestHandler<CreateOrderCommand, CreateOrderResponse>
    {
        private readonly IECommerceDbContext _context;
        private readonly IStripePaymentService _stripePaymentService;

        public CreateOrderCommandHandler(IECommerceDbContext context, IStripePaymentService stripePaymentService)
        {
            _context = context;
            _stripePaymentService = stripePaymentService;
        }

        public async Task<CreateOrderResponse> Handle(CreateOrderCommand request, CancellationToken cancellationToken)
        {
            if (request.CartItems == null || !request.CartItems.Any())
            {
                throw new ArgumentException("Shopping cart cannot be empty.");
            }

            // 1. Fetch products from database
            var productIds = request.CartItems.Select(item => item.ProductId).ToList();
            var products = await _context.Products
                .Where(p => productIds.Contains(p.Id))
                .ToListAsync(cancellationToken);

            if (products.Count != productIds.Distinct().Count())
            {
                throw new InvalidOperationException("One or more products in your shopping cart do not exist.");
            }

            var orderId = Guid.NewGuid();
            decimal totalAmount = 0;

            // 2. Build the Order entity and lock stock
            var order = new Order(orderId, request.BuyerEmail, 0);

            foreach (var cartItem in request.CartItems)
            {
                var product = products.First(p => p.Id == cartItem.ProductId);
                
                // Locks stock inside entity (throws exception if stock is insufficient)
                product.DecreaseStock(cartItem.Quantity);

                decimal itemTotal = product.Price * cartItem.Quantity;
                totalAmount += itemTotal;

                order.AddItem(product.Id, product.Name, product.Price, cartItem.Quantity);
            }

            // Re-assign computed total amount to the Order
            // EF Core lets us mutate totalAmount or map it during constructor
            var finalOrder = new Order(orderId, request.BuyerEmail, totalAmount);
            foreach (var item in order.OrderItems)
            {
                finalOrder.AddItem(item.ProductId, item.ProductName, item.Price, item.Quantity);
            }

            // 3. Initiate Stripe Checkout Session
            var stripeUrl = await _stripePaymentService.CreateCheckoutSessionAsync(finalOrder, request.SuccessUrl, request.CancelUrl);

            // Extract Stripe Session ID from the URL if needed, or Stripe C# SDK provides it.
            // For robustness, our Stripe Payment Service will assign it or we track session mappings.
            // Let's save the order in database
            await _context.Orders.AddAsync(finalOrder, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            return new CreateOrderResponse
            {
                OrderId = finalOrder.Id,
                StripeCheckoutUrl = stripeUrl,
                TotalAmount = finalOrder.TotalAmount
            };
        }
    }
}
