CREATE FUNCTION fn_GetGoalCompletionRate(@UserId NVARCHAR(450))
RETURNS DECIMAL(5,2)
AS
BEGIN
    DECLARE @Total INT, @Completed INT, @Rate DECIMAL(5,2);

    SELECT @Total = COUNT(*) FROM Goals WHERE UserId = @UserId;
    SELECT @Completed = COUNT(*) FROM Goals WHERE UserId = @UserId AND Status = 2;

    IF @Total = 0 
        SET @Rate = 0;
    ELSE
        SET @Rate = CAST(@Completed AS DECIMAL) / @Total * 100;

    RETURN @Rate;
END;
