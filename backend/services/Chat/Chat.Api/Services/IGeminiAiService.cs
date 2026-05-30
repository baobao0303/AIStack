using System.Collections.Generic;
using System.Threading.Tasks;

namespace Chat.Api.Services
{
    public interface IGeminiAiService
    {
        /// <summary>
        /// Generates 3 quick-reply suggestions for the support representative based on the product context and recent messages.
        /// </summary>
        Task<List<string>> GenerateSuggestionsAsync(string productContext, List<string> recentMessages);

        /// <summary>
        /// Analyzes a chat history session and active cart size to produce a 5-point bulleted summary and a potential buyer score (0-100).
        /// </summary>
        Task<(string Summary, int BuyerScore)> AnalyzeSessionAsync(List<string> chatHistory, int activeCartSize);
    }
}
