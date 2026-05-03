import {Balances} from "../ballance_category/ballance_category";
import {Categories} from "../../utils/getAllCategories";
import {HttpUtils} from "../../utils/http-utils";

export class Incomes extends Balances{
    constructor(sideMenuInstance, openNewRoute) {
        super(openNewRoute);

        if (!HttpUtils.checkAuthentification()) {
            this.openNewRoute("/login")
        }



        if (sideMenuInstance) {
            sideMenuInstance.paintActiveElement("incomesPage");
            sideMenuInstance.updateUserBallance().then();
            sideMenuInstance.updateUserName();
        }

        this.addCategoryButton.addEventListener('click', e => {
            openNewRoute("/incomes/create");
        })

       this.renderPage( Categories.getIncomesCategories(), "incomes");
        //console.log(this.incomesCategories);


    }





    editCategory(id, title) {
        this.openNewRoute("incomes/edit?id="+ id+"&title="+title);
    }

    deleteHttpRequest(id) {
        this.deleteWindow.style.display = "none";
        document.body.style.background = "#fff";
        console.log("Deleting request to server", id)
    }


    static getIncomesCategories() {
        return this.incomesCategories.map(category => category.title)
    }






}