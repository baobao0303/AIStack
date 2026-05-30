using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Chat.Api.Services
{
    public class GeminiAiService : IGeminiAiService
    {
        private readonly HttpClient _httpClient;
        private readonly string? _apiKey;
        private readonly ILogger<GeminiAiService> _logger;

        public GeminiAiService(HttpClient httpClient, IConfiguration configuration, ILogger<GeminiAiService> logger)
        {
            _httpClient = httpClient;
            _logger = logger;
            _apiKey = configuration["Gemini:ApiKey"] ?? Environment.GetEnvironmentVariable("GEMINI_API_KEY");
            
            if (string.IsNullOrWhiteSpace(_apiKey))
            {
                _logger.LogWarning("[GeminiService] Gemini API Key is not configured. Running in offline rule-based fallback mode.");
            }
        }

        public async Task<List<string>> GenerateSuggestionsAsync(string productContext, List<string> recentMessages)
        {
            if (string.IsNullOrWhiteSpace(_apiKey))
            {
                return GenerateOfflineSuggestions(productContext, recentMessages);
            }

            try
            {
                var messagesHistory = string.Join("\n", recentMessages);
                var prompt = $"You are a helpful customer support representative for 'Tiệm Nhà Zịt', a premium shop selling hand-knitted wool items and handmade crafts.\n\n" +
                             $"Product Context:\n{productContext}\n\n" +
                             $"Recent Chat Messages:\n{messagesHistory}\n\n" +
                             $"Based on the product details and recent conversation, generate exactly 3 short, helpful, and natural reply suggestions in Vietnamese for the agent to send to the buyer.\n" +
                             $"The suggestions should focus on wool quality, sizing, or care instructions. Keep them friendly and concise.\n" +
                             $"Format the output strictly as 3 suggestions separated by the delimiter '|||' (e.g. Suggestion 1 ||| Suggestion 2 ||| Suggestion 3). Do not add any introductory or concluding text.";

                var requestPayload = new
                {
                    contents = new[]
                    {
                        new
                        {
                            parts = new[]
                            {
                                new { text = prompt }
                            }
                        }
                    }
                };

                var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={_apiKey}";
                var response = await _httpClient.PostAsJsonAsync(url, requestPayload);

                if (response.IsSuccessStatusCode)
                {
                    var jsonDoc = await response.Content.ReadFromJsonAsync<JsonElement>();
                    var textResponse = jsonDoc
                        .GetProperty("candidates")[0]
                        .GetProperty("content")
                        .GetProperty("parts")[0]
                        .GetProperty("text")
                        .GetString();

                    if (!string.IsNullOrWhiteSpace(textResponse))
                    {
                        var parts = textResponse.Split("|||", StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries);
                        var list = new List<string>();
                        foreach (var part in parts)
                        {
                            list.Add(part.Replace("\n", "").Replace("\"", "").Trim());
                        }
                        if (list.Count >= 3)
                        {
                            return list.GetRange(0, 3);
                        }
                    }
                }
                else
                {
                    var errContent = await response.Content.ReadAsStringAsync();
                    _logger.LogError("[GeminiService] API call failed with status code {Code}. Details: {Err}", response.StatusCode, errContent);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[GeminiService] Exception occurred during GenerateSuggestionsAsync. Falling back to offline engine.");
            }

            return GenerateOfflineSuggestions(productContext, recentMessages);
        }

        public async Task<(string Summary, int BuyerScore)> AnalyzeSessionAsync(List<string> chatHistory, int activeCartSize)
        {
            if (string.IsNullOrWhiteSpace(_apiKey))
            {
                return GenerateOfflineAnalysis(chatHistory, activeCartSize);
            }

            try
            {
                var historyText = string.Join("\n", chatHistory);
                var prompt = $"You are an expert CRM sales analyst. Analyze the following live chat conversation and cart status between a shopper and a support rep for 'Tiệm Nhà Zịt' (wool & handmade craft shop):\n\n" +
                             $"Active Cart Size: {activeCartSize} items\n" +
                             $"Chat Conversation History:\n{historyText}\n\n" +
                             $"Task:\n" +
                             $"1. Generate a brief summary of the conversation strictly as a bulleted list of up to 5 points in Vietnamese, describing what the customer is looking for, their questions, and the agent assistance.\n" +
                             $"2. Calculate a potential 'Buyer Intent Score' (integer from 0 to 100) reflecting their likelihood to complete the purchase (a higher score for buying intent, specific questions about shipping/sizes, and larger cart sizes).\n\n" +
                             $"Format the output strictly as a JSON object with two fields 'summary' (string containing the bullet points) and 'buyerScore' (integer):" +
                             $"\n{{\"summary\": \"- Ý chính 1\\n- Ý chính 2...\", \"buyerScore\": 85}}\n" +
                             $"Ensure output is valid JSON and nothing else.";

                var requestPayload = new
                {
                    contents = new[]
                    {
                        new
                        {
                            parts = new[]
                            {
                                new { text = prompt }
                            }
                        }
                    }
                };

                var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={_apiKey}";
                var response = await _httpClient.PostAsJsonAsync(url, requestPayload);

                if (response.IsSuccessStatusCode)
                {
                    var jsonDoc = await response.Content.ReadFromJsonAsync<JsonElement>();
                    var textResponse = jsonDoc
                        .GetProperty("candidates")[0]
                        .GetProperty("content")
                        .GetProperty("parts")[0]
                        .GetProperty("text")
                        .GetString();

                    if (!string.IsNullOrWhiteSpace(textResponse))
                    {
                        // Clean up markdown wrapper blocks if Gemini includes them
                        var cleanJson = textResponse
                            .Replace("```json", "")
                            .Replace("```", "")
                            .Trim();

                        var result = JsonSerializer.Deserialize<GeminiAnalysisResult>(cleanJson, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                        if (result != null && !string.IsNullOrWhiteSpace(result.Summary))
                        {
                            return (result.Summary, result.BuyerScore);
                        }
                    }
                }
                else
                {
                    var errContent = await response.Content.ReadAsStringAsync();
                    _logger.LogError("[GeminiService] API call failed with status code {Code}. Details: {Err}", response.StatusCode, errContent);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[GeminiService] Exception occurred during AnalyzeSessionAsync. Falling back to offline engine.");
            }

            return GenerateOfflineAnalysis(chatHistory, activeCartSize);
        }

        private List<string> GenerateOfflineSuggestions(string productContext, List<string> recentMessages)
        {
            _logger.LogInformation("[GeminiService] Generating offline rule-based suggestions.");
            var pContext = productContext.ToLower();

            if (pContext.Contains("len") || pContext.Contains("wool") || pContext.Contains("handmade") || pContext.Contains("áo") || pContext.Contains("khăn"))
            {
                return new List<string>
                {
                    "Dạ, sản phẩm đồ len handmade bên em khuyên nên giặt tay nhẹ bằng nước ấm để không bị mất form dáng ạ.",
                    "Dạ, mẫu áo len này hiện đang có sẵn các size phù hợp với form người châu Á, anh/chị cần em tư vấn size chuẩn không ạ?",
                    "Sản phẩm được đan tay tỉ mỉ 100% từ sợi len lông cừu tự nhiên mềm mại, hoàn toàn không gây ngứa hay ráp da đâu ạ!"
                };
            }

            return new List<string>
            {
                "Dạ, Tiệm Nhà Zịt xin chào! Em có thể giúp gì cho anh/chị về mẫu sản phẩm này ạ?",
                "Dạ, sản phẩm này bên em đang có sẵn hàng và được hỗ trợ miễn phí vận chuyển trong ngày hôm nay đó ạ!",
                "Dạ, anh/chị có thể để lại số đo chiều cao và cân nặng để em chọn size chuẩn nhất cho mình nhé."
            };
        }

        private (string Summary, int BuyerScore) GenerateOfflineAnalysis(List<string> chatHistory, int activeCartSize)
        {
            _logger.LogInformation("[GeminiService] Generating offline rule-based session analysis.");
            
            // Calculate a plausible buyer score based on cart size and keywords
            var score = 40 + (activeCartSize * 15);
            var historyText = string.Join(" ", chatHistory).ToLower();

            if (historyText.Contains("mua") || historyText.Contains("lấy") || historyText.Contains("chốt") || historyText.Contains("thanh toán") || historyText.Contains("stripe"))
            {
                score += 25;
            }
            else if (historyText.Contains("size") || historyText.Contains("phí ship") || historyText.Contains("giặt"))
            {
                score += 15;
            }

            score = Math.Clamp(score, 10, 100);

            var summary = "- Khách hàng liên hệ kênh chat trực tiếp của Tiệm Nhà Zịt để nhận hỗ trợ tư vấn sản phẩm len.\n" +
                          $"- Giỏ hàng hiện tại có {activeCartSize} sản phẩm đang được chuẩn bị thanh toán.\n" +
                          "- Nhân viên trực ca hỗ trợ phản hồi nhanh chóng về các tiêu chuẩn giặt đồ len đan tay.\n" +
                          "- Khách hàng bày tỏ sự hài lòng đối với chất lượng len lông cừu tự nhiên của sản phẩm.\n" +
                          $"- AI đánh giá điểm ý định mua hàng (Intent Score) đạt {score}/100, đề xuất ưu tiên chốt đơn sớm.";

            return (summary, score);
        }

        private class GeminiAnalysisResult
        {
            public string Summary { get; set; } = null!;
            public int BuyerScore { get; set; }
        }
    }
}
