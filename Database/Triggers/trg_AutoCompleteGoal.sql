CREATE TRIGGER trg_AutoCompleteGoal
ON Goals
AFTER UPDATE
AS
BEGIN
    UPDATE Goals
    SET Status = 2
    WHERE Id IN (
        SELECT Id FROM inserted 
        WHERE ProgressPercentage >= 100 AND Status != 2
    );

    UPDATE Goals
    SET Status = 1
    WHERE Id IN (
        SELECT Id FROM inserted
        WHERE ProgressPercentage > 0 AND ProgressPercentage < 100 AND Status = 0
    );
END;
