using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ola.Migrations
{
    /// <inheritdoc />
    public partial class AddDatabaseObjectsDeployment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Create Stored Procedure: sp_GetUserStatistics
            migrationBuilder.Sql(@"
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
            ");

            // Create Stored Procedure: sp_ArchiveCompletedGoals
            migrationBuilder.Sql(@"
                CREATE OR ALTER PROCEDURE sp_ArchiveCompletedGoals
                    @DaysOld INT = 60
                AS
                BEGIN
                    UPDATE Goals
                    SET Status = 3  -- Archived
                    WHERE Status = 2  -- Completed
                      AND DATEDIFF(DAY, UpdatedAt, GETDATE()) >= @DaysOld;
                END
            ");

            // Create Function: fn_GetGoalCompletionRate
            migrationBuilder.Sql(@"
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
            ");

            // Create Function: fn_GetHabitStreak
            migrationBuilder.Sql(@"
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
            ");

            // Create Trigger: trg_AutoCompleteGoal
                migrationBuilder.Sql(@"
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
                ");

                // Create Function: fn_GetEmotionTrends (table-valued function for emotion trends)
                migrationBuilder.Sql(@"
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
                ");
            }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Drop Trigger
            migrationBuilder.Sql("DROP TRIGGER IF EXISTS trg_AutoCompleteGoal;");

            // Drop Stored Procedures
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS sp_GetUserStatistics;");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS sp_ArchiveCompletedGoals;");

            // Drop Functions
            migrationBuilder.Sql("DROP FUNCTION IF EXISTS fn_GetGoalCompletionRate;");
            migrationBuilder.Sql("DROP FUNCTION IF EXISTS fn_GetHabitStreak;");
            migrationBuilder.Sql("DROP FUNCTION IF EXISTS fn_GetEmotionTrends;");
        }
    }
}
