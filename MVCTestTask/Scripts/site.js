'use strict';

document.addEventListener("DOMContentLoaded", function (event) {

    const rootUrl = document.querySelector('#root').value;

    const spinner = `<div class="d-flex justify-content-center">'
        <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
        </div></div>`;

    const spinner_btn = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" ml-auto></span>
        <span class="sr-only">Deleting...</span>`;

    let customers_pager = new Pager(+document.querySelector('#numRecords').value, refreshTable);
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
            orders_pager = new Pager(+document.querySelector('#NumOrders').value, refreshOrdersTable);
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
                $(item).prepend(spinner_btn);
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
