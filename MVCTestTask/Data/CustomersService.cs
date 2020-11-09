using MVCTestTask.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace MVCTestTask.Data
{
    public class CustomersService : IDisposable
    {
        private MVCAppContext db;
        private bool disposedValue;

        public CustomersService(MVCAppContext context)
        {
            db = context;
        }

        public IQueryable<Customer> Customers()
        {
            return db.Customers;
        }

        public Customer Get(int id)
        {
            return db.Customers.Find(id);
        }

        public void AddCustomer(Customer customer)
        {
            db.Customers.Add(customer);
            db.SaveChanges();
        }

        public void UpdateCustomer(Customer customer)
        {
            db.Customers.Attach(customer);
            db.Entry(customer).State = System.Data.Entity.EntityState.Modified;
            db.SaveChanges();
        }

        public void DeleteCustomer(int id)
        {
            Customer customer = db.Customers.Find(id);

            if (customer != null)
            {
                db.Customers.Remove(customer);
                db.SaveChanges();
            }
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!disposedValue)
            {
                if (disposing)
                {
                    db.Dispose();
                }

                disposedValue = true;
            }
        }

        void IDisposable.Dispose()
        {
            Dispose(disposing: true);
            GC.SuppressFinalize(this);
        }
    }
}
