import {HttpUtils} from "../utils/http-utils";
import datepicker from 'js-datepicker';

export class TimeIntervalSelection{

    constructor(sideMenuInstance, openNewRoute) {
        this.openNewRoute = openNewRoute;
        if (!HttpUtils.checkAuthentification()) {
            this.openNewRoute("/login")
        }


        if (sideMenuInstance) {
            sideMenuInstance.paintActiveElement("mainPage");
            sideMenuInstance.updateSideBarInfo().then();
        }

        this.timeInterval = "today";

        this.intervals = document.querySelectorAll(".period-select");
        this.intervals.forEach(element => {
            element.addEventListener('click', (event) => this.intervalSelection(event.target));
        });

        this.dateFrom = document.getElementById("dateFrom");
        this.dateTo = document.getElementById("dateTo");
        const pickerFrom = datepicker(this.dateFrom);
        const pickerTo = datepicker(this.dateTo);






    }

    intervalSelection(element) {
        this.intervals.forEach(item => {
            item.classList.remove("active");
        });
        element.classList.add("active");
        this.timeInterval = element.getAttribute("data-period");
    }


}