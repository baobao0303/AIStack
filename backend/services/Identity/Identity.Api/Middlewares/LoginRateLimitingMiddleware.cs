using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Identity.Api.Middlewares
{
    public class LoginRateLimitingMiddleware
    {
        private readonly RequestDelegate _next;
        private static readonly ConcurrentDictionary<string, List<DateTime>> RequestStore = new();
        private const int MaxAttempts = 5;
        private static readonly TimeSpan TimeWindow = TimeSpan.FromMinutes(1);

        public LoginRateLimitingMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            // Only apply rate limiting to POST /api/auth/login
            if (context.Request.Path.Value?.Equals("/api/auth/login", StringComparison.OrdinalIgnoreCase) == true &&
                context.Request.Method.Equals("POST", StringComparison.OrdinalIgnoreCase))
            {
                var clientIp = context.Connection.RemoteIpAddress?.ToString() ?? "unknown-ip";
                var now = DateTime.UtcNow;

                var requestTimes = RequestStore.GetOrAdd(clientIp, _ => new List<DateTime>());

                lock (requestTimes)
                {
                    // Clean up timestamps outside the time window
                    requestTimes.RemoveAll(time => now - time > TimeWindow);

                    if (requestTimes.Count >= MaxAttempts)
                    {
                        context.Response.StatusCode = (int)HttpStatusCode.TooManyRequests;
                        context.Response.ContentType = "application/json";
                        context.Response.WriteAsync("{\"error\": \"Quá nhiều yêu cầu đăng nhập. Vui lòng thử lại sau 1 phút.\"}").Wait();
                        return;
                    }

                    requestTimes.Add(now);
                }
            }

            await _next(context);
        }
    }
}
