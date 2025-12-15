using ola.Models;

namespace ola.Services
{
    public interface IAuditService
    {
        Task LogAction(string userId, string action, string entityType, int entityId, object? details = null);
    }
}
