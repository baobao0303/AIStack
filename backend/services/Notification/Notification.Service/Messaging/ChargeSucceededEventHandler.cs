using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Npgsql;
using Shared.Messaging;
using Shared.Messaging.Events;
using Notification.Service.Models;
using Notification.Service.Services;

namespace Notification.Service.Messaging
{
    public class ChargeSucceededEventHandler : IEventHandler<ChargeSucceededEvent>
    {
        private readonly IEmailSender _emailSender;
        private readonly IConfiguration _configuration;
        private readonly ILogger<ChargeSucceededEventHandler> _logger;

        public ChargeSucceededEventHandler(
            IEmailSender emailSender, 
            IConfiguration configuration, 
            ILogger<ChargeSucceededEventHandler> logger)
        {
            _emailSender = emailSender;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task HandleAsync(ChargeSucceededEvent @event)
        {
            if (@event == null || string.IsNullOrWhiteSpace(@event.StripeSessionId))
            {
                _logger.LogWarning("[Event Handler] Received null or empty StripeSessionId. Skipping.");
                return;
            }

            string stripeSessionId = @event.StripeSessionId;
            _logger.LogInformation("[Event Handler] Processing ChargeSucceededEvent for Stripe Session: {StripeSessionId}", stripeSessionId);

            var connectionString = _configuration.GetConnectionString("DefaultConnection") 
                ?? "Host=localhost;Database=crm_shared;Username=postgres;Password=supersecretpassword";

            try
            {
                // 1. Fetch order details from database (with retry support for microservices race conditions)
                Order? order = await GetOrderWithRetryAsync(connectionString, stripeSessionId);
                
                if (order == null)
                {
                    _logger.LogError("[Event Handler] Order with Stripe Session {StripeSessionId} could not be resolved from DB after multiple retries. Skipping email dispatch.", stripeSessionId);
                    return;
                }

                // 2. Dispatch stylized HTML invoice email via modern MailKit sender
                _logger.LogInformation("[Event Handler] Found order #{OrderId} for Buyer {BuyerEmail}. Dispatching email receipt...", order.Id, order.BuyerEmail);
                await _emailSender.SendInvoiceEmailAsync(order);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[Event Handler] Critical error occurred while handling payment receipt workflow for Stripe Session: {StripeSessionId}", stripeSessionId);
                throw;
            }
        }

        private async Task<Order?> GetOrderWithRetryAsync(string connectionString, string stripeSessionId)
        {
            const int maxRetries = 3;
            const int retryDelayMs = 3000;

            for (int i = 0; i < maxRetries; i++)
            {
                _logger.LogInformation("[DB Fetch] Retrieving order for Stripe Session {StripeSessionId} (Attempt {Attempt}/{MaxRetries})...", stripeSessionId, i + 1, maxRetries);
                
                try
                {
                    Order? order = await FetchOrderFromPostgresAsync(connectionString, stripeSessionId);
                    if (order != null)
                    {
                        return order;
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "[DB Fetch] Connection or query failed during database fetch attempt.");
                }

                if (i < maxRetries - 1)
                {
                    _logger.LogWarning("[DB Fetch] Order details not found or connection failed. Sleeping for {Delay}ms to let E-commerce service complete writes...", retryDelayMs);
                    await Task.Delay(retryDelayMs);
                }
            }

            return null;
        }

        private async Task<Order?> FetchOrderFromPostgresAsync(string connectionString, string stripeSessionId)
        {
            using var connection = new NpgsqlConnection(connectionString);
            await connection.OpenAsync();

            // 1. Fetch main order using parameterized query for SQL injection protection
            const string orderQuery = @"
                SELECT ""Id"", ""BuyerEmail"", ""TotalAmount"", ""Status"", ""CreatedAt""
                FROM orders
                WHERE ""StripeSessionId"" = @StripeSessionId
                LIMIT 1;";

            using var orderCommand = new NpgsqlCommand(orderQuery, connection);
            orderCommand.Parameters.AddWithValue("StripeSessionId", stripeSessionId);

            using var orderReader = await orderCommand.ExecuteReaderAsync();
            if (!await orderReader.ReadAsync())
            {
                return null;
            }

            var order = new Order
            {
                Id = orderReader.GetGuid(0),
                BuyerEmail = orderReader.GetString(1),
                TotalAmount = orderReader.GetDecimal(2),
                Status = orderReader.GetString(3),
                StripeSessionId = stripeSessionId,
                CreatedAt = orderReader.GetDateTime(4)
            };
            
            // Close order reader to execute the next query
            await orderReader.CloseAsync();

            // 2. Fetch order items
            const string itemsQuery = @"
                SELECT ""Id"", ""ProductId"", ""ProductName"", ""Price"", ""Quantity""
                FROM order_items
                WHERE ""OrderId"" = @OrderId;";

            using var itemsCommand = new NpgsqlCommand(itemsQuery, connection);
            itemsCommand.Parameters.AddWithValue("OrderId", order.Id);

            using var itemsReader = await itemsCommand.ExecuteReaderAsync();
            while (await itemsReader.ReadAsync())
            {
                var item = new OrderItem
                {
                    Id = itemsReader.GetGuid(0),
                    OrderId = order.Id,
                    ProductId = itemsReader.GetGuid(1),
                    ProductName = itemsReader.GetString(2),
                    Price = itemsReader.GetDecimal(3),
                    Quantity = itemsReader.GetInt32(4)
                };
                order.OrderItems.Add(item);
            }

            return order;
        }
    }
}
