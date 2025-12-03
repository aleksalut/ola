using ola.DTOs.Reports;

namespace ola.Services
{
    public interface IReportsService
    {
        Task<UserStatisticsDto> GetUserStatistics(string userId);
        Task<decimal> GetGoalCompletionRate(string userId);
        Task<List<HabitProgressDto>> GetHabitProgress(string userId, int habitId);
        Task<List<EmotionTrendDto>> GetEmotionTrends(string userId, int days);
    }
}
