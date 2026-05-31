using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using ECommerce.Application.Common.Interfaces;
using ECommerce.Domain.Entities;

namespace ECommerce.Application.Reviews
{
    public class ReviewDto
    {
        public Guid Id { get; set; }
        public Guid ProductId { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; } = null!;
        public DateTimeOffset CreatedAt { get; set; }
    }

    public class CreateReviewCommand : IRequest<Guid>
    {
        public Guid ProductId { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; } = null!;
    }

    public class CreateReviewCommandHandler : IRequestHandler<CreateReviewCommand, Guid>
    {
        private readonly IECommerceDbContext _context;

        public CreateReviewCommandHandler(IECommerceDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<Guid> Handle(CreateReviewCommand request, CancellationToken cancellationToken)
        {
            var product = await _context.Products
                .FirstOrDefaultAsync(p => p.Id == request.ProductId, cancellationToken);

            if (product == null)
            {
                throw new InvalidOperationException($"Product with ID {request.ProductId} not found.");
            }

            var review = new Review(Guid.NewGuid(), request.ProductId, request.Rating, request.Comment);
            await _context.Reviews.AddAsync(review, cancellationToken);

            // Update Product rating average and review count aggregate (DDD encapsulation)
            product.AddReview(request.Rating);

            await _context.SaveChangesAsync(cancellationToken);
            return review.Id;
        }
    }

    public class GetProductReviewsQuery : IRequest<List<ReviewDto>>
    {
        public Guid ProductId { get; set; }
    }

    public class GetProductReviewsQueryHandler : IRequestHandler<GetProductReviewsQuery, List<ReviewDto>>
    {
        private readonly IECommerceDbContext _context;

        public GetProductReviewsQueryHandler(IECommerceDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<List<ReviewDto>> Handle(GetProductReviewsQuery request, CancellationToken cancellationToken)
        {
            var reviews = await _context.Reviews
                .AsNoTracking()
                .Where(r => r.ProductId == request.ProductId)
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new ReviewDto
                {
                    Id = r.Id,
                    ProductId = r.ProductId,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    CreatedAt = r.CreatedAt
                })
                .ToListAsync(cancellationToken);

            return reviews;
        }
    }
}
