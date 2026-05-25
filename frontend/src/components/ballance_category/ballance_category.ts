import {HttpUtils} from "../../utils/http-utils";
import {Categories} from "../../utils/getAllCategories";
import type {CategoryDataType} from "../types/category-data.type";
import type {CategoryObjectType} from "../types/category-object.type";


export class Balances {
    protected openNewRoute: (url: string) => Promise<void>;
    readonly listRoot: HTMLElement | null;
    readonly emptyCard: HTMLElement | null;
    readonly faultWindow: HTMLElement | null;
    readonly deleteWindow: HTMLElement | null;
    readonly overlay: HTMLElement | null;
    private ballanceCategoryTitle: HTMLElement | null;
    protected addCategoryButton: HTMLElement | null;
    private categoryData: CategoryDataType | null;

    constructor(openNewRoute : (url: string) => Promise<void>) {
        this.openNewRoute = openNewRoute;
        this.listRoot = document.getElementById('categoryList');
        this.emptyCard = document.getElementById('emptyCard');

        this.faultWindow = document.getElementById("faultWindow");
        const faultWindowButton  = document.getElementById("faultConfirmButton");
        if (faultWindowButton) {
            faultWindowButton.addEventListener("click", this.closeFaultWindow.bind(this) );
        }



        this.deleteWindow = document.getElementById('deleteWindow');
        this.overlay = document.getElementById('overlay');
        const cancelDeleting = document.getElementById("cancelDeleting");
        if (cancelDeleting) {
            cancelDeleting.addEventListener("click", () => {
                if (this.deleteWindow && this.overlay) {
                    this.deleteWindow.style.display = "none";
                    this.overlay.style.display = "none";
                    
                }
               
            });
        }
        
        const confirmDeleting  = document.getElementById("confirmDeleting");
        if (confirmDeleting) {
            confirmDeleting.addEventListener("click", this.deleteHttpRequest.bind(this));
        }

        this.categoryData = null;

        this.ballanceCategoryTitle = document.getElementById('balanceCategoryTitle');
        this.addCategoryButton = document.getElementById('addCategoryButton');

    }

    protected renderPage(categories : CategoryObjectType[], type:'income' | 'expense') {
        if (this.ballanceCategoryTitle) {
            if (type === 'income') {
                this.ballanceCategoryTitle.innerText = "Доходы"
            } else if (type === 'expense') {
                this.ballanceCategoryTitle.innerText = "Расходы"
            }
        }

        //console.log("inside render", categories, type);
        if (this.listRoot) {
            while (this.listRoot.childNodes.length > 2) {
                if (this.listRoot.childNodes[0]) {
                    this.listRoot.removeChild(this.listRoot.childNodes[0]);
                }

            }
        }

        categories.forEach((category: CategoryObjectType):void => {
            const cardTitle: HTMLHeadElement = document.createElement("h5");
            cardTitle.innerText = category.title;
            cardTitle.classList.add("card-title");
            
            
            const editButton:HTMLAnchorElement = document.createElement("a");
            editButton.innerText = "Редактировать";
            editButton.href = "javascript:void(0)";
            editButton.classList.add("btn", "edit", "btn-primary");
            category.editButton = editButton;
            editButton.addEventListener("click", this.editCategory.bind(this, category.id, category.title, type));

            const deleteButton:HTMLAnchorElement = document.createElement("a");
            deleteButton.innerText = "Удалить";
            deleteButton.href = "javascript:void(0)";
            deleteButton.classList.add("btn", "delete", "btn-danger");
            category.deleteButton = deleteButton;
            deleteButton.addEventListener("click", this.deleteCategory.bind(this, type, category.id));
            
            const cardBody:HTMLElement = document.createElement("div");
            cardBody.classList.add("card-body");
            cardBody.appendChild(cardTitle);
            cardBody.appendChild(editButton);
            cardBody.appendChild(deleteButton);

            const card:HTMLElement = document.createElement("div");
            card.classList.add("card");
            card.appendChild(cardBody);

            const cell = document.createElement("div");
            cell.classList.add("col-lg-4",  "col-md-6",  "col-12");
            cell.appendChild(card);

            if (this.listRoot){
                this.listRoot.insertBefore(cell, this.emptyCard);
            }



        })

    }

    protected editCategory(id: number, title : string, type: string) {
        if (type === 'expense') {
            this.openNewRoute("expenses/edit?id=" + id + "&title=" + title).then();
        } else if (type === 'income') {
            this.openNewRoute("incomes/edit?id=" + id + "&title=" + title).then();
        }

    }

    private deleteCategory(type:"income" | "expense",  id: number) {
        this.categoryData = {
            type: type,
            id: id,
        };
        if(this.overlay && this.deleteWindow) {
            this.overlay.style.display = "block";
            this.deleteWindow.style.display = "block";
        }

    }



    private async deleteHttpRequest():Promise<void> {
        if (this.deleteWindow && this.overlay) {
            this.deleteWindow.style.display = "none";
            this.overlay.style.display = "none";
        }
        let id:number|null = null;
        let type: "income"| "expense" | null = null;
        if (this.categoryData) {
            id = this.categoryData.id;
            type = this.categoryData.type;
        }


        //console.log("Deleting request to server", type, id)
        if (id &&  type) {
            const result:any = await  HttpUtils.requestWithAuth("DELETE", "/categories/" + type +"/" + id );
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
        if (this.faultWindow && this.overlay) {
            this.faultWindow.style.display = "block";
            this.overlay.style.display = "block";
        }
    }

    closeFaultWindow() {
        if (this.faultWindow && this.overlay) {
            this.faultWindow.style.display = "none";
            this.overlay.style.display = "none";
        }

    }




}