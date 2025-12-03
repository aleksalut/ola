using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ola.Data;
using ola.DTOs.Reports;

namespace ola.Services
{
    public class ReportsService : IReportsService
    {
        private readonly ApplicationDbContext _db;
        private readonly ILogger<ReportsService> _logger;

        public ReportsService(ApplicationDbContext db, ILogger<ReportsService> logger)
        {
            _db = db;
            _logger = logger;
        }

        public async Task<UserStatisticsDto> GetUserStatistics(string userId)
        {
            try
            {
                var userIdParam = new SqlParameter("@UserId", userId);
                
                var results = await _db.Database
                    .SqlQueryRaw<UserStatisticsDto>(
                        "EXEC sp_GetUserStatistics @UserId",
                        userIdParam)
                    .ToListAsync();

                var stats = results.FirstOrDefault() ?? new UserStatisticsDto();
                
                // Add goal completion rate from SQL function
                stats.GoalCompletionRate = await GetGoalCompletionRate(userId);

                return stats;
            }
            catch (SqlException ex) when (ex.Message.Contains("sp_GetUserStatistics") || ex.Number == 2812)
            {
                _logger.LogWarning("sp_GetUserStatistics not found. Falling back to LINQ query. Run Update-Database to deploy SQL objects.");
                return await GetUserStatisticsFallback(userId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user statistics for user {UserId}", userId);
                return await GetUserStatisticsFallback(userId);
            }
        }

        private async Task<UserStatisticsDto> GetUserStatisticsFallback(string userId)
        {
            var stats = new UserStatisticsDto
            {
                TotalHabits = await _db.Habits.CountAsync(h => h.UserId == userId),
                TotalGoals = await _db.Goals.CountAsync(g => g.UserId == userId),
                CompletedGoals = await _db.Goals.CountAsync(g => g.UserId == userId && g.Status == Models.GoalStatus.Completed),
                InProgressGoals = await _db.Goals.CountAsync(g => g.UserId == userId && g.Status == Models.GoalStatus.InProgress),
                NotStartedGoals = await _db.Goals.CountAsync(g => g.UserId == userId && g.Status == Models.GoalStatus.NotStarted),
                TotalEmotionEntries = await _db.EmotionEntries.CountAsync(e => e.UserId == userId),
                TotalProgressEntries = await _db.DailyProgresses.CountAsync(p => p.UserId == userId),
                AvgProgress = await _db.DailyProgresses.Where(p => p.UserId == userId)
                    .Select(p => (double?)p.Value).AverageAsync() ?? 0
            };

            // Calculate goal completion rate using LINQ fallback
            if (stats.TotalGoals > 0)
            {
                stats.GoalCompletionRate = (decimal)stats.CompletedGoals / stats.TotalGoals * 100;
            }

            return stats;
        }

        public async Task<decimal> GetGoalCompletionRate(string userId)
        {
            try
            {
                var userIdParam = new SqlParameter("@UserId", userId);
                
                var result = await _db.Database
                    .SqlQueryRaw<decimal>(
                        "SELECT dbo.fn_GetGoalCompletionRate(@UserId) AS Value",
                        userIdParam)
                    .ToListAsync();

                return result.FirstOrDefault();
            }
            catch (SqlException ex) when (ex.Message.Contains("fn_GetGoalCompletionRate"))
            {
                _logger.LogWarning("fn_GetGoalCompletionRate not found. Falling back to LINQ query. Run Update-Database to deploy SQL objects.");
                return await GetGoalCompletionRateFallback(userId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting goal completion rate for user {UserId}", userId);
                return await GetGoalCompletionRateFallback(userId);
            }
        }

        private async Task<decimal> GetGoalCompletionRateFallback(string userId)
        {
            var total = await _db.Goals.CountAsync(g => g.UserId == userId);
            if (total == 0) return 0;

            var completed = await _db.Goals.CountAsync(g => g.UserId == userId && g.Status == Models.GoalStatus.Completed);
            return (decimal)completed / total * 100;
        }

        public async Task<List<HabitProgressDto>> GetHabitProgress(string userId, int habitId)
        {
            try
            {
                var progressList = await _db.DailyProgresses
                    .Where(p => p.UserId == userId && p.HabitId == habitId)
                    .OrderBy(p => p.Date)
                    .Select(p => new HabitProgressDto
                    {
                        Date = p.Date,
                        Value = p.Value
                    })
                    .ToListAsync();

                return progressList;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting habit progress for user {UserId}, habit {HabitId}", userId, habitId);
                return new List<HabitProgressDto>();
            }
        }

        public async Task<List<EmotionTrendDto>> GetEmotionTrends(string userId, int days)
        {
            try
            {
                var cutoffDate = DateTime.UtcNow.AddDays(-days);
                
                var trends = await _db.EmotionEntries
                    .Where(e => e.UserId == userId && e.CreatedAt >= cutoffDate)
                    .GroupBy(e => e.CreatedAt.Date)
                    .Select(g => new EmotionTrendDto
                    {
                        Date = g.Key,
                        AvgAnxiety = g.Average(e => e.Anxiety ?? 0),
                        AvgCalmness = g.Average(e => e.Calmness ?? 0),
                        AvgJoy = g.Average(e => e.Joy ?? 0),
                        AvgAnger = g.Average(e => e.Anger ?? 0),
                        AvgBoredom = g.Average(e => e.Boredom ?? 0)
                    })
                    .OrderBy(t => t.Date)
                    .ToListAsync();

                return trends;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting emotion trends for user {UserId}", userId);
                return new List<EmotionTrendDto>();
            }
        }
    }
}
