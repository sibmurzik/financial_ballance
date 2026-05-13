import {HttpUtils} from "../../utils/http-utils";
import {Categories} from "../../utils/getAllCategories";

export class Balances {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.listRoot = document.getElementById('categoryList');
        this.emptyCard = document.getElementById('emptyCard');

        this.faultWindow = document.getElementById("faultWindow");
        document.getElementById("faultConfirmButton").addEventListener("click", this.closeFaultWindow.bind(this) );

        this.deleteWindow = document.getElementById('deleteWindow');
        this.overlay = document.getElementById('overlay');
        document.getElementById("cancelDeleting").addEventListener("click", () => {
            this.deleteWindow.style.display = "none";
            this.overlay.style.display = "none";
        });

        document.getElementById("confirmDeleting").addEventListener("click", this.deleteHttpRequest.bind(this));
        this.categoryData = null;


        this.ballanceCategoryTitle = document.getElementById('balanceCategoryTitle');
        this.addCategoryButton = document.getElementById('addCategoryButton');

    }

    renderPage(categories, type) {
        if (type==='income') {
            this.ballanceCategoryTitle.innerText = "Доходы"
        } else if (type==='expense') {
            this.ballanceCategoryTitle.innerText = "Расходы"
        }

        //console.log("inside render", categories, type);

        while (this.listRoot.childNodes.length > 2){
            this.listRoot.removeChild(this.listRoot.childNodes[0]);
        }

        categories.forEach((category) => {
            const cardTitle = document.createElement("h5");
            cardTitle.innerText = category.title;
            cardTitle.classList.add("card-title");
            
            
            const editButton = document.createElement("a");
            editButton.innerText = "Редактировать";
            editButton.href = "javascript:void(0)";
            editButton.classList.add("btn", "edit", "btn-primary");
            category.editButton = editButton;
            editButton.addEventListener("click", this.editCategory.bind(this, category.id, category.title));

            const deleteButton = document.createElement("a");
            deleteButton.innerText = "Удалить";
            deleteButton.href = "javascript:void(0)";
            deleteButton.classList.add("btn", "delete", "btn-danger");
            category.deleteButton = deleteButton;
            deleteButton.addEventListener("click", this.deleteCategory.bind(this, type, category.id));
            
            const cardBody = document.createElement("div");
            cardBody.classList.add("card-body");
            cardBody.appendChild(cardTitle);
            cardBody.appendChild(editButton);
            cardBody.appendChild(deleteButton);

            const card = document.createElement("div");
            card.classList.add("card");
            card.appendChild(cardBody);

            const cell = document.createElement("div");
            cell.classList.add("col-lg-4",  "col-md-6",  "col-12");
            cell.appendChild(card);

            this.listRoot.insertBefore(cell, this.emptyCard);

        })

    }

    deleteCategory(type,  id) {
        this.categoryData = {
            type: type,
            id: id,
        };
        this.overlay.style.display = "block";
        this.deleteWindow.style.display = "block";

    }



    async deleteHttpRequest() {
        this.deleteWindow.style.display = "none";
        this.overlay.style.display = "none";
        const id = this.categoryData.id;
        const type = this.categoryData.type;
        console.log("Deleting request to server", type, id)
        if (id && type) {
            const result = await  HttpUtils.requestWithAuth("DELETE", "/categories/" + type +"/" + id );
            if (result.message === "Removed successfully") {
                if (type ==="income") {
                    await Categories.updateCategory("income")
                    this.renderPage( Categories.getIncomesCategories(), type);
                } else if (type ==="expense") {
                    await Categories.updateCategory("expense")
                    this.renderPage( Categories.getExpensesCategories(), type);
                }

            } else {
                this.showFaultWindow();
            }

        }
    }

    showFaultWindow() {
        this.faultWindow.style.display = "block";
        this.overlay.style.display = "block";
    }

    closeFaultWindow() {
        this.faultWindow.style.display = "none";
        this.overlay.style.display = "none";

    }






}