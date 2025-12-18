-- Personal Growth Database - Backup danych
-- Data utworzenia: 2025-12-18
-- Ten plik zawiera pełną strukturę i dane do zaimportowania

-- ============================================
-- STRUKTURA BAZY DANYCH
-- ============================================

-- Tabela: AspNetRoles
CREATE TABLE IF NOT EXISTS "AspNetRoles" (
    "Id" TEXT NOT NULL PRIMARY KEY,
    "Name" TEXT NULL,
    "NormalizedName" TEXT NULL,
    "ConcurrencyStamp" TEXT NULL
);

-- Tabela: AspNetUsers
CREATE TABLE IF NOT EXISTS "AspNetUsers" (
    "Id" TEXT NOT NULL PRIMARY KEY,
    "FirstName" TEXT NULL,
    "LastName" TEXT NULL,
    "FullName" TEXT NULL,
    "Bio" TEXT NULL,
    "UserName" TEXT NULL,
    "NormalizedUserName" TEXT NULL,
    "Email" TEXT NULL,
    "NormalizedEmail" TEXT NULL,
    "EmailConfirmed" INTEGER NOT NULL,
    "PasswordHash" TEXT NULL,
    "SecurityStamp" TEXT NULL,
    "ConcurrencyStamp" TEXT NULL,
    "PhoneNumber" TEXT NULL,
    "PhoneNumberConfirmed" INTEGER NOT NULL,
    "TwoFactorEnabled" INTEGER NOT NULL,
    "LockoutEnd" TEXT NULL,
    "LockoutEnabled" INTEGER NOT NULL,
    "AccessFailedCount" INTEGER NOT NULL
);

-- Tabela: Goals (Cele)
CREATE TABLE IF NOT EXISTS "Goals" (
    "Id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Title" TEXT NOT NULL,
    "Description" TEXT NULL,
    "WhyReason" TEXT NOT NULL,
    "Deadline" TEXT NULL,
    "Priority" INTEGER NOT NULL,
    "Status" INTEGER NOT NULL,
    "ProgressPercentage" INTEGER NOT NULL,
    "CreatedAt" TEXT NOT NULL,
    "UpdatedAt" TEXT NOT NULL,
    "UserId" TEXT NOT NULL,
    FOREIGN KEY ("UserId") REFERENCES "AspNetUsers" ("Id") ON DELETE RESTRICT
);

-- Tabela: Habits (Nawyki)
CREATE TABLE IF NOT EXISTS "Habits" (
    "Id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Name" TEXT NOT NULL,
    "Description" TEXT NULL,
    "Created" TEXT NOT NULL,
    "UserId" TEXT NOT NULL,
    FOREIGN KEY ("UserId") REFERENCES "AspNetUsers" ("Id") ON DELETE RESTRICT
);

-- Tabela: EmotionEntries (Wpisy emocji)
CREATE TABLE IF NOT EXISTS "EmotionEntries" (
    "Id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "CreatedAt" TEXT NOT NULL,
    "Text" TEXT NOT NULL,
    "Anxiety" INTEGER NULL,
    "Calmness" INTEGER NULL,
    "Joy" INTEGER NULL,
    "Anger" INTEGER NULL,
    "Boredom" INTEGER NULL,
    "Date" TEXT NOT NULL,
    "Emotion" TEXT NULL,
    "Intensity" INTEGER NULL,
    "Note" TEXT NULL,
    "UserId" TEXT NOT NULL,
    FOREIGN KEY ("UserId") REFERENCES "AspNetUsers" ("Id") ON DELETE RESTRICT
);

-- Tabela: DailyProgresses (Postęp dzienny)
CREATE TABLE IF NOT EXISTS "DailyProgresses" (
    "Id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "HabitId" INTEGER NOT NULL,
    "UserId" TEXT NOT NULL,
    "Date" TEXT NOT NULL,
    "Value" INTEGER NOT NULL,
    FOREIGN KEY ("UserId") REFERENCES "AspNetUsers" ("Id") ON DELETE RESTRICT,
    FOREIGN KEY ("HabitId") REFERENCES "Habits" ("Id") ON DELETE CASCADE
);

-- Tabela: AuditLogs (Logi audytowe)
CREATE TABLE IF NOT EXISTS "AuditLogs" (
    "Id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "UserId" TEXT NOT NULL,
    "Action" TEXT NOT NULL,
    "EntityType" TEXT NOT NULL,
    "EntityId" INTEGER NOT NULL,
    "Timestamp" TEXT NOT NULL,
    "Details" TEXT NULL,
    FOREIGN KEY ("UserId") REFERENCES "AspNetUsers" ("Id") ON DELETE RESTRICT
);

-- ============================================
-- DANE POCZĄTKOWE
-- ============================================

-- Role użytkowników
INSERT OR IGNORE INTO "AspNetRoles" ("Id", "ConcurrencyStamp", "Name", "NormalizedName")
VALUES 
    ('role-admin-001', 'role-admin-001', 'Admin', 'ADMIN'),
    ('role-user-001', 'role-user-001', 'User', 'USER');

-- Użytkownik testowy (Email: test@test.com, Hasło: Test@123)
INSERT OR IGNORE INTO "AspNetUsers" 
    ("Id", "AccessFailedCount", "Bio", "ConcurrencyStamp", "Email", "EmailConfirmed", 
     "FirstName", "FullName", "LastName", "LockoutEnabled", "LockoutEnd", 
     "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", 
     "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName")
VALUES 
    ('test-user-001', 0, NULL, 'test-stamp-001', 'test@test.com', 1, 
     'Test', 'Test User', 'User', 0, NULL, 
     'TEST@TEST.COM', 'TEST@TEST.COM', 
     'AQAAAAIAAYagAAAAEGpvZ1J8K9vL/wKP7lZx5xqV3JZaT7N8wN9gX1XhY2mF0K3pQ4lR6sT5uV8wX9yZ0A==', 
     NULL, 0, 'test-security-stamp', 0, 'test@test.com');

-- Przypisanie roli Admin do użytkownika testowego
INSERT OR IGNORE INTO "AspNetUserRoles" ("RoleId", "UserId")
VALUES ('role-admin-001', 'test-user-001');

-- Przykładowe cele
INSERT OR IGNORE INTO "Goals" 
    ("Id", "CreatedAt", "Deadline", "Description", "Priority", "ProgressPercentage", 
     "Status", "Title", "UpdatedAt", "UserId", "WhyReason")
VALUES 
    (1, '2024-01-15 00:00:00', '2025-03-31 00:00:00', 
     'Ukończyć podstawy C# i zbudować działającą aplikację', 2, 40, 1, 
     'Nauczyć się C#', '2024-12-10 00:00:00', 'test-user-001', 
     'Chcę rozwijać swoje umiejętności programistyczne'),
    
    (2, '2024-01-20 00:00:00', '2025-06-30 00:00:00', 
     'Praktykować uważność i dbać o dobre samopoczucie', 2, 70, 1, 
     'Poprawić zdrowie psychiczne', '2024-12-11 00:00:00', 'test-user-001', 
     'Zdrowie psychiczne jest fundamentem sukcesu'),
    
    (3, '2024-02-01 00:00:00', '2025-12-31 00:00:00', 
     'Utrzymać regularny plan ćwiczeń - 3 sesje tygodniowo', 1, 20, 1, 
     'Ćwiczenia 3x w tygodniu', '2024-12-05 00:00:00', 'test-user-001', 
     'Zdrowe ciało wspiera zdrowy umysł');

-- Przykładowe nawyki
INSERT OR IGNORE INTO "Habits" ("Id", "Created", "Description", "Name", "UserId")
VALUES 
    (1, '2024-01-10 00:00:00', 'Pić 8 szklanek wody dziennie', 'Pij wodę', 'test-user-001'),
    (2, '2024-01-10 00:00:00', 'Czytać co najmniej 20 minut każdego dnia', 'Czytaj 20 minut', 'test-user-001'),
    (3, '2024-01-10 00:00:00', 'Rozpocząć dzień od 10 minut rozciągania', 'Poranne rozciąganie', 'test-user-001');

-- Przykładowy postęp dzienny
INSERT OR IGNORE INTO "DailyProgresses" ("Id", "Date", "HabitId", "UserId", "Value")
VALUES 
    (1, '2024-12-10 00:00:00', 1, 'test-user-001', 80),
    (2, '2024-12-11 00:00:00', 1, 'test-user-001', 100),
    (3, '2024-12-12 00:00:00', 1, 'test-user-001', 75),
    (4, '2024-12-10 00:00:00', 2, 'test-user-001', 100),
    (5, '2024-12-11 00:00:00', 2, 'test-user-001', 90),
    (6, '2024-12-11 00:00:00', 3, 'test-user-001', 100),
    (7, '2024-12-12 00:00:00', 3, 'test-user-001', 100);

-- Przykładowe wpisy emocji
INSERT OR IGNORE INTO "EmotionEntries" 
    ("Id", "Anger", "Anxiety", "Boredom", "Calmness", "CreatedAt", "Date", 
     "Emotion", "Intensity", "Joy", "Note", "Text", "UserId")
VALUES 
    (1, 1, 4, 2, 2, '2024-12-10 10:30:00', '2024-12-10 10:30:00', 
     NULL, NULL, 2, NULL, 'Czuję się niespokojny, ale staram się zachować spokój.', 'test-user-001'),
    
    (2, 1, 1, 1, 4, '2024-12-11 14:15:00', '2024-12-11 14:15:00', 
     NULL, NULL, 5, NULL, 'Bardzo produktywny dzień, dużo radości.', 'test-user-001'),
    
    (3, 1, 2, 4, 3, '2024-12-12 16:45:00', '2024-12-12 16:45:00', 
     NULL, NULL, 2, NULL, 'Trochę znudzony i mało energii.', 'test-user-001');

-- ============================================
-- INDEKSY
-- ============================================

CREATE INDEX IF NOT EXISTS "IX_Goals_UserId_Status_Priority" ON "Goals" ("UserId", "Status", "Priority");
CREATE INDEX IF NOT EXISTS "IX_Habits_UserId_Name" ON "Habits" ("UserId", "Name");
CREATE INDEX IF NOT EXISTS "IX_EmotionEntries_UserId_Date" ON "EmotionEntries" ("UserId", "Date");
CREATE INDEX IF NOT EXISTS "IX_DailyProgresses_UserId_HabitId_Date" ON "DailyProgresses" ("UserId", "HabitId", "Date");
CREATE INDEX IF NOT EXISTS "IX_AuditLogs_UserId_Timestamp" ON "AuditLogs" ("UserId", "Timestamp");

-- ============================================
-- INFORMACJE O UŻYTKOWNIKACH
-- ============================================

-- Użytkownik testowy:
-- Email: test@test.com
-- Hasło: Test@123
-- Rola: Admin

-- UWAGA: Hasło jest zahashowane używając ASP.NET Core Identity
-- Aby utworzyć nowego użytkownika, użyj endpointu /api/auth/register
