import {Balances} from "../ballance_category/ballance_category";
import {Categories} from "../../utils/getAllCategories";

export class Expenses extends Balances{
    constructor(sideMenuInstance, openNewRoute) {
        super(openNewRoute);





        if (sideMenuInstance) {
            sideMenuInstance.paintActiveElement("expensesPage");
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