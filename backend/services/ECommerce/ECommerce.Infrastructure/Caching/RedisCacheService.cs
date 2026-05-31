using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using StackExchange.Redis;
using ECommerce.Application.Common.Interfaces;

namespace ECommerce.Infrastructure.Caching
{
    public class RedisCacheService : IRedisCacheService
    {
        private readonly ILogger<RedisCacheService> _logger;
        private readonly ConnectionMultiplexer? _redis;
        private readonly IDatabase? _database;
        private readonly ConcurrentDictionary<string, double> _inMemorySuggestions = new(StringComparer.OrdinalIgnoreCase);

        private const string SuggestionsKey = "search_suggestions";

        public RedisCacheService(IConfiguration configuration, ILogger<RedisCacheService> logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            
            var connectionString = configuration["Redis:ConnectionString"] ?? configuration.GetConnectionString("RedisConnection");

            if (!string.IsNullOrWhiteSpace(connectionString))
            {
                try
                {
                    _redis = ConnectionMultiplexer.Connect(connectionString);
                    _database = _redis.GetDatabase();
                    _logger.LogInformation("Successfully connected to Redis at {Host}.", connectionString);
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to connect to Redis. Autocomplete suggestions will fall back to in-memory mode.");
                }
            }
            else
            {
                _logger.LogInformation("Redis connection string is empty. Running autocomplete suggestions in in-memory mode.");
            }
        }

        public async Task AddSearchSuggestionAsync(string keyword, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(keyword)) return;

            var cleanKeyword = keyword.Trim();

            if (_database != null)
            {
                try
                {
                    // Increment the sorted set score by 1
                    await _database.SortedSetIncrementAsync(SuggestionsKey, cleanKeyword, 1);
                    _logger.LogInformation("Added search suggestion in Redis: {Keyword}", cleanKeyword);
                    return;
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to write search suggestion to Redis. Falling back to in-memory.");
                }
            }

            // In-Memory Fallback
            _inMemorySuggestions.AddOrUpdate(cleanKeyword, 1, (_, oldScore) => oldScore + 1);
            _logger.LogInformation("Added search suggestion in-memory: {Keyword}", cleanKeyword);
            await Task.CompletedTask;
        }

        public async Task<List<string>> GetSearchSuggestionsAsync(string query, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(query)) return new List<string>();

            var cleanQuery = query.Trim().ToLowerInvariant();

            if (_database != null)
            {
                try
                {
                    // Retrieve suggestions sorted by highest score (popularity)
                    var suggestions = await _database.SortedSetRangeByRankAsync(SuggestionsKey, 0, -1, Order.Descending);
                    
                    if (suggestions != null)
                    {
                        var matchingSuggestions = suggestions
                            .Select(val => val.ToString())
                            .Where(val => val.ToLowerInvariant().Contains(cleanQuery))
                            .Take(10)
                            .ToList();

                        _logger.LogInformation("Retrieved {Count} autocomplete suggestions from Redis for query '{Query}'.", matchingSuggestions.Count, query);
                        return matchingSuggestions;
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to query autocomplete suggestions from Redis. Falling back to in-memory.");
                }
            }

            // In-Memory Fallback
            var inMemoryHits = _inMemorySuggestions
                .Where(pair => pair.Key.ToLowerInvariant().Contains(cleanQuery))
                .OrderByDescending(pair => pair.Value)
                .Select(pair => pair.Key)
                .Take(10)
                .ToList();

            _logger.LogInformation("Retrieved {Count} autocomplete suggestions from In-Memory store for query '{Query}'.", inMemoryHits.Count, query);
            return await Task.FromResult(inMemoryHits);
        }

        public async Task InvalidateProductCacheAsync(Guid productId, CancellationToken cancellationToken)
        {
            var cacheKey = $"product:{productId}";

            if (_database != null)
            {
                try
                {
                    await _database.KeyDeleteAsync(cacheKey);
                    _logger.LogInformation("Invalidated Redis product cache key '{Key}'.", cacheKey);
                    return;
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to invalidate Redis product cache key '{Key}'.", cacheKey);
                }
            }

            // In-memory does not keep cached models, so invalidation is a no-op
            await Task.CompletedTask;
        }
    }
}
