using System;
using System.ComponentModel.DataAnnotations;

namespace A2.Models
{
    public class GameRecord
    {
        [Key]
        public int ID { get; set; }
        public string? GameId { get; set; }
        public string? State { get; set; }
        public string? Player1 { get; set; }
        public string? Player2 { get; set; }
        public string? LastMovePlayer1 { get; set; }
        public string? LastMovePlayer2 { get; set; }

    }
}