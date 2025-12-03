-- Function: fn_GetEmotionTrends
-- Returns aggregated emotion trends for a user over a specified number of days
-- Called by ReportsService.GetEmotionTrends() for the Reports Dashboard

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
);
GO
