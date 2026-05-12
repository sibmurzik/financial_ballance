import {Balances} from "../ballance_category/ballance_category";
import {Categories} from "../../utils/getAllCategories";
import {HttpUtils} from "../../utils/http-utils";

export class Expenses extends Balances{
    constructor(sideMenuInstance, openNewRoute) {
        super(openNewRoute);
        if (!HttpUtils.checkAuthentification()) {
            this.openNewRoute("/login")
        }


        if (sideMenuInstance) {
            sideMenuInstance.paintActiveElement("expensesPage");
            sideMenuInstance.updateSideBarInfo().then();

        }

        this.addCategoryButton.addEventListener('click', e => {
            openNewRoute("/expenses/create");
        })

        this.init().then();


    }

    async init() {
        const result = await Categories.updateCategory("expense")
        if (result) {
        this.renderPage( Categories.getExpensesCategories(), "expense");
        }
        else {
            this.showFaultWindow();
        }

    }





    editCategory(id, title) {
        this.openNewRoute("expenses/edit?id="+ id+"&title="+title);
    }



}