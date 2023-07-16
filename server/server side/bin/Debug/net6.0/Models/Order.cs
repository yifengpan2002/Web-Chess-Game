using System;
using System.ComponentModel.DataAnnotations;

namespace A2.Models
{
    public class Order
    {
        public string? UserName { get; set; }
        
        [Key]
        public Int64 ProductId { get; set; }
    }
}