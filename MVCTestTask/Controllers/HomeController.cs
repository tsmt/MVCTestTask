using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Mvc;
using MVCTestTask.Data;
using MVCTestTask.Models;
using MVCTestTask.Models.Home;

namespace MVCTestTask.Controllers
{
    public class HomeController : Controller
    {
        private MVCAppContext context;

        public HomeController()
        {
            context = new MVCAppContext();
        }

        public async Task<ActionResult> Index(int pagenum = 1, int pagesize = 5)
        {
            HomeViewModel model = new HomeViewModel();

            using (CustomersService service = new CustomersService(context))
            {
                IQueryable<Customer> customers = service.Customers();
                model.numRecords = customers.Count();
                model.Customers = await customers.Take(pagesize).ToListAsync();
            }
            return View(model);
        }

        [HttpGet]
        public async Task<ActionResult> CustomersList(int pagenum = 1, int pagesize = 5)
        {
            HomeViewModel model = new HomeViewModel();

            using (CustomersService service = new CustomersService(context))
            {
                IQueryable<Customer> customers = service.Customers();
                model.numRecords = customers.Count();
                int totalPages = (int)Math.Ceiling(model.numRecords / (double)pagesize);

                if (pagenum <= totalPages)
                {
                    model.Customers = await customers
                        .OrderBy(x => x.Id)
                        .Skip((pagenum - 1) * pagesize)
                        .Take(pagesize).ToListAsync();
                }
                else
                    model.Customers = await customers.Take(pagesize).ToListAsync();
            }

            return PartialView("CustomersList", model);
        }

        [HttpGet]
        public ActionResult CustomerDetails(int id)
        {
            using (CustomersService service = new CustomersService(context))
            {
                if (id != 0)
                {
                    Customer customer = service.Get(id);
                    customer.NumOrders = customer.Orders.Count;

                    return PartialView("EditCustomer", customer);
                }
                else
                    return PartialView("AddCustomer", new Customer());
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> UpdateCustomer(Customer customer)
        {
            if (ModelState.IsValid)
            {
                using (CustomersService service = new CustomersService(context))
                {
                    service.UpdateCustomer(customer);
                }

                return new HttpStatusCodeResult(System.Net.HttpStatusCode.OK);
            }

            Response.Headers.Add("error", "not valid data");
            using (OrdersService service = new OrdersService(context))
            {
                customer.Orders = await service.GetForCustomer(customer.Id).ToListAsync();
            }            
            return PartialView("EditCustomer", customer);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult AddCustomer(Customer customer)
        {
            if (ModelState.IsValid)
            {
                using (CustomersService service = new CustomersService(context))
                {
                    service.AddCustomer(customer);
                }

                return new HttpStatusCodeResult(System.Net.HttpStatusCode.OK);
            }

            Response.Headers.Add("error", "not valid data");
            return PartialView("AddCustomer", customer);
        }

        [HttpPost]
        public void DeleteCustomer(int id)
        {
            using (CustomersService service = new CustomersService(context))
            {
                service.DeleteCustomer(id);
            }
        }

        [HttpGet]
        public async Task<ActionResult> OrdersList(int customerId, int pagenum = 1, int pagesize = 5)
        {
            OrdersListViewModel model = new OrdersListViewModel();

            using (OrdersService service = new OrdersService(context))
            {
                IQueryable<Order> orders = service.GetForCustomer(customerId);
                model.numOrders = orders.Count();
                model.CustomerId = customerId;
                int totalPages = (int)Math.Ceiling(model.numOrders / (double)pagesize);

                if (pagenum <= totalPages)
                {
                    model.Orders = await orders
                        .OrderBy(x => x.Id)
                        .Skip((pagenum - 1) * pagesize)
                        .Take(pagesize).ToListAsync();
                }
                else
                    model.Orders = await orders.Take(pagesize).ToListAsync();
            }

            return PartialView("OrdersList", model);
        }

        [HttpGet]
        public ActionResult OrderDetails(int customerId, int id)
        {
            Order order;

            if (id == 0)
            {
                order = new Order();
            }
            else
            {
                using (OrdersService service = new OrdersService(context))
                {
                    order = service.Get(id);
                }
            }

            return PartialView("AddOrder", order);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult AddOrder(Order order)
        {
            if (ModelState.IsValid)
            {
                using (OrdersService service = new OrdersService(context))
                {
                    if (order.Id == 0)
                        service.AddOrder(order);
                    else
                        service.UpdateOrder(order);
                }

                return new HttpStatusCodeResult(System.Net.HttpStatusCode.OK);
            }

            Response.Headers.Add("error", "not valid data");
            return PartialView("AddOrder", order);
        }

        [HttpPost]
        public void DeleteOrder(int id)
        {
            using (OrdersService service = new OrdersService(context))
            {
                service.DeleteOrder(id);
            }
        }
    }
}
