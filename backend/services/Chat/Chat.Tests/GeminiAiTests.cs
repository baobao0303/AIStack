using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Chat.Api.Entities;
using Chat.Api.Persistence;
using Chat.Api.Services;
using Xunit;

namespace Chat.Tests
{
    public class GeminiAiTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly WebApplicationFactory<Program> _factory;
        private static readonly Guid TestTenantId = Guid.Parse("33333333-3333-3333-3333-333333333333");

        public GeminiAiTests(WebApplicationFactory<Program> factory)
        {
            _factory = factory.WithWebHostBuilder(builder =>
            {
                builder.ConfigureTestServices(services =>
                {
                    // 1. Remove standard PostgreSQL DB registration
                    var descriptor = services.SingleOrDefault(
                        d => d.ServiceType == typeof(DbContextOptions<ChatDbContext>));
                    if (descriptor != null)
                    {
                        services.Remove(descriptor);
                    }

                    // 2. Register a unique InMemory Database instead for isolated testing
                    services.AddDbContext<ChatDbContext>(options =>
                        options.UseInMemoryDatabase("GeminiAiTestsDb"));
                });
            });
        }

        [Fact]
        public async Task GeminiAiService_OfflineFallback_Should_Generate_Contextual_Suggestions_And_Scores()
        {
            using var scope = _factory.Services.CreateScope();
            var aiService = scope.ServiceProvider.GetRequiredService<IGeminiAiService>();

            // 1. Verify product-contextual wool/handmade care reply suggestions
            var suggestions = await aiService.GenerateSuggestionsAsync(
                "Áo len handmade cổ điển màu trắng lông cừu", 
                new List<string> { "Khách hỏi: Giặt áo len này thế nào em?" });

            Assert.NotNull(suggestions);
            Assert.Equal(3, suggestions.Count);
            Assert.Contains(suggestions, s => s.Contains("giặt tay"));

            // 2. Verify Plausible Intent Score and 5-point Bullet Summary
            var chatHistory = new List<string>
            {
                "Customer: Mình muốn mua cái khăn len đan tay",
                "Agent: Dạ, chị chuyển khoản cọc giúp em nhé ạ",
                "Customer: Ok, chuyển khoản xong rồi nha"
            };

            var (summary, score) = await aiService.AnalyzeSessionAsync(chatHistory, activeCartSize: 3);

            Assert.False(string.IsNullOrWhiteSpace(summary));
            Assert.Contains("- Giỏ hàng hiện tại có 3 sản phẩm", summary);
            Assert.True(score > 70, $"Expected high buyer score but got {score}");
            Assert.True(score <= 100);
        }

        [Fact]
        public async Task AiController_Suggest_Should_Return_QuickReplies()
        {
            var client = _factory.CreateClient();

            var request = new SuggestionRequest
            {
                ProductContext = "Khăn choàng len handmade cao cấp",
                RecentMessages = new List<string> { "Khách: Sợi len này có xơ hay ngứa cổ không em?" }
            };

            var response = await client.PostAsJsonAsync("/api/ai/suggest", request);
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var suggestions = await response.Content.ReadFromJsonAsync<List<string>>();
            Assert.NotNull(suggestions);
            Assert.Equal(3, suggestions.Count);
            Assert.Contains(suggestions, s => s.Contains("len lông cừu") || s.Contains("giặt tay"));
        }

        [Fact]
        public async Task AiController_Summarize_Should_Analyze_And_Persist_Summary_And_BuyerScore()
        {
            var client = _factory.CreateClient();
            using var scope = _factory.Services.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ChatDbContext>();

            // 1. Seed chat session and messages
            var sessionId = Guid.NewGuid();
            var session = new ChatSession
            {
                Id = sessionId,
                TenantId = TestTenantId,
                CustomerEmail = "testbuyer@gmail.com",
                Status = ChatSessionStatuses.Active
            };
            await context.ChatSessions.AddAsync(session);

            var msg = new ChatMessage
            {
                Id = Guid.NewGuid(),
                SessionId = sessionId,
                SenderType = SenderTypes.Customer,
                SenderName = "Test Buyer",
                Content = "Áo len handmade này có freeship không em? Mình chốt mua luôn nhé."
            };
            await context.ChatMessages.AddAsync(msg);
            await context.SaveChangesAsync();

            // 2. Invoke API summarize endpoint
            var response = await client.PostAsJsonAsync($"/api/ai/summarize/{sessionId}?activeCartSize=2", new { });
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            // 3. Assert response payload
            var result = await response.Content.ReadFromJsonAsync<SummarizeResponse>();
            Assert.NotNull(result);
            Assert.Equal(sessionId, result.SessionId);
            Assert.False(string.IsNullOrWhiteSpace(result.Summary));
            Assert.True(result.BuyerScore > 50);

            // 4. Assert PostgreSQL EF Core DB persistence
            using var assertionScope = _factory.Services.CreateScope();
            var assertionContext = assertionScope.ServiceProvider.GetRequiredService<ChatDbContext>();
            var dbSession = await assertionContext.ChatSessions.FindAsync(sessionId);

            Assert.NotNull(dbSession);
            Assert.Equal(result.Summary, dbSession.Summary);
            Assert.Equal(result.BuyerScore, dbSession.BuyerScore);
        }

        private class SuggestionRequest
        {
            public string ProductContext { get; set; } = null!;
            public List<string>? RecentMessages { get; set; }
        }

        private class SummarizeResponse
        {
            public Guid SessionId { get; set; }
            public string CustomerEmail { get; set; } = null!;
            public string Summary { get; set; } = null!;
            public int BuyerScore { get; set; }
        }
    }
}
