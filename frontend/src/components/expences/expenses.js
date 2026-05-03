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
            sideMenuInstance.updateUserBallance().then();
            sideMenuInstance.updateUserName();
        }

        this.addCategoryButton.addEventListener('click', e => {
            openNewRoute("/expenses/create");
        })

       this.renderPage(Categories.getExpensesCategories(), "expenses");
        //console.log(this.incomesCategories);


    }





    editCategory(id, title) {
        this.openNewRoute("expenses/edit?id="+ id+"&title="+title);
    }

    deleteHttpRequest(id) {
        this.deleteWindow.style.display = "none";
        document.body.style.background = "#fff";
        console.log("Deleting request to server", id)
    }


}