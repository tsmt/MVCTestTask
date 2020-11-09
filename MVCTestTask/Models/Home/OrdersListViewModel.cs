using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MVCTestTask.Models.Home
{
    public class OrdersListViewModel
    {
        public List<Order> Orders;
        public int numOrders { get; set; }
        public int CustomerId { get; set; }
    }
}