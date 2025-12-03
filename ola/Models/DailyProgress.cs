using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace ola.Models
{
    public class DailyProgress
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int HabitId { get; set; }

        [ForeignKey(nameof(HabitId))]
        public Habit Habit { get; set; } = default!;

        [Required]
        [StringLength(450)]
        public string UserId { get; set; } = string.Empty;

        [ForeignKey(nameof(UserId))]
        public ApplicationUser User { get; set; } = default!;

        [Required]
        public DateTime Date { get; set; } = DateTime.UtcNow.Date;

        [Required]
        [Range(0, 100)]
        public int Value { get; set; }
    }
}
