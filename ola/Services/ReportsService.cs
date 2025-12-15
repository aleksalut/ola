using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using ola.Data;
using ola.DTOs.Reports;

namespace ola.Services
{
    public class ReportsService : IReportsService
    {
        private readonly ApplicationDbContext _db;

        public ReportsService(ApplicationDbContext db)
        {
            _db = db;
        }

        public async Task<UserStatisticsDto> GetUserStatistics(string userId)
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

        public async Task<decimal> GetGoalCompletionRate(string userId)
        {
            var userIdParam = new SqlParameter("@UserId", userId);
            
            var result = await _db.Database
                .SqlQueryRaw<decimal>(
                    "SELECT dbo.fn_GetGoalCompletionRate(@UserId) AS Value",
                    userIdParam)
                .ToListAsync();

            return result.FirstOrDefault();
        }

        public async Task<List<HabitProgressDto>> GetHabitProgress(string userId, int habitId)
        {
            var userIdParam = new SqlParameter("@UserId", userId);
            var habitIdParam = new SqlParameter("@HabitId", habitId);

            var progressList = await _db.Database
                .SqlQueryRaw<HabitProgressDto>(
                    @"SELECT Date, Value 
                      FROM DailyProgresses 
                      WHERE UserId = @UserId AND HabitId = @HabitId 
                      ORDER BY Date",
                    userIdParam, habitIdParam)
                .ToListAsync();

            return progressList;
        }

        public async Task<List<EmotionTrendDto>> GetEmotionTrends(string userId, int days)
        {
            var userIdParam = new SqlParameter("@UserId", userId);
            var daysParam = new SqlParameter("@Days", days);

            var trends = await _db.Database
                .SqlQueryRaw<EmotionTrendDto>(
                    @"SELECT 
                        CAST(CreatedAt AS DATE) AS Date,
                        AVG(CAST(ISNULL(Anxiety, 0) AS FLOAT)) AS AvgAnxiety,
                        AVG(CAST(ISNULL(Calmness, 0) AS FLOAT)) AS AvgCalmness,
                        AVG(CAST(ISNULL(Joy, 0) AS FLOAT)) AS AvgJoy,
                        AVG(CAST(ISNULL(Anger, 0) AS FLOAT)) AS AvgAnger,
                        AVG(CAST(ISNULL(Boredom, 0) AS FLOAT)) AS AvgBoredom
                      FROM EmotionEntries
                      WHERE UserId = @UserId 
                        AND CreatedAt >= DATEADD(DAY, -@Days, GETDATE())
                      GROUP BY CAST(CreatedAt AS DATE)
                      ORDER BY CAST(CreatedAt AS DATE)",
                    userIdParam, daysParam)
                .ToListAsync();

            return trends;
        }
    }
}
