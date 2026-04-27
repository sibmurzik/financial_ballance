import {FormValidation} from "../../utils/formValidation";
import {Incomes} from "../incomes/incomes";
import {Categories} from "../../utils/getAllCategories";
import {allFinancialData} from "../../utils/getAllFinancialData";

export class FinancialOperationCreateEdit {
    constructor(sideMenuInstance, openNewRoute, operationType) {
        this.openNewRoute = openNewRoute;

        if (sideMenuInstance) {
            sideMenuInstance.paintActiveElement(operationType.split('-')[1] + "Page");
        }
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
                this.setCategoryOptions("income")
                break;
            case 'edit-incomes':
                this.pageTitle.innerText = "Редактирование дохода/расхода";
                this.processingFunction = this.editFinancialOperationHttpRequest;
                this.processingFunctionType = "income";
                this.confirmButton.innerText = "Сохранить";
                this.typeSelect.value = "income";
                this.setCategoryOptions("income");
                this.fillingFormFields();
                break;
            case 'create-expenses':
                this.pageTitle.innerText = "Создание дохода/расхода";
                this.processingFunction = this.addFinancialOperationHttpRequest;
                this.processingFunctionType = "expense";
                this.confirmButton.innerText = "Создать";
                this.typeSelect.value = "expense";
                this.setCategoryOptions("expense");
                break;
            case 'edit-expenses':
                this.pageTitle.innerText = "Редактирование дохода/расхода";
                this.processingFunction = this.editFinancialOperationHttpRequest;
                this.processingFunctionType = "expense";
                this.confirmButton.innerText = "Сохранить";
                this.typeSelect.value = "expense";
                this.setCategoryOptions("expense");
                this.fillingFormFields();
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
            this.setCategoryOptions(event.target.value);
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

    setCategoryOptions(type) {
        while (this.categorySelect.length > 1) {
            this.categorySelect.remove(this.categorySelect.length - 1);

        }

        let optionsList;
        if (type === "income") {
            optionsList = Categories.getIncomesCategoriesTitles();
        } else if (type === "expense") {
            optionsList = Categories.getExpensesCategoriesTitles();
        } else {
            optionsList = [];
        }
        for (let i = 0; i < optionsList.length; i++) {
            let option = new Option(optionsList[i], optionsList[i]);
            this.categorySelect.add(option);
        }


    }

    fillingFormFields() {
        const urlParams = new URLSearchParams(window.location.search);
        const id =  parseInt(urlParams.get("id"));
        const operationData = allFinancialData.getFinancialDataById(id);

        console.log("Selected category", operationData.category);
        for (let i = 1; i < this.categorySelect.length; i++) {
            this.categorySelect[i].selected = this.categorySelect[i].value.toLowerCase() === operationData.category.toLowerCase();
        }

        this.amountInput.value = operationData.amount + "$";
        this.dateInput.value = operationData.date.toLocaleDateString("ru-RU");
        this.commentInput.value = operationData.comments;

    }


    addFinancialOperationHttpRequest() {

        if (FormValidation.formFieldsValidation(this.formFields)) {
            console.log(`Add ${this.processingFunctionType} operation  request to server`)
            this.openNewRoute(this.backRoute);

        } else {
            console.log("Form is wrong");
        }

    }

    editFinancialOperationHttpRequest() {

        if (FormValidation.formFieldsValidation(this.formFields)) {
            console.log(`Edit ${this.processingFunctionType} operation  request to server`)
            this.openNewRoute(this.backRoute);

        } else {
            console.log("Form is wrong");
        }

    }
}