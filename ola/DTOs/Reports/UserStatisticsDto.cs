namespace ola.DTOs.Reports
{
    public class UserStatisticsDto
    {
        public int TotalHabits { get; set; }
        public int TotalGoals { get; set; }
        public int CompletedGoals { get; set; }
        public int InProgressGoals { get; set; }
        public int NotStartedGoals { get; set; }
        public int TotalProgressEntries { get; set; }
        public double AvgProgress { get; set; }
        public int TotalEmotionEntries { get; set; }
        public decimal GoalCompletionRate { get; set; }
    }
}
