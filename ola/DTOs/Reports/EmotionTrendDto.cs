namespace ola.DTOs.Reports
{
    public class EmotionTrendDto
    {
        public DateTime Date { get; set; }
        public double AvgAnxiety { get; set; }
        public double AvgCalmness { get; set; }
        public double AvgJoy { get; set; }
        public double AvgAnger { get; set; }
        public double AvgBoredom { get; set; }
    }
}
