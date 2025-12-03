using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ola.Migrations
{
    /// <inheritdoc />
    public partial class AddDemoSeed : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "Bio", "ConcurrencyStamp", "Email", "EmailConfirmed", "FirstName", "FullName", "LastName", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "demo-user-123", 0, null, "a7d08c8e-4c3d-4f9e-b2a1-8f6e5d4c3b2a", "demo@example.com", true, "Demo", "Demo User", "User", false, null, "DEMO@EXAMPLE.COM", "DEMO@EXAMPLE.COM", "AQAAAAIAAYagAAAAEJ1dUZ5EONosFVJeFt3PcTJS3BM4tiTqcKoy0eZZ+j9RnBbTK1Z4VHKakiobP6KyIw==", null, false, "b8e19d9f-5d4e-4a0f-c3b2-9g7f6e5d4c3b", false, "demo@example.com" });

            migrationBuilder.InsertData(
                table: "Habits",
                columns: new[] { "Id", "Created", "Description", "Name", "UserId" },
                values: new object[,]
                {
                    { 1, new DateTime(2024, 1, 10, 0, 0, 0, 0, DateTimeKind.Utc), "Drink 8 glasses of water daily", "Drink Water", "demo-user-123" },
                    { 2, new DateTime(2024, 1, 10, 0, 0, 0, 0, DateTimeKind.Utc), "Read for at least 20 minutes every day", "Read 20 Minutes", "demo-user-123" },
                    { 3, new DateTime(2024, 1, 10, 0, 0, 0, 0, DateTimeKind.Utc), "Start the day with 10 minutes of stretching", "Morning Stretching", "demo-user-123" }
                });

            migrationBuilder.InsertData(
                table: "Goals",
                columns: new[] { "Id", "CreatedAt", "Deadline", "Description", "Priority", "ProgressPercentage", "Status", "Title", "UpdatedAt", "UserId" },
                values: new object[,]
                {
                    { 1, new DateTime(2024, 1, 15, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2025, 3, 31, 0, 0, 0, 0, DateTimeKind.Utc), "Complete C# fundamentals and build a working application", 2, 40, 1, "Learn C#", new DateTime(2024, 12, 10, 0, 0, 0, 0, DateTimeKind.Utc), "demo-user-123" },
                    { 2, new DateTime(2024, 1, 20, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2025, 6, 30, 0, 0, 0, 0, DateTimeKind.Utc), "Practice mindfulness and maintain emotional well-being", 2, 70, 1, "Improve Mental Health", new DateTime(2024, 12, 11, 0, 0, 0, 0, DateTimeKind.Utc), "demo-user-123" },
                    { 3, new DateTime(2024, 2, 1, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2025, 12, 31, 0, 0, 0, 0, DateTimeKind.Utc), "Maintain a consistent exercise routine with 3 sessions per week", 1, 20, 1, "Exercise 3x Weekly", new DateTime(2024, 12, 5, 0, 0, 0, 0, DateTimeKind.Utc), "demo-user-123" }
                });

            migrationBuilder.InsertData(
                table: "EmotionEntries",
                columns: new[] { "Id", "Anger", "Anxiety", "Boredom", "Calmness", "CreatedAt", "Date", "Emotion", "Intensity", "Joy", "Note", "Text", "UserId" },
                values: new object[,]
                {
                    { 1, 1, 4, 2, 2, new DateTime(2024, 12, 10, 10, 30, 0, 0, DateTimeKind.Utc), new DateTime(2024, 12, 10, 10, 30, 0, 0, DateTimeKind.Utc), null, null, 2, null, "Feeling anxious but trying to stay calm.", "demo-user-123" },
                    { 2, 1, 1, 1, 4, new DateTime(2024, 12, 11, 14, 15, 0, 0, DateTimeKind.Utc), new DateTime(2024, 12, 11, 14, 15, 0, 0, DateTimeKind.Utc), null, null, 5, null, "Very productive day, lots of joy.", "demo-user-123" },
                    { 3, 1, 2, 4, 3, new DateTime(2024, 12, 12, 16, 45, 0, 0, DateTimeKind.Utc), new DateTime(2024, 12, 12, 16, 45, 0, 0, DateTimeKind.Utc), null, null, 2, null, "A bit bored and low energy.", "demo-user-123" }
                });

            migrationBuilder.InsertData(
                table: "DailyProgresses",
                columns: new[] { "Id", "Date", "HabitId", "UserId", "Value" },
                values: new object[,]
                {
                    { 1, new DateTime(2024, 12, 10, 0, 0, 0, 0, DateTimeKind.Utc), 1, "demo-user-123", 80 },
                    { 2, new DateTime(2024, 12, 11, 0, 0, 0, 0, DateTimeKind.Utc), 1, "demo-user-123", 100 },
                    { 3, new DateTime(2024, 12, 12, 0, 0, 0, 0, DateTimeKind.Utc), 1, "demo-user-123", 75 },
                    { 4, new DateTime(2024, 12, 10, 0, 0, 0, 0, DateTimeKind.Utc), 2, "demo-user-123", 100 },
                    { 5, new DateTime(2024, 12, 11, 0, 0, 0, 0, DateTimeKind.Utc), 2, "demo-user-123", 90 },
                    { 6, new DateTime(2024, 12, 11, 0, 0, 0, 0, DateTimeKind.Utc), 3, "demo-user-123", 100 },
                    { 7, new DateTime(2024, 12, 12, 0, 0, 0, 0, DateTimeKind.Utc), 3, "demo-user-123", 100 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "DailyProgresses",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "DailyProgresses",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "DailyProgresses",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "DailyProgresses",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "DailyProgresses",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "DailyProgresses",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "DailyProgresses",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "EmotionEntries",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "EmotionEntries",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "EmotionEntries",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Goals",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Goals",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Goals",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Habits",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Habits",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Habits",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "demo-user-123");
        }
    }
}
