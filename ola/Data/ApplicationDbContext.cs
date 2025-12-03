using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ola.Models;

namespace ola.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Habit> Habits { get; set; } = default!;
        public DbSet<Goal> Goals { get; set; } = default!;
        public DbSet<EmotionEntry> EmotionEntries { get; set; } = default!;
        public DbSet<DailyProgress> DailyProgresses { get; set; } = default!;
        public DbSet<AuditLog> AuditLogs { get; set; } = default!;

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Table naming
            builder.Entity<Habit>().ToTable("Habits");
            builder.Entity<Goal>().ToTable("Goals");
            builder.Entity<EmotionEntry>().ToTable("EmotionEntries");
            builder.Entity<DailyProgress>().ToTable("DailyProgresses");
            builder.Entity<AuditLog>().ToTable("AuditLogs");

            // Relationships: IdentityUser 1-* Habit, Goal, EmotionEntry, DailyProgress
            builder.Entity<Habit>()
                .HasOne(h => h.User)
                .WithMany()
                .HasForeignKey(h => h.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Goal>()
                .HasOne(g => g.User)
                .WithMany()
                .HasForeignKey(g => g.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<EmotionEntry>()
                .HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<DailyProgress>()
                .HasOne(p => p.User)
                .WithMany()
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<AuditLog>()
                .HasOne(a => a.User)
                .WithMany()
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Habit 1-* DailyProgress
            builder.Entity<DailyProgress>()
                .HasOne(p => p.Habit)
                .WithMany(h => h.DailyProgresses)
                .HasForeignKey(p => p.HabitId)
                .OnDelete(DeleteBehavior.Cascade);

            // Indexes
            builder.Entity<Habit>()
                .HasIndex(h => new { h.UserId, h.Name });
            builder.Entity<Goal>()
                .HasIndex(g => new { g.UserId, g.Status, g.Priority });
            builder.Entity<EmotionEntry>()
                .HasIndex(e => new { e.UserId, e.Date });
            builder.Entity<DailyProgress>()
                .HasIndex(p => new { p.UserId, p.HabitId, p.Date });
            builder.Entity<AuditLog>()
                .HasIndex(a => new { a.UserId, a.Timestamp });

            // Seed Roles
            const string adminRoleId = "role-admin-001";
            const string userRoleId = "role-user-001";

            builder.Entity<IdentityRole>().HasData(
                new IdentityRole
                {
                    Id = adminRoleId,
                    Name = "Admin",
                    NormalizedName = "ADMIN",
                    ConcurrencyStamp = adminRoleId
                },
                new IdentityRole
                {
                    Id = userRoleId,
                    Name = "User",
                    NormalizedName = "USER",
                    ConcurrencyStamp = userRoleId
                }
            );

            // Seed Demo User
            const string demoUserId = "demo-user-123";
            builder.Entity<ApplicationUser>().HasData(new ApplicationUser
            {
                Id = demoUserId,
                Email = "demo@example.com",
                NormalizedEmail = "DEMO@EXAMPLE.COM",
                UserName = "demo@example.com",
                NormalizedUserName = "DEMO@EXAMPLE.COM",
                EmailConfirmed = true,
                PasswordHash = "AQAAAAIAAYagAAAAEJ1dUZ5EONosFVJeFt3PcTJS3BM4tiTqcKoy0eZZ+j9RnBbTK1Z4VHKakiobP6KyIw==",
                SecurityStamp = Guid.NewGuid().ToString(),
                ConcurrencyStamp = Guid.NewGuid().ToString(),
                FirstName = "Demo",
                LastName = "User",
                FullName = "Demo User"
            });

            // Seed Habits
            builder.Entity<Habit>().HasData(
                new Habit
                {
                    Id = 1,
                    Name = "Drink Water",
                    Description = "Drink 8 glasses of water daily",
                    Created = new DateTime(2024, 1, 10, 0, 0, 0, DateTimeKind.Utc),
                    UserId = demoUserId
                },
                new Habit
                {
                    Id = 2,
                    Name = "Read 20 Minutes",
                    Description = "Read for at least 20 minutes every day",
                    Created = new DateTime(2024, 1, 10, 0, 0, 0, DateTimeKind.Utc),
                    UserId = demoUserId
                },
                new Habit
                {
                    Id = 3,
                    Name = "Morning Stretching",
                    Description = "Start the day with 10 minutes of stretching",
                    Created = new DateTime(2024, 1, 10, 0, 0, 0, DateTimeKind.Utc),
                    UserId = demoUserId
                }
            );

            // Seed Daily Progress
            builder.Entity<DailyProgress>().HasData(
                // Drink Water progress
                new DailyProgress
                {
                    Id = 1,
                    HabitId = 1,
                    UserId = demoUserId,
                    Date = new DateTime(2024, 12, 10, 0, 0, 0, DateTimeKind.Utc),
                    Value = 80
                },
                new DailyProgress
                {
                    Id = 2,
                    HabitId = 1,
                    UserId = demoUserId,
                    Date = new DateTime(2024, 12, 11, 0, 0, 0, DateTimeKind.Utc),
                    Value = 100
                },
                new DailyProgress
                {
                    Id = 3,
                    HabitId = 1,
                    UserId = demoUserId,
                    Date = new DateTime(2024, 12, 12, 0, 0, 0, DateTimeKind.Utc),
                    Value = 75
                },
                // Read 20 Minutes progress
                new DailyProgress
                {
                    Id = 4,
                    HabitId = 2,
                    UserId = demoUserId,
                    Date = new DateTime(2024, 12, 10, 0, 0, 0, DateTimeKind.Utc),
                    Value = 100
                },
                new DailyProgress
                {
                    Id = 5,
                    HabitId = 2,
                    UserId = demoUserId,
                    Date = new DateTime(2024, 12, 11, 0, 0, 0, DateTimeKind.Utc),
                    Value = 90
                },
                // Morning Stretching progress
                new DailyProgress
                {
                    Id = 6,
                    HabitId = 3,
                    UserId = demoUserId,
                    Date = new DateTime(2024, 12, 11, 0, 0, 0, DateTimeKind.Utc),
                    Value = 100
                },
                new DailyProgress
                {
                    Id = 7,
                    HabitId = 3,
                    UserId = demoUserId,
                    Date = new DateTime(2024, 12, 12, 0, 0, 0, DateTimeKind.Utc),
                    Value = 100
                }
            );

            // Seed Goals
            builder.Entity<Goal>().HasData(
                new Goal
                {
                    Id = 1,
                    Title = "Learn C#",
                    Description = "Complete C# fundamentals and build a working application",
                    Deadline = new DateTime(2025, 3, 31, 0, 0, 0, DateTimeKind.Utc),
                    Priority = GoalPriority.High,
                    Status = GoalStatus.InProgress,
                    ProgressPercentage = 40,
                    CreatedAt = new DateTime(2024, 1, 15, 0, 0, 0, DateTimeKind.Utc),
                    UpdatedAt = new DateTime(2024, 12, 10, 0, 0, 0, DateTimeKind.Utc),
                    UserId = demoUserId
                },
                new Goal
                {
                    Id = 2,
                    Title = "Improve Mental Health",
                    Description = "Practice mindfulness and maintain emotional well-being",
                    Deadline = new DateTime(2025, 6, 30, 0, 0, 0, DateTimeKind.Utc),
                    Priority = GoalPriority.High,
                    Status = GoalStatus.InProgress,
                    ProgressPercentage = 70,
                    CreatedAt = new DateTime(2024, 1, 20, 0, 0, 0, DateTimeKind.Utc),
                    UpdatedAt = new DateTime(2024, 12, 11, 0, 0, 0, DateTimeKind.Utc),
                    UserId = demoUserId
                },
                new Goal
                {
                    Id = 3,
                    Title = "Exercise 3x Weekly",
                    Description = "Maintain a consistent exercise routine with 3 sessions per week",
                    Deadline = new DateTime(2025, 12, 31, 0, 0, 0, DateTimeKind.Utc),
                    Priority = GoalPriority.Medium,
                    Status = GoalStatus.InProgress,
                    ProgressPercentage = 20,
                    CreatedAt = new DateTime(2024, 2, 1, 0, 0, 0, DateTimeKind.Utc),
                    UpdatedAt = new DateTime(2024, 12, 5, 0, 0, 0, DateTimeKind.Utc),
                    UserId = demoUserId
                }
            );

            // Seed Emotion Entries
            builder.Entity<EmotionEntry>().HasData(
                new EmotionEntry
                {
                    Id = 1,
                    CreatedAt = new DateTime(2024, 12, 10, 10, 30, 0, DateTimeKind.Utc),
                    Date = new DateTime(2024, 12, 10, 10, 30, 0, DateTimeKind.Utc),
                    Text = "Feeling anxious but trying to stay calm.",
                    Anxiety = 4,
                    Calmness = 2,
                    Joy = 2,
                    Anger = 1,
                    Boredom = 2,
                    UserId = demoUserId
                },
                new EmotionEntry
                {
                    Id = 2,
                    CreatedAt = new DateTime(2024, 12, 11, 14, 15, 0, DateTimeKind.Utc),
                    Date = new DateTime(2024, 12, 11, 14, 15, 0, DateTimeKind.Utc),
                    Text = "Very productive day, lots of joy.",
                    Anxiety = 1,
                    Calmness = 4,
                    Joy = 5,
                    Anger = 1,
                    Boredom = 1,
                    UserId = demoUserId
                },
                new EmotionEntry
                {
                    Id = 3,
                    CreatedAt = new DateTime(2024, 12, 12, 16, 45, 0, DateTimeKind.Utc),
                    Date = new DateTime(2024, 12, 12, 16, 45, 0, DateTimeKind.Utc),
                    Text = "A bit bored and low energy.",
                    Anxiety = 2,
                    Calmness = 3,
                    Joy = 2,
                    Anger = 1,
                    Boredom = 4,
                    UserId = demoUserId
                }
            );

            // Assign Demo User to Admin Role
            builder.Entity<IdentityUserRole<string>>().HasData(
                new IdentityUserRole<string>
                {
                    UserId = demoUserId,
                    RoleId = adminRoleId
                }
            );
        }
    }
}
