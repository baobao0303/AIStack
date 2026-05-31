using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using ECommerce.Application.Common.Interfaces;

namespace ECommerce.Application.Products.Queries.GetProductSuggestions
{
    public class GetProductSuggestionsQuery : IRequest<List<string>>
    {
        public string Query { get; set; } = null!;
    }

    public class GetProductSuggestionsQueryHandler : IRequestHandler<GetProductSuggestionsQuery, List<string>>
    {
        private readonly IRedisCacheService _cache;

        public GetProductSuggestionsQueryHandler(IRedisCacheService cache)
        {
            _cache = cache ?? throw new ArgumentNullException(nameof(cache));
        }

        public async Task<List<string>> Handle(GetProductSuggestionsQuery request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.Query))
            {
                return new List<string>();
            }

            return await _cache.GetSearchSuggestionsAsync(request.Query, cancellationToken);
        }
    }
}
