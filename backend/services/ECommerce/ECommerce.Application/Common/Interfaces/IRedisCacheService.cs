using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace ECommerce.Application.Common.Interfaces
{
    public interface IRedisCacheService
    {
        Task AddSearchSuggestionAsync(string keyword, CancellationToken cancellationToken);
        Task<List<string>> GetSearchSuggestionsAsync(string query, CancellationToken cancellationToken);
        Task InvalidateProductCacheAsync(Guid productId, CancellationToken cancellationToken);
    }
}
