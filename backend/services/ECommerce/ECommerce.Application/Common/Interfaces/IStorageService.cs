using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace ECommerce.Application.Common.Interfaces
{
    public interface IStorageService
    {
        Task<string> UploadFileAsync(Stream fileStream, string fileName, string contentType, CancellationToken cancellationToken);
    }
}
