import {FormValidation} from "../../utils/formValidation";
import {Categories} from "../../utils/getAllCategories";
import {allFinancialData} from "../../utils/getAllFinancialData";
import {HttpUtils} from "../../utils/http-utils";

export class FinancialOperationCreateEdit {
    constructor(sideMenuInstance, openNewRoute, operationType) {
        this.openNewRoute = openNewRoute;
        if (!HttpUtils.checkAuthentification()) {
            this.openNewRoute("/login")
        }

        if (sideMenuInstance) {
            this.sideMenuInstance = sideMenuInstance;
            sideMenuInstance.paintActiveElement(operationType.split('-')[1] + "Page");
            sideMenuInstance.updateSideBarInfo().then();

        }


        this.faultWindow = document.getElementById("faultWindow");
        document.getElementById("faultConfirmButton").addEventListener("click", this.closeFaultWindow.bind(this) );

        this.backRoute = '/financial';
        this.pageTitle = document.getElementById("editCreatingOperationTitle");
        this.processingFunction = null;
        this.processingFunctionType = "";

        this.confirmButton = document.getElementById("confirmEditCreating");
        this.typeSelect = document.getElementById("typeSelect");
        this.categorySelect = document.getElementById("categorySelect");
        this.amountInput = document.getElementById("amountInput");
        this.dateInput = document.getElementById("dateInput");
        this.commentInput = document.getElementById("commentsInput");




        switch (operationType) {
            case 'create-incomes':
                this.pageTitle.innerText = "Создание дохода/расхода";
                this.processingFunction = this.addFinancialOperationHttpRequest;
                this.processingFunctionType = "income";
                this.confirmButton.innerText = "Создать";
                this.typeSelect.value = "income";
                this.setCategoryOptions("income").then()
                break;
            case 'edit-incomes':
                this.pageTitle.innerText = "Редактирование дохода/расхода";
                this.processingFunction = this.editFinancialOperationHttpRequest;
                this.processingFunctionType = "income";
                this.confirmButton.innerText = "Сохранить";
                this.typeSelect.value = "income";
                this.fillingFormFields().then();
                break;
            case 'create-expenses':
                this.pageTitle.innerText = "Создание дохода/расхода";
                this.processingFunction = this.addFinancialOperationHttpRequest;
                this.processingFunctionType = "expense";
                this.confirmButton.innerText = "Создать";
                this.typeSelect.value = "expense";
                this.setCategoryOptions("expense").then();
                break;
            case 'edit-expenses':
                this.pageTitle.innerText = "Редактирование дохода/расхода";
                this.processingFunction = this.editFinancialOperationHttpRequest;
                this.processingFunctionType = "expense";
                this.confirmButton.innerText = "Сохранить";
                this.typeSelect.value = "expense";
                this.fillingFormFields().then();
                break;
            default:
                this.pageTitle.innerText = "Редактирование/создание  дохода/расхода";
                break;


        }

        this.confirmButton.addEventListener("click", this.processingFunction.bind(this));
        document.getElementById("cancel").addEventListener("click", () => {
            return this.openNewRoute(this.backRoute);
        });




        this.typeSelect.addEventListener("change", (event) => {
            this.setCategoryOptions(event.target.value).then();
        });





        this.formFields = [
            {
                inputFiled: this.typeSelect,
                inputType: "select",
                validationFeedback: document.getElementById("typeFeedback")
            },
            {
                inputFiled: this.categorySelect,
                inputType: "select",
                validationFeedback: document.getElementById("categoryFeedback")
            },
            {
                inputFiled: this.amountInput,
                inputType: "money",
                validationFeedback: document.getElementById("amountFeedback")

            },

            {
                inputFiled:this.dateInput,
                inputType: "date",
                validationFeedback: document.getElementById("dateFeedback")

            },

            {
                inputFiled: this.commentInput,
                inputType: "not_required",
                validationFeedback: document.getElementById("commentsFeedback")

            },


        ];

    }



    async setCategoryOptions(type) {
        while (this.categorySelect.length > 1) {
            this.categorySelect.remove(this.categorySelect.length - 1);

        }

        let optionsList;
        if (type === "income") {
            await Categories.updateCategory("income");
            optionsList = Categories.getIncomesCategoriesTitles();
        } else if (type === "expense") {
            await Categories.updateCategory("expense");
            optionsList = Categories.getExpensesCategoriesTitles();
        } else {
            optionsList = [];
        }
        for (let i = 0; i < optionsList.length; i++) {
            let option = new Option(optionsList[i], optionsList[i]);
            this.categorySelect.add(option);
        }


    }

    async fillingFormFields() {
        const urlParams = new URLSearchParams(window.location.search);
        const id =  parseInt(urlParams.get("id"));
        const operationData = allFinancialData.getFinancialDataById(id);
        const type = operationData.type === "доход" ? "income" : "expense";

        await this.setCategoryOptions(type);




        for (const option of this.categorySelect.options) {
            option.selected = option.value.toLowerCase() === operationData.category.toLowerCase();
        }


        this.amountInput.value = operationData.amount + "$";
        this.dateInput.value = operationData.date.toLocaleDateString("ru-RU");
        this.commentInput.value = operationData.comments;

    }


    async  addFinancialOperationHttpRequest() {

        if (FormValidation.formFieldsValidation(this.formFields)) {

            const result = await HttpUtils.requestWithAuth("POST", "/operations", this.createRequestBody());
            console.log("result", result);
            this.openNewRoute(this.backRoute);
            await this.sideMenuInstance.updateUserBallance();

        }



    }

    async editFinancialOperationHttpRequest() {

        if (FormValidation.formFieldsValidation(this.formFields)) {
            const urlParams = new URLSearchParams(window.location.search);
            const id = urlParams.get("id");
            const result = await HttpUtils.requestWithAuth("PUT", "/operations/"+id , this.createRequestBody());
            if (result.error) {
                this.showFaultWindow()
            }
            this.openNewRoute(this.backRoute);
            await this.sideMenuInstance.updateUserBallance();

        }

    }

    createRequestBody() {
        const dateArray = this.dateInput.value.split(".");
        const transformedDate = dateArray[2]+"-"+dateArray[1]+"-"+dateArray[0];
        let catId = null;
        if (this.typeSelect.value === "expense") {
            catId = Categories.getExpensesCategoriesId(this.categorySelect.value);
        } else if ( this.typeSelect.value === "income") {
            catId =Categories.getIncomesCategoriesId(this.categorySelect.value);
        }

        //console.log("category id ",catId);
        return {
            "type": this.typeSelect.value,
            "amount": parseInt(this.amountInput.value),
            "date": transformedDate,
            "comment": this.commentInput.value,
            "category_id": catId,
        };

    }

    showFaultWindow() {
        this.faultWindow.style.display = "block";
        document.body.style.background = "rgba(0, 0, 0, 0.45)";
    }

    closeFaultWindow() {
        this.faultWindow.style.display = "none";
        document.body.style.background = "transparent";

    }


}