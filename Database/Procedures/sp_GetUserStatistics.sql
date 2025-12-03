CREATE PROCEDURE sp_GetUserStatistics
    @UserId NVARCHAR(450)
AS
BEGIN
    SELECT 
        (SELECT COUNT(*) FROM Habits WHERE UserId = @UserId) AS TotalHabits,
        (SELECT COUNT(*) FROM Goals WHERE UserId = @UserId) AS TotalGoals,
        (SELECT COUNT(*) FROM Goals WHERE UserId = @UserId AND Status = 2) AS CompletedGoals,
        (SELECT COUNT(*) FROM Goals WHERE UserId = @UserId AND Status = 1) AS InProgressGoals,
        (SELECT COUNT(*) FROM Goals WHERE UserId = @UserId AND Status = 0) AS NotStartedGoals,
        (SELECT COUNT(*) FROM EmotionEntries WHERE UserId = @UserId) AS TotalEmotionEntries,
        (SELECT COUNT(*) FROM DailyProgresses WHERE UserId = @UserId) AS TotalProgressEntries,
        (SELECT AVG(CAST(Value AS FLOAT)) FROM DailyProgresses WHERE UserId = @UserId) AS AvgProgress
END;
