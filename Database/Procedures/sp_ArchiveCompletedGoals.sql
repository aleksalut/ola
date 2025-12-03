CREATE PROCEDURE sp_ArchiveCompletedGoals
    @DaysOld INT = 90
AS
BEGIN
    UPDATE Goals
    SET Status = 3
    WHERE Status = 2 
      AND DATEDIFF(DAY, UpdatedAt, GETDATE()) > @DaysOld;
END;
