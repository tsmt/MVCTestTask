'use strict';

document.addEventListener("DOMContentLoaded", function (event) {

    const rootUrl = document.querySelector('#root').value;

    const spinner = `<div class="d-flex justify-content-center">'
        <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
        </div></div>`;

    const spinner_btn = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        <span class="sr-only">Deleting...</span>`;

    class pager {
        constructor(rec_count, refreshCallback) {
            this.num_records = rec_count;
            this.page_size = 5;
            this.current_page = 1;
            this.refreshCallback = refreshCallback;
            this.element = null;
        }
        totalPages() {
            let p = Math.ceil(this.num_records / this.page_size);
            return p === 0 ? 1: p;
        }
        hasPrevious() {
            return this.current_page > 1;
        }
        hasNext() {
            return this.current_page < this.totalPages();
        }
        setPrevNextClasses() {
            let prev = this.element.querySelector("[data-page=prev]");
            let next = this.element.querySelector("[data-page=next");
            prev.classList.remove('disabled');
            next.classList.remove('disabled');
            if (!this.hasPrevious()) {
                prev.classList.add('disabled');
            }
            if (!this.hasNext()) {
                next.classList.add('disabled');
            }
        }
        setActivePage(num) {
            this.clearActivePage();
            let li = this.element.querySelector(`[data-page="${num}"]`);
            li.classList.add('active');
        }
        clearActivePage() {
            let s = this.element.querySelectorAll('.page-item');
            s.forEach((elem) => {
                elem.classList.remove('active');
            });
        }
        render(selector) {
            this.element = selector;
            let pages = this.totalPages();
            let num_buttons = pages > 5 ? 5 : pages;
            let html = `<li class="page-item" data-page="prev"><a class="page-link">Previous</a></li>`;
            for (let i = 1; i <= num_buttons; i++) {
                html += `<li class="page-item" data-page="${i}"><a class="page-link">${i}</a></li>`;
            }
            html += `<li class="page-item" data-page="next"><a class="page-link">Next</a></li>`;
            selector.innerHTML = html;
            this.setPrevNextClasses();
            this.setActivePage(this.current_page);

            let c = this.element.querySelectorAll('.page-item');
            c.forEach((elem) => {                
                elem.addEventListener('click', () => {
                    this.setPrevNextClasses();
                    switch (elem.textContent) {
                        case "Next":
                            if (this.hasNext()) {
                                this.current_page++;
                                this.refreshCallback(this.current_page, false);
                                this.setActivePage(this.current_page);
                            }
                            this.setPrevNextClasses();
                            break;
                        case "Previous":
                            if (this.hasPrevious()) {
                                this.current_page--;
                                this.refreshCallback(this.current_page, false);
                                this.setActivePage(this.current_page);
                            }
                            this.setPrevNextClasses();
                            break;
                        default:
                            this.current_page = +elem.textContent; 
                            this.refreshCallback(+elem.textContent, false);                            
                            this.setPrevNextClasses();
                            this.setActivePage(this.current_page);
                            break;
                    }
                })
            });
        }
    };

    let customers_pager = new pager(+document.querySelector('#numRecords').value, refreshTable);    
    customers_pager.render(document.querySelector('#customers_page_nav'));
    let orders_pager;

    initDelCustomers();

    $('#customerModal').on('shown.bs.modal', () => {
        $('#mbody').html(spinner);
        $('#mbody').load(rootUrl + 'Home/CustomerDetails/0');
    });

    $('#customerupdateModal').on('shown.bs.modal', (e) => {
        let id = e.relatedTarget.getAttribute('data-id');
        renderCustomerDetails(id);
    });

    function renderCustomerDetails(id) {
        $('#updatetitle').text('Update Customer');
        $('#mupdatebody').html(spinner);
        $('#mupdatebody').load(rootUrl + `Home/CustomerDetails/${id}`, () => {
            orders_pager = new pager(+document.querySelector('#NumOrders').value, refreshOrdersTable);
            orders_pager.render(document.querySelector('#orders_page_nav'));
            refreshOrdersTable(1, true);
            let add_order = document.querySelector('#addorder');
            add_order.addEventListener('click', () => {
                renderOrderDetails(id, 0);
            });
        });
    }

    function renderOrderDetails(customerId, orderId) {
        $('#updatetitle').text(orderId === 0 ? 'Add Order' : 'Update Order');
        $('#mupdatebody').load(rootUrl + `Home/OrderDetails/${customerId}/${orderId}`);
        $('#updateCustomer').hide();
        $('#updateOrder').removeAttr('hidden').show();
    }

    $('#customerModal').on('hidden.bs.modal', function () {
        $('#mupdatebody').html('');
    });

    $('#customerupdateModal').on('hidden.bs.modal', function () {
        $('#mupdatebody').html('');
    });

    let updateCustomer = document.querySelector('#updateCustomer');
    updateCustomer.addEventListener('click', (e) => {
        e.preventDefault();
        let xhr = $.post(rootUrl + 'Home/UpdateCustomer', $("#customerUpdateForm").serialize())
            .done((result) => {
                if (xhr.getResponseHeader('error') !== 'not valid data') {
                    $('#customerupdateModal').modal('hide');
                    refreshTable(customers_pager.current_page);
                } else {
                    $("#mupdatebody").html(result);
                }
            });
    });

    let saveCustomer = document.querySelector('#saveCustomer');
    saveCustomer.addEventListener('click', (e) => {
        e.preventDefault();
        let xhr = $.post(rootUrl + 'Home/AddCustomer', $("#customerForm").serialize())
            .done((result) => {
                if (xhr.getResponseHeader('error') !== 'not valid data') {
                    $('#customerModal').modal('hide');
                    customers_pager.num_records++;
                    refreshTable(customers_pager.totalPages());
                } else {
                    $("#mbody").html(result);
                }
            });
    });

    let saveOrder = document.querySelector('#updateOrder');
    saveOrder.addEventListener('click', (e) => {
        e.preventDefault();
        updateOrder();
    });

    function updateOrder() {
        let price = $('#price').val().replace(/\s/g, '');
        $('#price').val(price.replace(/\./g, ','));
        let xhr = $.post(rootUrl + 'Home/AddOrder', $("#orderForm").serialize())
            .done((result) => {
                if (xhr.getResponseHeader('error') !== 'not valid data') {
                    renderCustomerDetails($("#CustomerId").val());
                    $('#updateCustomer').show();
                    $('#updateOrder').hide();
                } else {
                    $("#mupdatebody").html(result);
                }
            });
    }

    function initDelCustomers() {
        let delCust = $('[data-del-cust]');
        delCust.each((i, item) => {
            item.addEventListener('click', (e) => {
                $(item).append(spinner_btn);
                deleteCustomer(item.getAttribute('data-id'))
                    .done(() => {
                        customers_pager.num_records--;
                        if (customers_pager.totalPages() < customers_pager.current_page)
                            refreshTable(customers_pager.current_page - 1);
                        else
                            refreshTable(customers_pager.current_page);
                    });
            })
        });
    }

    function initOrders(customerId) {
        let delOrd = $('[data-del-order]');
        let updOrd = $('[data-upd-order]');
        delOrd.each((i, item) => {
            item.addEventListener('click', (e) => {
                deleteOrder(item.getAttribute('data-id'))
                    .done(() => {
                        orders_pager.num_records--;
                        if (orders_pager.totalPages() < orders_pager.current_page)
                            refreshOrdersTable(orders_pager.current_page - 1);
                        else
                            refreshOrdersTable(orders_pager.current_page);
                    });
            })
        });
        updOrd.each((i, item) => {
            item.addEventListener('click', (e) => {
                renderOrderDetails(customerId, item.getAttribute('data-id'));
            })
        });
    }

    function deleteCustomer(id) {        
        return $.post(rootUrl + 'Home/DeleteCustomer', { id: id });
    }

    function deleteOrder(id) {
        return $.post(rootUrl + 'Home/DeleteOrder', { id: id });
    }

    function refreshTable(page_num, update_pager = true) {
        let table_body = $('#custtbody');

        $.get(rootUrl + 'Home/CustomersList', { pagenum: page_num, pagesize: customers_pager.page_size })
            .done((result) => {
                $(table_body).html(result);
                customers_pager.num_records = +document.querySelector('#numRecords').value;
                customers_pager.current_page = page_num;
                if (update_pager) {
                    customers_pager.render(document.querySelector('#customers_page_nav'));
                }
                initDelCustomers();
            });
    }

    function refreshOrdersTable(page_num, update_pager = true) {
        let table_body = $('#ordersbody');
        let cId = $('#CustomerId').val();

        $.get(rootUrl + 'Home/OrdersList', {
            customerId: cId,
            pagenum: page_num,
            pagesize: customers_pager.page_size
        })
            .done((result) => {
                $(table_body).html(result);
                orders_pager.num_records = +document.querySelector('#numOrders').value;
                orders_pager.current_page = page_num;
                if (update_pager) {
                    orders_pager.render(document.querySelector('#orders_page_nav'));
                }
                initOrders(cId);
            });
    }
});
