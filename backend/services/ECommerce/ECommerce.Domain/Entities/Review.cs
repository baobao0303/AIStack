using System;
using Shared.Domain;

namespace ECommerce.Domain.Entities
{
    public class Review : BaseEntity
    {
        public Guid ProductId { get; private set; }
        public int Rating { get; private set; }
        public string Comment { get; private set; }

        private Review()
        {
            Comment = null!;
        } // Required for EF Core

        public Review(Guid id, Guid productId, int rating, string comment) : base(id)
        {
            if (rating < 1 || rating > 5)
                throw new ArgumentException("Rating must be between 1 and 5.", nameof(rating));
            if (string.IsNullOrWhiteSpace(comment))
                throw new ArgumentException("Comment cannot be empty.", nameof(comment));

            ProductId = productId;
            Rating = rating;
            Comment = comment.Trim();
        }

        public void Update(int rating, string comment)
        {
            if (rating < 1 || rating > 5)
                throw new ArgumentException("Rating must be between 1 and 5.", nameof(rating));
            if (string.IsNullOrWhiteSpace(comment))
                throw new ArgumentException("Comment cannot be empty.", nameof(comment));

            Rating = rating;
            Comment = comment.Trim();
        }
    }
}
