# ?? ERD Quick Reference Card

## ?? Fast Access

### View ERD Diagram
```
?? documentation/ERD.svg
```
**Open with:** Browser, VS Code, GitHub

### View DBML Schema
```
?? documentation/ERD.dbml
```
**Import to:** https://dbdiagram.io

### Read Documentation
```
?? README.md ? "Entity Relationship Diagram" section
```

---

## ??? Database Tables Summary

| # | Table | Purpose | Records | Key Fields |
|---|-------|---------|---------|------------|
| 1 | AspNetUsers | User accounts | Dynamic | Id, Email, UserName |
| 2 | Habits | User habits | Dynamic | Id, Name, UserId |
| 3 | DailyProgresses | Habit tracking | Dynamic | Id, HabitId, Date, Value |
| 4 | Goals | User goals | Dynamic | Id, Title, Status, UserId |
| 5 | EmotionEntries | Emotion journal | Dynamic | Id, Text, Anxiety, Joy, UserId |
| 6 | AuditLogs | Activity log | Dynamic | Id, Action, EntityType, UserId |
| 7 | AspNetRoles | System roles | 2 | Id, Name |
| 8 | AspNetUserRoles | User-role map | Dynamic | UserId, RoleId |

---

## ?? Relationships Cheat Sheet

```
User (1) ?? (N) Habits
User (1) ?? (N) Goals
User (1) ?? (N) EmotionEntries
User (1) ?? (N) DailyProgresses
User (1) ?? (N) AuditLogs

Habit (1) ?? (N) DailyProgresses [CASCADE DELETE]

User (M) ? (N) Roles [via AspNetUserRoles]
```

---

## ?? Color Legend

| Color | Meaning | Example |
|-------|---------|---------|
| ?? Yellow | Primary Key | Id [PK] |
| ?? Blue | Foreign Key | UserId [FK] |
| ? White | Regular Field | Name, Description |
| ?? Blue Header | Table Name | Habits, Goals |
| ? Gray Header | Junction Table | AspNetUserRoles |

---

## ?? Key Constraints

### Primary Keys (Auto-increment)
- `Habits.Id`, `Goals.Id`, `EmotionEntries.Id`
- `DailyProgresses.Id`, `AuditLogs.Id`

### Foreign Keys (Required)
- All tables ? `AspNetUsers.Id` (UserId)
- `DailyProgresses` ? `Habits.Id` (HabitId)

### Enums
- `GoalPriority`: Low=0, Medium=1, High=2
- `GoalStatus`: NotStarted=0, InProgress=1, Completed=2, Archived=3

---

## ?? Critical Indexes

```sql
-- Habits
IX_Habits_UserId_Name

-- Goals
IX_Goals_UserId_Status_Priority

-- EmotionEntries
IX_EmotionEntries_UserId_Date

-- DailyProgresses
IX_DailyProgresses_UserId_HabitId_Date

-- AuditLogs
IX_AuditLogs_UserId_Timestamp
```

---

## ??? Database Objects

### Functions
- `fn_GetHabitStreak(@habitId, @userId)` ? int
- `fn_GetGoalCompletionRate(@userId)` ? decimal

### Stored Procedures
- `sp_GetUserStatistics(@userId)`
- `sp_ArchiveCompletedGoals(@userId, @daysOld)`

### Triggers
- `trg_AutoCompleteGoal` ON Goals (AFTER UPDATE)

---

## ?? Delete Behaviors

| Parent ? Child | Behavior | Reason |
|----------------|----------|--------|
| User ? Habits | RESTRICT | Protect user data |
| User ? Goals | RESTRICT | Protect user data |
| User ? EmotionEntries | RESTRICT | Protect user data |
| User ? DailyProgresses | RESTRICT | Protect user data |
| User ? AuditLogs | RESTRICT | Protect audit trail |
| Habit ? DailyProgresses | **CASCADE** | Cleanup dependent data |
| User ? Roles (junction) | **CASCADE** | Remove mappings |

---

## ?? Field Specifications

### Common Types
- **User IDs:** `varchar(450)` - Identity framework standard
- **Titles/Names:** `varchar(100-200)` - Short text
- **Descriptions:** `varchar(500-2000)` - Long text
- **Dates:** `datetime` - UTC timestamps
- **Percentages:** `int [0-100]` - Progress values
- **Enums:** `int` - Stored as integers

### Special Fields
- **EmotionEntries scales:** `int [1-5]` (nullable)
- **AuditLog.Details:** `varchar(max)` - JSON data
- **ApplicationUser.Bio:** `varchar(250)` - User profile

---

## ?? Quick Commands

### View ERD in Browser
```bash
start documentation/ERD.svg
```

### Open DBML in VS Code
```bash
code documentation/ERD.dbml
```

### Import to dbdiagram.io
1. Copy contents of `documentation/ERD.dbml`
2. Go to https://dbdiagram.io
3. File ? Import ? Paste DBML

---

## ?? Schema Version Info

- **Created:** 2024-12-13
- **Schema Version:** 1.0
- **Tables:** 8 (3 Identity + 5 Application)
- **Relationships:** 8
- **Indexes:** 5 composite indexes
- **Database Objects:** 4 (2 functions + 1 procedure + 1 trigger)

---

## ?? Quick Search Tips

### Find Foreign Keys
```sql
SELECT * FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS;
```

### List All Tables
```sql
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_TYPE = 'BASE TABLE';
```

### View Indexes
```sql
SELECT * FROM sys.indexes 
WHERE object_id = OBJECT_ID('Habits');
```

---

## ?? Pro Tips

1. **Zoom SVG:** Use browser zoom (Ctrl/Cmd + Mouse Wheel)
2. **Print ERD:** SVG prints perfectly at any size
3. **Interactive View:** Import DBML to dbdiagram.io for pan/zoom
4. **Update Check:** Compare ERD with actual schema periodically
5. **Team Sharing:** Share ERD.svg link in documentation

---

## ?? Quick Links

- **ERD Image:** `documentation/ERD.svg`
- **DBML Source:** `documentation/ERD.dbml`
- **README Section:** `README.md#entity-relationship-diagram`
- **Implementation Guide:** `ERD_IMPLEMENTATION_COMPLETE.md`
- **DbContext:** `ola/Data/ApplicationDbContext.cs`
- **Models Directory:** `ola/Models/`

---

## ? Checklist for Reviews

- [ ] All tables present?
- [ ] Relationships correct?
- [ ] Foreign keys defined?
- [ ] Indexes documented?
- [ ] Delete behaviors specified?
- [ ] Enums documented?
- [ ] Database objects listed?

---

**Print this card for quick reference during development!** ???
