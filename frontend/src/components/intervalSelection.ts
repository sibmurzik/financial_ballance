import {HttpUtils} from "../utils/http-utils";
import datepicker, {type DatepickerInstance} from 'js-datepicker';

export class TimeIntervalSelection {
    readonly openNewRoute: (url: string) => Promise<void>;
    private timeInterval: string;
    private intervals: NodeListOf<Element>;
    private dateFrom: string;
    private dateTo: string;
    readonly dateFromButton: HTMLElement | null;
    readonly dateToButton: HTMLElement | null;
    private intervalSelectionFeedback: HTMLElement | null;

    constructor( openNewRoute:(url: string) => Promise<void>) {
        this.openNewRoute = openNewRoute;
        if (!HttpUtils.checkAuthentification()) {
            this.openNewRoute("/login").then()
        }



        this.timeInterval = "today";

        this.intervals = document.querySelectorAll(".period-select");
        this.intervals.forEach((element : Element) => {
            element.addEventListener('click', (event: Event): void => this.intervalSelection(event.target));
        });

        this.dateFrom = "";
        this.dateTo = "";

        this.dateFromButton = document.getElementById("dateFrom");
        if (this.dateFromButton) {
            this.dateFromButton.innerText = this.dateFrom? this.dateFrom :'Дата' ;
        }


        this.dateToButton = document.getElementById("dateTo");
        if (this.dateToButton) {
            this.dateToButton.innerText = this.dateTo? this.dateTo :'Дата' ;
        }


        this.intervalSelectionFeedback = document.getElementById("intervalSelectionFeedback");

        if (this.dateFromButton) {
            datepicker(this.dateFromButton, {
                customMonths: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
                customDays: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
                onSelect: (instance: DatepickerInstance , date : Date) => {
                    this.dateFrom = this.formatDate(date);
                    this.dateFromButton!.innerText = this.dateFrom;
                }
            });

        }

        if (this.dateToButton) {
            datepicker(  this.dateToButton,{
                customMonths: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
                customDays: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
                onSelect: (instance : DatepickerInstance, date : Date) => {
                    this.dateTo = this.formatDate(date);
                    this.dateToButton!.innerText = this.dateTo;
                }
            });


        }



    }

    protected intervalSelection(element:EventTarget | null):void {
        this.intervals.forEach(item => {
            item.classList.remove("active");
        });
        (element as HTMLElement).classList.add("active");
        const interval = (element as HTMLElement).getAttribute("data-period");
        if (interval) {
            this.timeInterval = interval;
        }


    }

    private formatDate( date : Date ): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    getHttpPeriodParams() : string {
        if (this.timeInterval === "today") {
            return "";
        } else if (this.timeInterval === 'interval') {
            if (this.dateFrom && this.dateTo ) {
                if (this.intervalSelectionFeedback && this.intervals[5]) {
                    this.intervalSelectionFeedback.style.display = "none";
                    this.intervals[5].classList.remove("btn-outline-danger");
                    this.intervals[5].classList.add("btn-outline-secondary");
                }

                return `?period=interval&dateFrom=${this.dateFrom}&dateTo=${this.dateTo}`;
            } else {
                if (this.intervalSelectionFeedback && this.intervals[5])
                {
                this.intervalSelectionFeedback.style.display = "inline-block";
                this.intervals[5].classList.remove("btn-outline-secondary");
                this.intervals[5].classList.add("btn-outline-danger");
                }
                return "";


            }
        }
        else {
            return `?period=${this.timeInterval}`;
        }

    }




}