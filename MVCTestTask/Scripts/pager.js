'use strict'

class Pager {
    constructor(rec_count, refreshCallback) {
        this.num_records = rec_count;
        this.page_size = 5;
        this.current_page = 1;
        this.refreshCallback = refreshCallback;
        this.element = null;
    }
    totalPages() {
        let p = Math.ceil(this.num_records / this.page_size);
        return p === 0 ? 1 : p;
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
        if (pages <= 1)
            return;

        let num_buttons = pages > 5 ? 5 : pages;
        let html = `<li class="page-item" data-page="prev"><a class="page-link" href="#">Previous</a></li>`;
        for (let i = 1; i <= num_buttons; i++) {
            html += `<li class="page-item" data-page="${i}"><a class="page-link" href="#">${i}</a></li>`;
        }
        html += `<li class="page-item" data-page="next"><a class="page-link" href="#">Next</a></li>`;
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
}
