CREATE FUNCTION fn_GetHabitStreak(@HabitId INT, @UserId NVARCHAR(450))
RETURNS INT
AS
BEGIN
    DECLARE @Streak INT = 0;

    ;WITH Days AS (
        SELECT Date
        FROM DailyProgresses
        WHERE HabitId = @HabitId AND UserId = @UserId
        ORDER BY Date DESC
    )
    SELECT @Streak = COUNT(*)
    FROM Days
    WHERE Date = CAST(DATEADD(DAY, -(ROW_NUMBER() OVER (ORDER BY Date DESC) - 1), GETDATE()) AS DATE);

    RETURN @Streak;
END;
