using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ola.Models
{
    public enum GoalPriority { Low, Medium, High }
    public enum GoalStatus { NotStarted, InProgress, Completed, Archived }

    public class Goal
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [StringLength(2000)]
        public string? Description { get; set; }

        public DateTime? Deadline { get; set; }

        [Required]
        public GoalPriority Priority { get; set; } = GoalPriority.Medium;

        [Required]
        public GoalStatus Status { get; set; } = GoalStatus.NotStarted;

        [Range(0,100)]
        public int ProgressPercentage { get; set; } = 0;

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [Required]
        [StringLength(450)]
        public string UserId { get; set; } = string.Empty;

        [ForeignKey(nameof(UserId))]
        public ApplicationUser User { get; set; } = default!;
    }
}
