-- =====================================================
-- CONSOLIDATED SQL OBJECTS DEPLOYMENT SCRIPT
-- =====================================================
-- This script contains all database objects required by the backend.
-- Run this script if objects are missing after running Update-Database.
-- 
-- Objects included:
-- - Stored Procedures: sp_GetUserStatistics, sp_ArchiveCompletedGoals
-- - Functions: fn_GetGoalCompletionRate, fn_GetHabitStreak, fn_GetEmotionTrends
-- - Triggers: trg_AutoCompleteGoal
--
-- DEPLOYMENT INSTRUCTIONS:
-- 1. Run 'Update-Database' in Package Manager Console (preferred)
-- 2. OR execute this script directly in SQL Server Management Studio
-- =====================================================

-- =====================================================
-- STORED PROCEDURE: sp_GetUserStatistics
-- Returns aggregated user statistics for Reports Dashboard
-- =====================================================
CREATE OR ALTER PROCEDURE sp_GetUserStatistics
    @UserId NVARCHAR(450)
AS
BEGIN
    SELECT
        (SELECT COUNT(*) FROM Habits WHERE UserId = @UserId) AS TotalHabits,
        (SELECT COUNT(*) FROM Goals WHERE UserId = @UserId) AS TotalGoals,
        (SELECT COUNT(*) FROM Goals WHERE UserId = @UserId AND Status = 2) AS CompletedGoals,
        (SELECT COUNT(*) FROM Goals WHERE UserId = @UserId AND Status = 1) AS InProgressGoals,
        (SELECT COUNT(*) FROM Goals WHERE UserId = @UserId AND Status = 0) AS NotStartedGoals,
        (SELECT COUNT(*) FROM DailyProgresses WHERE UserId = @UserId) AS TotalProgressEntries,
        (SELECT AVG(CAST(Value AS FLOAT)) FROM DailyProgresses WHERE UserId = @UserId) AS AvgProgress,
        (SELECT COUNT(*) FROM EmotionEntries WHERE UserId = @UserId) AS TotalEmotionEntries;
END
GO

-- =====================================================
-- STORED PROCEDURE: sp_ArchiveCompletedGoals
-- Archives goals that have been completed for a specified number of days
-- =====================================================
CREATE OR ALTER PROCEDURE sp_ArchiveCompletedGoals
    @DaysOld INT = 60
AS
BEGIN
    UPDATE Goals
    SET Status = 3  -- Archived
    WHERE Status = 2  -- Completed
      AND DATEDIFF(DAY, UpdatedAt, GETDATE()) >= @DaysOld;
END
GO

-- =====================================================
-- FUNCTION: fn_GetGoalCompletionRate
-- Returns the goal completion rate as a percentage for a user
-- =====================================================
CREATE OR ALTER FUNCTION fn_GetGoalCompletionRate(@UserId NVARCHAR(450))
RETURNS DECIMAL(5,2)
AS
BEGIN
    DECLARE @Total INT = (SELECT COUNT(*) FROM Goals WHERE UserId = @UserId);
    DECLARE @Completed INT = (SELECT COUNT(*) FROM Goals WHERE UserId = @UserId AND Status = 2);

    IF @Total = 0
        RETURN 0;

    RETURN (CAST(@Completed AS DECIMAL(5,2)) / @Total) * 100;
END
GO

-- =====================================================
-- FUNCTION: fn_GetHabitStreak
-- Returns the current streak (consecutive days) for a habit
-- =====================================================
CREATE OR ALTER FUNCTION fn_GetHabitStreak(@HabitId INT, @UserId NVARCHAR(450))
RETURNS INT
AS
BEGIN
    DECLARE @Streak INT = 0;

    ;WITH OrderedDays AS (
        SELECT Date, ROW_NUMBER() OVER (ORDER BY Date DESC) AS rn
        FROM DailyProgresses
        WHERE HabitId = @HabitId AND UserId = @UserId
    ),
    Expected AS (
        SELECT TOP (SELECT COUNT(*) FROM OrderedDays)
            DATEADD(DAY, -ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) + 1, 
                (SELECT MAX(Date) FROM OrderedDays)) AS Date,
            ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS rn
        FROM OrderedDays
    )
    SELECT @Streak = COUNT(*)
    FROM OrderedDays o
    JOIN Expected e ON o.rn = e.rn AND o.Date = e.Date;

    RETURN @Streak;
END
GO

-- =====================================================
-- FUNCTION: fn_GetEmotionTrends
-- Returns aggregated emotion trends for a user over specified days
-- =====================================================
CREATE OR ALTER FUNCTION fn_GetEmotionTrends(@UserId NVARCHAR(450), @Days INT)
RETURNS TABLE
AS
RETURN
(
    SELECT 
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
)
GO

-- =====================================================
-- TRIGGER: trg_AutoCompleteGoal
-- Automatically updates goal status based on progress percentage
-- =====================================================
CREATE OR ALTER TRIGGER trg_AutoCompleteGoal
ON Goals
AFTER UPDATE
AS
BEGIN
    -- Completed
    UPDATE Goals
    SET Status = 2
    WHERE Id IN (
        SELECT Id FROM inserted WHERE ProgressPercentage >= 100
    );

    -- In progress
    UPDATE Goals
    SET Status = 1
    WHERE Id IN (
        SELECT Id FROM inserted
        WHERE ProgressPercentage > 0 AND ProgressPercentage < 100
    );

    -- Not started
    UPDATE Goals
    SET Status = 0
    WHERE Id IN (
        SELECT Id FROM inserted WHERE ProgressPercentage = 0
    );
END
GO

-- =====================================================
-- VERIFICATION: Check that all objects exist
-- =====================================================
PRINT 'Verifying SQL objects...';

IF OBJECT_ID('sp_GetUserStatistics', 'P') IS NOT NULL
    PRINT '? sp_GetUserStatistics exists';
ELSE
    PRINT '? sp_GetUserStatistics is MISSING';

IF OBJECT_ID('sp_ArchiveCompletedGoals', 'P') IS NOT NULL
    PRINT '? sp_ArchiveCompletedGoals exists';
ELSE
    PRINT '? sp_ArchiveCompletedGoals is MISSING';

IF OBJECT_ID('fn_GetGoalCompletionRate', 'FN') IS NOT NULL
    PRINT '? fn_GetGoalCompletionRate exists';
ELSE
    PRINT '? fn_GetGoalCompletionRate is MISSING';

IF OBJECT_ID('fn_GetHabitStreak', 'FN') IS NOT NULL
    PRINT '? fn_GetHabitStreak exists';
ELSE
    PRINT '? fn_GetHabitStreak is MISSING';

IF OBJECT_ID('fn_GetEmotionTrends', 'IF') IS NOT NULL
    PRINT '? fn_GetEmotionTrends exists';
ELSE
    PRINT '? fn_GetEmotionTrends is MISSING';

IF OBJECT_ID('trg_AutoCompleteGoal', 'TR') IS NOT NULL
    PRINT '? trg_AutoCompleteGoal exists';
ELSE
    PRINT '? trg_AutoCompleteGoal is MISSING';

PRINT 'Verification complete.';
GO
