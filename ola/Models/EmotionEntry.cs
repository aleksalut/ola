using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace ola.Models
{
    public class EmotionEntry
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Required]
        [StringLength(2000)]
        public string Text { get; set; } = string.Empty;

        [Range(1, 5)]
        public int? Anxiety { get; set; }

        [Range(1, 5)]
        public int? Calmness { get; set; }

        [Range(1, 5)]
        public int? Joy { get; set; }

        [Range(1, 5)]
        public int? Anger { get; set; }

        [Range(1, 5)]
        public int? Boredom { get; set; }

        // Legacy fields - keep for backward compatibility
        public DateTime Date { get; set; } = DateTime.UtcNow;

        [StringLength(50)]
        public string? Emotion { get; set; }

        [Range(0, 10)]
        public int? Intensity { get; set; }

        [StringLength(1000)]
        public string? Note { get; set; }

        [Required]
        [StringLength(450)]
        public string UserId { get; set; } = string.Empty;

        [ForeignKey(nameof(UserId))]
        public ApplicationUser User { get; set; } = default!;
    }
}
