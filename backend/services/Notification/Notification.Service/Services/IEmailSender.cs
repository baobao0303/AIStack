using System.Threading.Tasks;
using Notification.Service.Models;

namespace Notification.Service.Services
{
    public interface IEmailSender
    {
        Task SendInvoiceEmailAsync(Order order);
    }
}
