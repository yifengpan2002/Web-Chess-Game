using System;
using System.ComponentModel.DataAnnotations;

namespace A2.Models
{
    public class User
    {
        [Required]
        [Key]
        public string UserName { get; set; }
        public string? Password { get; set; }
        public string? Address { get; set; }
    }
}