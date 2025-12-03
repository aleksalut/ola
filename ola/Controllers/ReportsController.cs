using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ola.Data;
using ola.DTOs.Reports;
using ola.Services;
using System.Security.Claims;
using System.Text;
using System.Text.Json;

namespace ola.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ReportsController : ControllerBase
    {
        private readonly IReportsService _reportsService;
        private readonly ApplicationDbContext _db;

        public ReportsController(IReportsService reportsService, ApplicationDbContext db)
        {
            _reportsService = reportsService;
            _db = db;
        }

        private string GetUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;

        /// <summary>
        /// GET /api/reports/my-statistics
        /// Returns user statistics by calling stored procedure sp_GetUserStatistics
        /// Includes goal completion rate from SQL function fn_GetGoalCompletionRate
        /// </summary>
        [HttpGet("my-statistics")]
        public async Task<ActionResult<UserStatisticsDto>> GetMyStatistics()
        {
            var userId = GetUserId();
            if (string.IsNullOrWhiteSpace(userId))
            {
                return Unauthorized(new { error = "User not authenticated" });
            }

            var statistics = await _reportsService.GetUserStatistics(userId);
            return Ok(statistics);
        }

        /// <summary>
        /// GET /api/reports/completion-rate
        /// Returns goal completion rate for the authenticated user using SQL function
        /// </summary>
        [HttpGet("completion-rate")]
        public async Task<IActionResult> GetCompletionRate()
        {
            var userId = GetUserId();
            if (string.IsNullOrWhiteSpace(userId))
            {
                return Unauthorized(new { error = "User not authenticated" });
            }

            var rate = await _reportsService.GetGoalCompletionRate(userId);
            return Ok(new { completionRate = rate });
        }

        /// <summary>
        /// GET /api/reports/habit-progress/{habitId}
        /// Returns ordered list of daily progress for a specific habit
        /// </summary>
        [HttpGet("habit-progress/{habitId}")]
        public async Task<ActionResult<List<HabitProgressDto>>> GetHabitProgress(int habitId)
        {
            var userId = GetUserId();
            if (string.IsNullOrWhiteSpace(userId))
            {
                return Unauthorized(new { error = "User not authenticated" });
            }

            var progressList = await _reportsService.GetHabitProgress(userId, habitId);
            return Ok(progressList);
        }

        /// <summary>
        /// GET /api/reports/emotion-trends?days=30
        /// Returns emotion trends grouped by day with averages for each emotion scale
        /// </summary>
        [HttpGet("emotion-trends")]
        public async Task<ActionResult<List<EmotionTrendDto>>> GetEmotionTrends([FromQuery] int days = 30)
        {
            var userId = GetUserId();
            if (string.IsNullOrWhiteSpace(userId))
            {
                return Unauthorized(new { error = "User not authenticated" });
            }

            if (days <= 0 || days > 365)
            {
                return BadRequest(new { error = "Days parameter must be between 1 and 365" });
            }

            var trends = await _reportsService.GetEmotionTrends(userId, days);
            return Ok(trends);
        }

        /// <summary>
        /// GET /api/reports/export/json
        /// Exports all user data as JSON
        /// </summary>
        [HttpGet("export/json")]
        public async Task<IActionResult> ExportJson()
        {
            var userId = GetUserId();

            var data = new
            {
                Habits = await _db.Habits
                    .Where(h => h.UserId == userId)
                    .ToListAsync(),

                DailyProgress = await _db.DailyProgresses
                    .Where(p => p.UserId == userId)
                    .ToListAsync(),

                Goals = await _db.Goals
                    .Where(g => g.UserId == userId)
                    .ToListAsync(),

                EmotionEntries = await _db.EmotionEntries
                    .Where(e => e.UserId == userId)
                    .ToListAsync()
            };

            var json = JsonSerializer.Serialize(data, new JsonSerializerOptions
            {
                WriteIndented = true
            });

            return File(
                Encoding.UTF8.GetBytes(json),
                "application/json",
                "export.json"
            );
        }

        /// <summary>
        /// GET /api/reports/export/csv
        /// Exports all user data as CSV
        /// </summary>
        [HttpGet("export/csv")]
        public async Task<IActionResult> ExportCsv()
        {
            var userId = GetUserId();

            var habits = await _db.Habits
                .Where(h => h.UserId == userId)
                .ToListAsync();

            var progress = await _db.DailyProgresses
                .Where(p => p.UserId == userId)
                .ToListAsync();

            var goals = await _db.Goals
                .Where(g => g.UserId == userId)
                .ToListAsync();

            var emotions = await _db.EmotionEntries
                .Where(e => e.UserId == userId)
                .ToListAsync();

            var sb = new StringBuilder();

            sb.AppendLine("=== HABITS ===");
            sb.AppendLine("Id,Name,Description,Created");
            foreach (var h in habits)
                sb.AppendLine($"{h.Id},{h.Name},{h.Description},{h.Created}");

            sb.AppendLine();
            sb.AppendLine("=== DAILY PROGRESS ===");
            sb.AppendLine("Id,HabitId,Date,Value");
            foreach (var p in progress)
                sb.AppendLine($"{p.Id},{p.HabitId},{p.Date},{p.Value}");

            sb.AppendLine();
            sb.AppendLine("=== GOALS ===");
            sb.AppendLine("Id,Title,Description,Deadline,Priority,Status,ProgressPercentage,CreatedAt,UpdatedAt");
            foreach (var g in goals)
                sb.AppendLine(
                    $"{g.Id},{g.Title},{g.Description},{g.Deadline},{g.Priority},{g.Status},{g.ProgressPercentage},{g.CreatedAt},{g.UpdatedAt}");

            sb.AppendLine();
            sb.AppendLine("=== EMOTION ENTRIES ===");
            sb.AppendLine("Id,CreatedAt,Text,Anxiety,Calmness,Joy,Anger,Boredom");
            foreach (var e in emotions)
                sb.AppendLine(
                    $"{e.Id},{e.CreatedAt},{e.Text},{e.Anxiety},{e.Calmness},{e.Joy},{e.Anger},{e.Boredom}");

            return File(
                Encoding.UTF8.GetBytes(sb.ToString()),
                "text/csv",
                "export.csv"
            );
        }
    }
}
