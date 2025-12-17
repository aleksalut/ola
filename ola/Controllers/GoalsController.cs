using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ola.Data;
using ola.Models;
using ola.Services;
using System.Security.Claims;
using System.ComponentModel.DataAnnotations;

namespace ola.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class GoalsController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IAuditService _auditService;
        public GoalsController(ApplicationDbContext db, UserManager<ApplicationUser> userManager, IAuditService auditService)
        {
            _db = db;
            _userManager = userManager;
            _auditService = auditService;
        }
        private string GetUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;

        public class GoalCreateRequest
        {
            [Required]
            [StringLength(200)]
            public string Title { get; set; } = string.Empty;
            [StringLength(2000)]
            public string? Description { get; set; }
            [Required]
            [StringLength(1000)]
            public string WhyReason { get; set; } = string.Empty;
            public DateTime? Deadline { get; set; }
            [Required]
            public GoalPriority Priority { get; set; } = GoalPriority.Medium;
        }

        public class GoalUpdateRequest
        {
            [Required]
            [StringLength(200)]
            public string Title { get; set; } = string.Empty;
            [StringLength(2000)]
            public string? Description { get; set; }
            [Required]
            [StringLength(1000)]
            public string WhyReason { get; set; } = string.Empty;
            public DateTime? Deadline { get; set; }
            [Required]
            public GoalPriority Priority { get; set; } = GoalPriority.Medium;
            [Required]
            public GoalStatus Status { get; set; } = GoalStatus.NotStarted;
        }

        public class GoalProgressUpdateRequest
        {
            [Required]
            public int GoalId { get; set; }
            [Range(0,100)]
            public int Progress { get; set; }
        }

        public class GoalStatusUpdateRequest
        {
            [Required]
            public int GoalId { get; set; }
            [Required]
            public GoalStatus Status { get; set; }
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var userId = GetUserId();
            var goals = await _db.Goals.Where(g => g.UserId == userId).ToListAsync();
            return Ok(goals);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var userId = GetUserId();
            var goal = await _db.Goals.FirstOrDefaultAsync(g => g.Id == id && g.UserId == userId);
            if (goal == null) return NotFound(new { error = "Goal not found" });
            return Ok(goal);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] GoalCreateRequest req)
        {
            if (!ModelState.IsValid) return BadRequest(new { error = "Invalid data" });
            var userId = GetUserId();
            if (string.IsNullOrWhiteSpace(userId)) return Unauthorized(new { error = "Unauthorized" });
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return Unauthorized(new { error = "User not found" });
            var goal = new Goal
            {
                Title = req.Title,
                Description = req.Description,
                WhyReason = req.WhyReason,
                Deadline = req.Deadline,
                Priority = req.Priority,
                Status = GoalStatus.NotStarted,
                ProgressPercentage = 0,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                UserId = userId
            };
            _db.Goals.Add(goal);
            await _db.SaveChangesAsync();
            await _auditService.LogAction(
                userId,
                "CreateGoal",
                "Goal",
                goal.Id,
                new { goal.Title, goal.Priority, goal.Deadline }
            );
            return CreatedAtAction(nameof(GetById), new { id = goal.Id }, goal);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] GoalUpdateRequest update)
        {
            if (!ModelState.IsValid) return BadRequest(new { error = "Invalid data" });
            var userId = GetUserId();
            if (string.IsNullOrWhiteSpace(userId)) return Unauthorized(new { error = "Unauthorized" });
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return Unauthorized(new { error = "User not found" });
            var goal = await _db.Goals.FirstOrDefaultAsync(g => g.Id == id && g.UserId == userId);
            if (goal == null) return NotFound(new { error = "Goal not found" });

            goal.Title = update.Title;
            goal.Description = update.Description;
            goal.WhyReason = update.WhyReason;
            goal.Deadline = update.Deadline;
            goal.Priority = update.Priority;
            goal.Status = update.Status;
            goal.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            await _auditService.LogAction(
                userId,
                "UpdateGoal",
                "Goal",
                goal.Id,
                new { update.Title, update.Priority, update.Status }
            );
            return Ok(goal);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = GetUserId();
            var goal = await _db.Goals.FirstOrDefaultAsync(g => g.Id == id && g.UserId == userId);
            if (goal == null) return NotFound(new { error = "Goal not found" });
            _db.Goals.Remove(goal);
            await _db.SaveChangesAsync();
            await _auditService.LogAction(
                userId,
                "DeleteGoal",
                "Goal",
                id,
                null
            );
            return NoContent();
        }

        [HttpPatch("{id}/progress")]
        public async Task<IActionResult> UpdateProgress(int id, [FromBody] GoalProgressUpdateRequest req)
        {
            if (!ModelState.IsValid) return BadRequest(new { error = "Invalid data" });
            var userId = GetUserId();
            var goal = await _db.Goals.FirstOrDefaultAsync(g => g.Id == id && g.UserId == userId);
            if (goal == null) return NotFound(new { error = "Goal not found" });
            var pct = Math.Clamp(req.Progress, 0, 100);
            goal.ProgressPercentage = pct;
            goal.Status = pct == 100 ? GoalStatus.Completed : goal.Status;
            goal.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            await _auditService.LogAction(
                userId,
                "UpdateGoalProgress",
                "Goal",
                goal.Id,
                new { req.Progress }
            );
            return Ok(goal);
        }

        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] GoalStatusUpdateRequest req)
        {
            if (!ModelState.IsValid) return BadRequest(new { error = "Invalid data" });
            var userId = GetUserId();
            var goal = await _db.Goals.FirstOrDefaultAsync(g => g.Id == id && g.UserId == userId);
            if (goal == null) return NotFound(new { error = "Goal not found" });
            goal.Status = req.Status;
            goal.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            await _auditService.LogAction(
                userId,
                "UpdateGoalStatus",
                "Goal",
                goal.Id,
                new { req.Status }
            );
            return Ok(goal);
        }
    }
}
