using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ola.Data;
using ola.Models;
using System.Security.Claims;
using System.ComponentModel.DataAnnotations;

namespace ola.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class HabitsController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private readonly UserManager<ApplicationUser> _userManager;

        public HabitsController(ApplicationDbContext db, UserManager<ApplicationUser> userManager)
        {
            _db = db;
            _userManager = userManager;
        }

        private string GetUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;

        public class HabitCreateRequest
        {
            [Required]
            [StringLength(100)]
            public string Name { get; set; } = string.Empty;
            [StringLength(500)]
            public string? Description { get; set; }
        }

        public class HabitUpdateRequest
        {
            [Required]
            [StringLength(100)]
            public string Name { get; set; } = string.Empty;
            [StringLength(500)]
            public string? Description { get; set; }
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var userId = GetUserId();
            var habits = await _db.Habits.Where(h => h.UserId == userId).ToListAsync();
            return Ok(habits);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var userId = GetUserId();
            var habit = await _db.Habits.FirstOrDefaultAsync(h => h.Id == id && h.UserId == userId);
            if (habit == null) return NotFound(new { error = "Habit not found" });
            return Ok(habit);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] HabitCreateRequest req)
        {
            if (!ModelState.IsValid) return BadRequest(new { error = "Invalid data" });
            var userId = GetUserId();
            if (string.IsNullOrWhiteSpace(userId)) return Unauthorized(new { error = "Unauthorized" });
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return Unauthorized(new { error = "User not found" });
            var habit = new Habit
            {
                Name = req.Name,
                Description = req.Description,
                UserId = userId,
                Created = DateTime.UtcNow
            };
            _db.Habits.Add(habit);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = habit.Id }, habit);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] HabitUpdateRequest update)
        {
            if (!ModelState.IsValid) return BadRequest(new { error = "Invalid data" });
            var userId = GetUserId();
            if (string.IsNullOrWhiteSpace(userId)) return Unauthorized(new { error = "Unauthorized" });
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return Unauthorized(new { error = "User not found" });
            var habit = await _db.Habits.FirstOrDefaultAsync(h => h.Id == id && h.UserId == userId);
            if (habit == null) return NotFound(new { error = "Habit not found" });

            habit.Name = update.Name;
            habit.Description = update.Description;
            await _db.SaveChangesAsync();
            return Ok(habit);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = GetUserId();
            var habit = await _db.Habits.FirstOrDefaultAsync(h => h.Id == id && h.UserId == userId);
            if (habit == null) return NotFound(new { error = "Habit not found" });
            try
            {
                _db.Habits.Remove(habit);
                await _db.SaveChangesAsync();
                return NoContent();
            }
            catch (DbUpdateException ex) when (ex.InnerException is Microsoft.Data.SqlClient.SqlException sqlEx && sqlEx.Number == 547)
            {
                return Conflict(new { error = "Cannot delete habit due to related data." });
            }
        }

        // Additional logic: get progress list for a habit
        [HttpGet("{habitId}/progress")]
        public async Task<IActionResult> GetProgress(int habitId)
        {
            var userId = GetUserId();
            var habitExists = await _db.Habits.AnyAsync(h => h.Id == habitId && h.UserId == userId);
            if (!habitExists) return NotFound(new { error = "Habit not found" });

            var progress = await _db.DailyProgresses
                .Where(p => p.HabitId == habitId && p.UserId == userId)
                .OrderByDescending(p => p.Date)
                .ToListAsync();
            return Ok(progress);
        }

        public class AddProgressRequest
        {
            public int HabitId { get; set; }
            public DateTime Date { get; set; }
            public int Value { get; set; }
        }

        [HttpPost("progress")]
        public async Task<IActionResult> AddProgress([FromBody] AddProgressRequest req)
        {
            var userId = GetUserId();
            var habit = await _db.Habits.FirstOrDefaultAsync(h => h.Id == req.HabitId && h.UserId == userId);
            if (habit == null) return NotFound(new { error = "Habit not found" });
            var entry = new DailyProgress
            {
                HabitId = habit.Id,
                UserId = userId,
                Date = req.Date.Date,
                Value = req.Value
            };
            _db.DailyProgresses.Add(entry);
            await _db.SaveChangesAsync();
            return Ok(entry);
        }

        [HttpPost("/api/progress")]
        public async Task<IActionResult> AddProgressAbsolute([FromBody] AddProgressRequest req)
        {
            return await AddProgress(req);
        }
    }
}
