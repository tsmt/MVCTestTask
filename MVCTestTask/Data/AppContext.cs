using MVCTestTask.Models;
using System.Data.Entity;

namespace MVCTestTask.Data
{
    public class MVCAppContext : DbContext
    {
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Order> Orders { get; set; }

        public MVCAppContext() : base("MVCTestTask")
        {

        }
    }
}
