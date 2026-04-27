export class Balances {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.listRoot = document.getElementById('categoryList');
        this.emptyCard = document.getElementById('emptyCard');
        this.deleteWindow = document.getElementById('deleteWindow');

        this.ballanceCategoryTitle = document.getElementById('balanceCategoryTitle');
        this.addCategoryButton = document.getElementById('addCategoryButton');

    }

    renderPage(categories, type) {
        if (type==='incomes') {
            this.ballanceCategoryTitle.innerText = "Доходы"
        } else {
            this.ballanceCategoryTitle.innerText = "Расходы"
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
            deleteButton.addEventListener("click", this.deleteCategory.bind(this, category.id));
            
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

    deleteCategory(id) {
        console.log("Delete", id);
        this.deleteWindow.style.display = "block";
        document.body.style.background = "rgba(0, 0, 0, 0.45)";
        document.getElementById("cancelDeleting").addEventListener("click", () => {
            this.deleteWindow.style.display = "none";
            document.body.style.background = "transparent";
        });

        document.getElementById("confirmDeleting").addEventListener("click", this.deleteHttpRequest.bind(this, id));


    }



    deleteHttpRequest(id) {
        this.deleteWindow.style.display = "none";
        document.body.style.background = "#fff";
        console.log("Deleting request to server", id)
    }






}