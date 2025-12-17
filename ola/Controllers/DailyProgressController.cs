using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ola.Data;
using ola.Models;
using ola.Services;
using System.Security.Claims;

namespace ola.Controllers
{
    [ApiController]
    [Route("api/progress")]
    [Authorize]
    public class DailyProgressController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IAuditService _auditService;
        public DailyProgressController(ApplicationDbContext db, UserManager<ApplicationUser> userManager, IAuditService auditService)
        {
            _db = db;
            _userManager = userManager;
            _auditService = auditService;
        }
        private string GetUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;

        public class AddProgressRequest
        {
            public int HabitId { get; set; }
            public DateTime Date { get; set; }
            public int Value { get; set; }
        }

        // POST /api/progress
        [HttpPost]
        public async Task<IActionResult> AddProgress([FromBody] AddProgressRequest req)
        {
            if (!ModelState.IsValid) return BadRequest(new { error = "Invalid data" });
            var userId = GetUserId();
            var habit = await _db.Habits.FirstOrDefaultAsync(h => h.Id == req.HabitId && h.UserId == userId);
            if (habit == null) return NotFound(new { error = "Habit not found" });
            var progress = new DailyProgress
            {
                HabitId = req.HabitId,
                UserId = userId,
                Date = req.Date.Date,
                Value = req.Value
            };
            _db.DailyProgresses.Add(progress);
            await _db.SaveChangesAsync();
            await _auditService.LogAction(
                userId,
                "AddDailyProgress",
                "DailyProgress",
                progress.Id,
                new { req.HabitId, req.Date, req.Value }
            );
            return Ok(progress);
        }

        // Standard CRUD (even if list is via HabitsController)
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var userId = GetUserId();
            var progress = await _db.DailyProgresses.FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);
            if (progress == null) return NotFound(new { error = "Progress not found" });
            return Ok(progress);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] DailyProgress update)
        {
            if (!ModelState.IsValid) return BadRequest(new { error = "Invalid data" });
            var userId = GetUserId();
            var progress = await _db.DailyProgresses.FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);
            if (progress == null) return NotFound(new { error = "Progress not found" });

            if (progress.HabitId != update.HabitId)
                return BadRequest(new { error = "Cannot change HabitId" });

            progress.Date = update.Date.Date;
            progress.Value = update.Value;
            await _db.SaveChangesAsync();
            await _auditService.LogAction(
                userId,
                "UpdateDailyProgress",
                "DailyProgress",
                progress.Id,
                new { update.Date, update.Value }
            );
            return Ok(progress);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = GetUserId();
            var progress = await _db.DailyProgresses.FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);
            if (progress == null) return NotFound(new { error = "Progress not found" });
            _db.DailyProgresses.Remove(progress);
            await _db.SaveChangesAsync();
            await _auditService.LogAction(
                userId,
                "DeleteDailyProgress",
                "DailyProgress",
                id,
                null
            );
            return NoContent();
        }
    }
}
