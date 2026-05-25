import {Balances} from "../ballance_category/ballance_category";
import {Categories} from "../../utils/getAllCategories";
import {HttpUtils} from "../../utils/http-utils";
import type {sideMenu} from "../sideMenu";

export class Incomes extends Balances {


    constructor(sideMenuInstance:sideMenu, openNewRoute:(url: string) => Promise<void>) {
        super(openNewRoute);

        if (!HttpUtils.checkAuthentification()) {
            this.openNewRoute("/login").then( )
        }

        if (sideMenuInstance) {
            sideMenuInstance.paintActiveElement("incomesPage");
            sideMenuInstance.updateSideBarInfo().then();

        }
        if (this.addCategoryButton) {
            this.addCategoryButton.addEventListener('click', e => {
                openNewRoute("/incomes/create").then();
            })
        }



        this.init().then();


    }

    async init():Promise<void> {
        const result:boolean = await Categories.updateCategory("income")
        if(result) {
            this.renderPage(Categories.getIncomesCategories(), "income");
        } else {
            this.showFaultWindow();
        }

    }


    //editCategory(id, title) {
   //    this.openNewRoute("incomes/edit?id=" + id + "&title=" + title);
    //}





}