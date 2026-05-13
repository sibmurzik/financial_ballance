import {HttpUtils} from "../utils/http-utils";
import datepicker from 'js-datepicker';

export class TimeIntervalSelection {

    constructor( openNewRoute) {
        this.openNewRoute = openNewRoute;
        if (!HttpUtils.checkAuthentification()) {
            this.openNewRoute("/login")
        }



        this.timeInterval = "today";

        this.intervals = document.querySelectorAll(".period-select");
        this.intervals.forEach(element => {
            element.addEventListener('click', (event) => this.intervalSelection(event.target));
        });

        this.dateFrom = null;
        this.dateTo = null;

        this.dateFromButton = document.getElementById("dateFrom");
        this.dateFromButton.innerText = this.dateFrom? this.dateFrom :'Дата' ;

        this.dateToButton = document.getElementById("dateTo");
        this.dateToButton.innerText = this.dateTo? this.dateTo :'Дата' ;

        this.intervalSelectionFeedback = document.getElementById("intervalSelectionFeedback");



        datepicker(this.dateFromButton, {
            customMonths: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
            customDays: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
            onSelect: (instance, date) => {
                 this.dateFrom = this.formatDate(date);
                 this.dateFromButton.innerText = this.dateFrom;
            }
        });
        datepicker(  this.dateToButton,{
            customMonths: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
            customDays: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
            onSelect: (instance, date) => {
                this.dateTo = this.formatDate(date);
                this.dateToButton.innerText = this.dateTo;
            }
        });






    }

    intervalSelection(element) {
        this.intervals.forEach(item => {
            item.classList.remove("active");
        });
        element.classList.add("active");
        this.timeInterval = element.getAttribute("data-period");
    }

    formatDate( date ) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    getHttpPeriodParams() {
        if (this.timeInterval === "today") {
            return "";
        } else if (this.timeInterval === 'interval') {
            if (this.dateFrom && this.dateTo) {
                this.intervalSelectionFeedback.style.display = "none";
                this.intervals[5].classList.remove("btn-outline-danger");
                this.intervals[5].classList.add("btn-outline-secondary");

                return `?period=interval&dateFrom=${this.dateFrom}&dateTo=${this.dateTo}`;
            } else {
                this.intervalSelectionFeedback.style.display = "inline-block";
                this.intervals[5].classList.remove("btn-outline-secondary");
                this.intervals[5].classList.add("btn-outline-danger");
                return "";


            }
        }
        else {
            return `?period=${this.timeInterval}`;
        }

    }




}