import {Balances} from "../ballance_category/ballance_category";
import {Categories} from "../../utils/getAllCategories";
import {HttpUtils} from "../../utils/http-utils";

export class Incomes extends Balances {
    constructor(sideMenuInstance, openNewRoute) {
        super(openNewRoute);

        if (!HttpUtils.checkAuthentification()) {
            this.openNewRoute("/login")
        }

        if (sideMenuInstance) {
            sideMenuInstance.paintActiveElement("incomesPage");
            sideMenuInstance.updateSideBarInfo().then();

        }

        this.addCategoryButton.addEventListener('click', e => {
            openNewRoute("/incomes/create");
        })

        this.init().then();


    }

    async init() {
        const result = await Categories.updateCategory("income")
        if(result) {
            this.renderPage(Categories.getIncomesCategories(), "income");
        } else {
            this.showFaultWindow();
        }

    }


    editCategory(id, title) {
        this.openNewRoute("incomes/edit?id=" + id + "&title=" + title);
    }


    static getIncomesCategories() {
        return this.incomesCategories.map(category => category.title)
    }


}