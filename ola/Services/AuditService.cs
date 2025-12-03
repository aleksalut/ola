using System.Text.Json;
using ola.Data;
using ola.Models;

namespace ola.Services
{
    public class AuditService : IAuditService
    {
        private readonly ApplicationDbContext _db;

        public AuditService(ApplicationDbContext db)
        {
            _db = db;
        }

        public async Task LogAction(string userId, string action, string entityType, int entityId, object? details = null)
        {
            var log = new AuditLog
            {
                UserId = userId,
                Action = action,
                EntityType = entityType,
                EntityId = entityId,
                Timestamp = DateTime.UtcNow,
                Details = details != null 
                    ? JsonSerializer.Serialize(details)
                    : null
            };

            _db.AuditLogs.Add(log);
            await _db.SaveChangesAsync();
        }
    }
}
