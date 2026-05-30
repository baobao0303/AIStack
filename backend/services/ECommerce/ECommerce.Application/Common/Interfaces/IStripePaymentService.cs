using System.Threading.Tasks;
using ECommerce.Domain.Entities;

namespace ECommerce.Application.Common.Interfaces
{
    public interface IStripePaymentService
    {
        /// <summary>
        /// Creates a Stripe Checkout Session for the pending order and returns the Session URL.
        /// </summary>
        Task<string> CreateCheckoutSessionAsync(Order order, string successUrl, string cancelUrl);

        /// <summary>
        /// Validates the Stripe Webhook signature and returns the associated Order ID if the charge was successful.
        /// </summary>
        Task<string?> VerifyWebhookAndGetSessionIdAsync(string jsonPayload, string stripeSignatureHeader, string webhookSecret);
    }
}
