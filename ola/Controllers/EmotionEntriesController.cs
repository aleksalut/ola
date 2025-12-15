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
    public class EmotionEntriesController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IAuditService _auditService;
        public EmotionEntriesController(ApplicationDbContext db, UserManager<ApplicationUser> userManager, IAuditService auditService)
        {
            _db = db;
            _userManager = userManager;
            _auditService = auditService;
        }
        private string GetUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;

        public class EmotionCreateRequest
        {
            [Required]
            [StringLength(2000)]
            public string Text { get; set; } = string.Empty;

            [Range(1, 5)]
            public int? Anxiety { get; set; }

            [Range(1, 5)]
            public int? Calmness { get; set; }

            [Range(1, 5)]
            public int? Joy { get; set; }

            [Range(1, 5)]
            public int? Anger { get; set; }

            [Range(1, 5)]
            public int? Boredom { get; set; }

            // Legacy fields for backward compatibility
            public DateTime? Date { get; set; }
            [StringLength(50)]
            public string? Emotion { get; set; }
            [Range(0,10)]
            public int? Intensity { get; set; }
            [StringLength(1000)]
            public string? Note { get; set; }
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var userId = GetUserId();
            var entries = await _db.EmotionEntries
                .Where(e => e.UserId == userId)
                .OrderByDescending(e => e.CreatedAt)
                .ToListAsync();
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
                Text = req.Text,
                CreatedAt = DateTime.UtcNow,
                Anxiety = req.Anxiety,
                Calmness = req.Calmness,
                Joy = req.Joy,
                Anger = req.Anger,
                Boredom = req.Boredom,
                // Legacy fields for backward compatibility
                Date = req.Date ?? DateTime.UtcNow,
                Emotion = req.Emotion,
                Intensity = req.Intensity,
                Note = req.Note,
                UserId = userId
            };
            
            _db.EmotionEntries.Add(entry);
            await _db.SaveChangesAsync();
            await _auditService.LogAction(
                userId,
                "CreateEmotionEntry",
                "EmotionEntry",
                entry.Id,
                new { entry.Text, entry.Anxiety, entry.Calmness, entry.Joy, entry.Anger, entry.Boredom }
            );
            return CreatedAtAction(nameof(GetById), new { id = entry.Id }, entry);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] EmotionCreateRequest req)
        {
            if (!ModelState.IsValid) return BadRequest(new { error = "Invalid data" });
            var userId = GetUserId();
            var entry = await _db.EmotionEntries.FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);
            if (entry == null) return NotFound(new { error = "Emotion entry not found" });

            // Update new fields
            entry.Text = req.Text;
            entry.Anxiety = req.Anxiety;
            entry.Calmness = req.Calmness;
            entry.Joy = req.Joy;
            entry.Anger = req.Anger;
            entry.Boredom = req.Boredom;
            
            // Update legacy fields if provided
            if (req.Date.HasValue) entry.Date = req.Date.Value;
            entry.Emotion = req.Emotion;
            entry.Intensity = req.Intensity;
            entry.Note = req.Note;
            
            await _db.SaveChangesAsync();
            await _auditService.LogAction(
                userId,
                "UpdateEmotionEntry",
                "EmotionEntry",
                entry.Id,
                new { req.Text, req.Anxiety, req.Calmness, req.Joy, req.Anger, req.Boredom }
            );
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
            await _auditService.LogAction(
                userId,
                "DeleteEmotionEntry",
                "EmotionEntry",
                id,
                null
            );
            return NoContent();
        }
    }
}
