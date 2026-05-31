using System.Threading;
using System.Threading.Tasks;

namespace ECommerce.Application.Common.Interfaces
{
    public interface IOutboxService
    {
        Task StageEventAsync<T>(T domainEvent, CancellationToken cancellationToken) where T : class;
    }
}
