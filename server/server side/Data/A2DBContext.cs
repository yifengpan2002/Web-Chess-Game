using A2.Models;
using Microsoft.EntityFrameworkCore;

namespace Data
{
    public class A2DBContext : DbContext
    {
        public A2DBContext(DbContextOptions<A2DBContext> options): base(options){}

        public DbSet<GameMove> GameMoves { get; set; }
        public DbSet<GameRecord> GameRecords { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<User> Users { get; set; }
    }
}