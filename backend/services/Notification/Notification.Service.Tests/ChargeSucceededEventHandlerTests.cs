using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging.Abstractions;
using Shared.Messaging.Events;
using Notification.Service.Messaging;
using Notification.Service.Models;
using Notification.Service.Services;
using Xunit;

namespace Notification.Service.Tests
{
    public class ChargeSucceededEventHandlerTests
    {
        private class MockEmailSender : IEmailSender
        {
            public Order? SentOrder { get; private set; }
            public int SendCount { get; private set; }

            public Task SendInvoiceEmailAsync(Order order)
            {
                SentOrder = order;
                SendCount++;
                return Task.CompletedTask;
            }
        }

        [Fact]
        public async Task HandleAsync_With_Null_Or_Empty_StripeSessionId_Should_Skip_Processing()
        {
            // Arrange
            var mockEmailSender = new MockEmailSender();
            var inMemorySettings = new Dictionary<string, string>();
            IConfiguration configuration = new ConfigurationBuilder().AddInMemoryCollection(inMemorySettings).Build();

            var handler = new ChargeSucceededEventHandler(
                mockEmailSender,
                configuration,
                NullLogger<ChargeSucceededEventHandler>.Instance
            );

            var invalidEvent = new ChargeSucceededEvent { StripeSessionId = "" };

            // Act
            await handler.HandleAsync(invalidEvent);

            // Assert
            Assert.Equal(0, mockEmailSender.SendCount);
            Assert.Null(mockEmailSender.SentOrder);
        }

        [Fact]
        public async Task HandleAsync_With_Null_Event_Should_Skip_Processing()
        {
            // Arrange
            var mockEmailSender = new MockEmailSender();
            var inMemorySettings = new Dictionary<string, string>();
            IConfiguration configuration = new ConfigurationBuilder().AddInMemoryCollection(inMemorySettings).Build();

            var handler = new ChargeSucceededEventHandler(
                mockEmailSender,
                configuration,
                NullLogger<ChargeSucceededEventHandler>.Instance
            );

            // Act
            await handler.HandleAsync(null!);

            // Assert
            Assert.Equal(0, mockEmailSender.SendCount);
        }
    }
}
