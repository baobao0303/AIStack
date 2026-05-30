using System;
using System.Globalization;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MimeKit;
using MailKit.Net.Smtp;
using MailKit.Security;
using Notification.Service.Models;

namespace Notification.Service.Services
{
    public class EmailSender : IEmailSender
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailSender> _logger;

        public EmailSender(IConfiguration configuration, ILogger<EmailSender> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task SendInvoiceEmailAsync(Order order)
        {
            if (order == null) throw new ArgumentNullException(nameof(order));
            if (string.IsNullOrWhiteSpace(order.BuyerEmail)) throw new ArgumentException("Buyer email is missing.");

            _logger.LogInformation("Generating premium invoice HTML email for order {OrderId} to {BuyerEmail}...", order.Id, order.BuyerEmail);

            // Read SMTP configurations from appsettings / environment variables
            var host = _configuration["Smtp:Host"] ?? "smtp.gmail.com";
            var portStr = _configuration["Smtp:Port"] ?? "587";
            int port = int.Parse(portStr);
            var useSsl = _configuration.GetValue<bool>("Smtp:UseSsl");
            var username = _configuration["Smtp:Username"] ?? "baobao0303@gmail.com";
            var password = _configuration["Smtp:Password"]; // Loaded securely from gitignored secrets

            if (string.IsNullOrWhiteSpace(password) || password == "YOUR_SMTP_PASSWORD")
            {
                _logger.LogWarning("[EmailSender] WARNING: SMTP password is not configured (or is using the placeholder 'YOUR_SMTP_PASSWORD'). Running in local development offline mail mode. No real emails will be sent.");
                return;
            }

            // Create SMTP Message using MimeKit
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("Tiệm Nhà Zịt 🧶", username));
            message.To.Add(new MailboxAddress(order.BuyerEmail, order.BuyerEmail));
            message.Subject = $"[Tiệm Nhà Zịt] Hóa đơn xác nhận thanh toán đơn hàng #{order.Id.ToString()[..8].ToUpperInvariant()}";

            var bodyBuilder = new BodyBuilder
            {
                HtmlBody = BuildInvoiceHtml(order)
            };
            message.Body = bodyBuilder.ToMessageBody();

            // Dispatch message using MailKit SmtpClient over TLS
            using var client = new SmtpClient();
            try
            {
                _logger.LogInformation("Connecting to Google SMTP server {Host}:{Port}...", host, port);
                
                // For port 587, use STARTTLS security protocol
                var socketOption = useSsl ? SecureSocketOptions.SslOnConnect : SecureSocketOptions.StartTls;
                await client.ConnectAsync(host, port, socketOption);

                _logger.LogInformation("Authenticating with Google SMTP server as {Username}...", username);
                await client.AuthenticateAsync(username, password);

                _logger.LogInformation("Sending message to {BuyerEmail}...", order.BuyerEmail);
                await client.SendAsync(message);
                
                _logger.LogInformation("[Email Dispatch] Successfully sent payment invoice to {BuyerEmail} for Order ID {OrderId}.", order.BuyerEmail, order.Id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send email to {BuyerEmail} due to an error.", order.BuyerEmail);
                throw;
            }
            finally
            {
                await client.DisconnectAsync(true);
            }
        }

        private string BuildInvoiceHtml(Order order)
        {
            var culture = new CultureInfo("vi-VN");
            
            // Format currency helper in Vietnamese Dong (VND)
            string FormatCurrency(decimal val) => string.Format(culture, "{0:C0}", val);

            string formattedDate = order.CreatedAt.ToString("dd MMMM yyyy HH:mm", culture);

            // Generate order item table rows
            var itemRowsBuilder = new StringBuilder();
            foreach (var item in order.OrderItems)
            {
                itemRowsBuilder.Append($@"
    <tr>
      <td style=""padding: 16px 12px; border-bottom: 1px solid #E5E7EB; color: #1F2937; font-size: 14px;"">
        <div style=""font-weight: 600; color: #1F2937;"">{item.ProductName}</div>
        <div style=""font-size: 12px; color: #6B7280; margin-top: 2px;"">Mã SP: {item.ProductId.ToString()[..8]}</div>
      </td>
      <td style=""padding: 16px 12px; border-bottom: 1px solid #E5E7EB; text-align: center; color: #4B5563; font-size: 14px;"">
        {item.Quantity}
      </td>
      <td style=""padding: 16px 12px; border-bottom: 1px solid #E5E7EB; text-align: right; color: #4B5563; font-size: 14px;"">
        {FormatCurrency(item.Price)}
      </td>
      <td style=""padding: 16px 12px; border-bottom: 1px solid #E5E7EB; text-align: right; color: #111827; font-weight: 600; font-size: 14px;"">
        {FormatCurrency(item.Price * item.Quantity)}
      </td>
    </tr>");
            }

            // High-aesthetic responsive invoice template with modern Google Fonts Outfit and wool decorations
            return $@"
<!DOCTYPE html>
<html>
<head>
  <meta charset=""utf-8"">
  <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
  <title>Hóa Đơn Thanh Toán - Tiệm Nhà Zịt</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap');
    body {{
      font-family: 'Outfit', -apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #F3F4F6;
      -webkit-font-smoothing: antialiased;
    }}
  </style>
</head>
<body style=""background-color: #F3F4F6; padding: 40px 10px; margin: 0;"">
  <table cellpadding=""0"" cellspacing=""0"" width=""100%"" style=""max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05); border: 1px solid #E5E7EB;"">
    <!-- Top HSL Gradient Border -->
    <tr>
      <td height=""8"" style=""background: linear-gradient(135deg, #7C3AED 0%, #EC4899 100%);""></td>
    </tr>
    
    <!-- Cozy Branding Header -->
    <tr>
      <td style=""padding: 40px 40px 20px 40px; text-align: center;"">
        <table cellpadding=""0"" cellspacing=""0"" width=""100%"">
          <tr>
            <td>
              <div style=""display: inline-block; width: 64px; height: 64px; background: #F3E8FF; border-radius: 20px; text-align: center; line-height: 64px; margin-bottom: 16px;"">
                <span style=""font-size: 32px; vertical-align: middle;"">🧶</span>
              </div>
              <h1 style=""margin: 0; font-size: 26px; font-weight: 700; color: #111827; letter-spacing: -0.5px;"">Tiệm Nhà Zịt</h1>
              <p style=""margin: 4px 0 0 0; font-size: 14px; color: #6B7280; font-weight: 400;"">Đan móc đồ len & quà tặng thủ công tinh xảo</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Billing Banner -->
    <tr>
      <td style=""padding: 0 40px 30px 40px;"">
        <div style=""background: linear-gradient(to right, #FAF5FF, #FFF5F7); border-radius: 16px; padding: 20px; border: 1px solid #F3E8FF; text-align: center;"">
          <span style=""font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #9333EA; font-weight: 700; display: block; margin-bottom: 6px;"">Thanh toán thành công</span>
          <h2 style=""margin: 0; font-size: 20px; font-weight: 700; color: #1E1B4B;"">Cảm ơn đơn hàng của bạn!</h2>
          <p style=""margin: 8px 0 0 0; font-size: 13px; color: #4B5563;"">Hóa đơn điện tử của bạn đã được xuất tự động sau khi thanh toán cổng Stripe được hoàn tất.</p>
        </div>
      </td>
    </tr>

    <!-- Billing Details Panel -->
    <tr>
      <td style=""padding: 0 40px 20px 40px;"">
        <table cellpadding=""0"" cellspacing=""0"" width=""100%"" style=""font-size: 13px;"">
          <tr>
            <td width=""50%"" style=""padding-bottom: 20px; vertical-align: top;"">
              <div style=""color: #9CA3AF; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;"">Mã số đơn hàng</div>
              <div style=""color: #111827; font-weight: 600; font-size: 14px;"">#{order.Id.ToString()[..8].ToUpperInvariant()}</div>
            </td>
            <td width=""50%"" style=""padding-bottom: 20px; vertical-align: top; text-align: right;"">
              <div style=""color: #9CA3AF; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;"">Thời gian mua hàng</div>
              <div style=""color: #111827; font-weight: 600; font-size: 14px;"">{formattedDate}</div>
            </td>
          </tr>
          <tr>
            <td width=""50%"" style=""vertical-align: top;"">
              <div style=""color: #9CA3AF; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;"">Người mua hàng</div>
              <div style=""color: #111827; font-weight: 600; font-size: 14px;"">{order.BuyerEmail}</div>
            </td>
            <td width=""50%"" style=""vertical-align: top; text-align: right;"">
              <div style=""color: #9CA3AF; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;"">Phương thức thanh toán</div>
              <div style=""color: #111827; font-weight: 600; font-size: 14px;"">Stripe Checkout 💳</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Billing Items Table -->
    <tr>
      <td style=""padding: 0 40px 20px 40px;"">
        <table cellpadding=""0"" cellspacing=""0"" width=""100%"" style=""border-collapse: collapse; text-align: left;"">
          <thead>
            <tr style=""background-color: #F9FAFB;"">
              <th style=""padding: 12px; border-bottom: 2px solid #E5E7EB; color: #4B5563; font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;"">Sản phẩm đồ len</th>
              <th style=""padding: 12px; border-bottom: 2px solid #E5E7EB; color: #4B5563; font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; text-align: center;"">SL</th>
              <th style=""padding: 12px; border-bottom: 2px solid #E5E7EB; color: #4B5563; font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; text-align: right;"">Đơn giá</th>
              <th style=""padding: 12px; border-bottom: 2px solid #E5E7EB; color: #4B5563; font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; text-align: right;"">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {itemRowsBuilder}
          </tbody>
        </table>
      </td>
    </tr>

    <!-- Summary Details Table -->
    <tr>
      <td style=""padding: 0 40px 40px 40px;"">
        <table cellpadding=""0"" cellspacing=""0"" width=""100%"" style=""margin-top: 10px;"">
          <tr>
            <td width=""50%""></td>
            <td width=""50%"">
              <table cellpadding=""0"" cellspacing=""0"" width=""100%"">
                <tr>
                  <td style=""padding: 8px 0; color: #4B5563; font-size: 14px;"">Tạm tính</td>
                  <td style=""padding: 8px 0; text-align: right; color: #111827; font-weight: 600; font-size: 14px;"">{FormatCurrency(order.TotalAmount)}</td>
                </tr>
                <tr>
                  <td style=""padding: 8px 0; color: #4B5563; font-size: 14px;"">Phí vận chuyển</td>
                  <td style=""padding: 8px 0; text-align: right; color: #10B981; font-weight: 600; font-size: 14px;"">Miễn phí</td>
                </tr>
                <tr>
                  <td style=""padding: 16px 0 8px 0; border-top: 2px dashed #E5E7EB; color: #111827; font-weight: 700; font-size: 16px;"">Tổng thanh toán</td>
                  <td style=""padding: 16px 0 8px 0; border-top: 2px dashed #E5E7EB; text-align: right; color: #7C3AED; font-weight: 700; font-size: 20px;"">
                    {FormatCurrency(order.TotalAmount)}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Wool Cozy Footer -->
    <tr>
      <td style=""background-color: #FAF5FF; padding: 32px 40px; text-align: center; border-top: 1px solid #F3E8FF;"">
        <p style=""margin: 0; font-size: 14px; font-weight: 600; color: #7C3AED;"">🐑 Móc Len Bằng Tay Với Trọn Vẹn Tình Yêu</p>
        <p style=""margin: 8px 0 0 0; font-size: 12px; color: #6B7280; line-height: 1.6;"">
          Mỗi sản phẩm tại Tiệm Nhà Zịt được hoàn thiện hoàn toàn thủ công. Chân thành cảm ơn sự đồng hành và ủng hộ sản phẩm địa phương tinh xảo từ quý khách!
        </p>
        <div style=""margin-top: 20px; font-size: 11px; color: #9CA3AF; border-top: 1px solid #E9D5FF; padding-top: 16px;"">
          © {DateTime.UtcNow.Year} Tiệm Nhà Zịt Storefront. Bảo lưu mọi quyền.<br>
          Handmade Crafting Hub, Thành phố Hồ Chí Minh, Việt Nam.
        </div>
      </td>
    </tr>
  </table>
</body>
</html>";
        }
    }
}
