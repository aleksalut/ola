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
    public class EmotionEntriesController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private readonly UserManager<ApplicationUser> _userManager;
        public EmotionEntriesController(ApplicationDbContext db, UserManager<ApplicationUser> userManager)
        {
            _db = db;
            _userManager = userManager;
        }
        private string GetUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;

        public class EmotionCreateRequest
        {
            [Required]
            public DateTime Date { get; set; } = DateTime.UtcNow;
            [Required]
            [StringLength(50)]
            public string Emotion { get; set; } = string.Empty;
            [Required]
            [Range(0,10)]
            public int Intensity { get; set; }
            [StringLength(1000)]
            public string? Note { get; set; }
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var userId = GetUserId();
            var entries = await _db.EmotionEntries.Where(e => e.UserId == userId).OrderByDescending(e => e.Date).ToListAsync();
            return Ok(entries);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var userId = GetUserId();
            var entry = await _db.EmotionEntries.FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);
            if (entry == null) return NotFound(new { error = "Emotion entry not found" });
            return Ok(entry);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] EmotionCreateRequest req)
        {
            if (!ModelState.IsValid) return BadRequest(new { error = "Invalid data" });
            var userId = GetUserId();
            if (string.IsNullOrWhiteSpace(userId)) return Unauthorized(new { error = "Unauthorized" });
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return Unauthorized(new { error = "User not found" });
            var entry = new EmotionEntry
            {
                Date = req.Date,
                Emotion = req.Emotion,
                Intensity = req.Intensity,
                Note = req.Note,
                UserId = userId
            };
            _db.EmotionEntries.Add(entry);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = entry.Id }, entry);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] EmotionEntry update)
        {
            if (!ModelState.IsValid) return BadRequest(new { error = "Invalid data" });
            var userId = GetUserId();
            var entry = await _db.EmotionEntries.FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);
            if (entry == null) return NotFound(new { error = "Emotion entry not found" });

            entry.Date = update.Date;
            entry.Emotion = update.Emotion;
            entry.Intensity = update.Intensity;
            entry.Note = update.Note;
            await _db.SaveChangesAsync();
            return Ok(entry);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = GetUserId();
            var entry = await _db.EmotionEntries.FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);
            if (entry == null) return NotFound(new { error = "Emotion entry not found" });
            _db.EmotionEntries.Remove(entry);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
