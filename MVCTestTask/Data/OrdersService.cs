using MVCTestTask.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MVCTestTask.Data
{
    public class OrdersService : IDisposable
    {
        private MVCAppContext db;
        private bool disposedValue;

        public OrdersService(MVCAppContext context)
        {
            db = context;
        }

        public IQueryable<Order> Orders()
        {
            return db.Orders;
        }

        public Order Get(int id)
        {
            return db.Orders.Find(id);
        }

        public IQueryable<Order> GetForCustomer(int customerId)
        {
            return db.Orders.Where(x => x.CustomerId == customerId);
        }

        public void AddOrder(Order order)
        {
            db.Orders.Add(order);
            db.SaveChanges();
        }

        public void UpdateOrder(Order order)
        {
            db.Orders.Attach(order);
            db.Entry(order).State = System.Data.Entity.EntityState.Modified;
            db.SaveChanges();
        }

        public void DeleteOrder(int id)
        {
            Order order = db.Orders.Find(id);

            if (order != null)
            {
                db.Orders.Remove(order);
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