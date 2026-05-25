import {Balances} from "../ballance_category/ballance_category";
import {Categories} from "../../utils/getAllCategories";
import {HttpUtils} from "../../utils/http-utils";
import type {sideMenu} from "../sideMenu";

export class Expenses extends Balances{


    constructor(sideMenuInstance: sideMenu, openNewRoute : (url: string) => Promise<void>)  {
        super(openNewRoute);
        if (!HttpUtils.checkAuthentification()) {
            this.openNewRoute("/login").then( )
        }


        if (sideMenuInstance) {
            sideMenuInstance.paintActiveElement("expensesPage");
            sideMenuInstance.updateSideBarInfo().then();

        }

        if (this.addCategoryButton) {
            this.addCategoryButton.addEventListener('click', e => {
                openNewRoute("/expenses/create").then( );
            })
        }



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





    //editCategory(id, title) {
    //    this.openNewRoute("expenses/edit?id="+ id+"&title="+title);
    //}



}