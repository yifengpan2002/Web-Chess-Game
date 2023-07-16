using System;
using System.ComponentModel.DataAnnotations;

namespace A2.Models
{
    public class GameMove
    {
        [Key]
        public string? GameID { get; set; }
        public string? Move { get; set; }
    }
}