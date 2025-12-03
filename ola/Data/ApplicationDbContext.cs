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

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Table naming
            builder.Entity<Habit>().ToTable("Habits");
            builder.Entity<Goal>().ToTable("Goals");
            builder.Entity<EmotionEntry>().ToTable("EmotionEntries");
            builder.Entity<DailyProgress>().ToTable("DailyProgresses");

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
        }
    }
}
