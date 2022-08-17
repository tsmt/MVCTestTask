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
            this.Database.CreateIfNotExists();
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Customer>().ToTable("Customer");
            modelBuilder.Entity<Order>().ToTable("Order");

            base.OnModelCreating(modelBuilder);
        }
    }
}
