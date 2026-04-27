import {FormValidation} from "../../utils/formValidation";

export class CategoryEditCreating {
    constructor(sideMenuInstance, openNewRoute, categoryType) {
        this.openNewRoute = openNewRoute;

        if (sideMenuInstance) {
            sideMenuInstance.paintActiveElement(categoryType.split('-')[1] + "Page");
        }

        this.backRoute = '/' + categoryType.split('-')[1];


        this.pageTitle = document.getElementById("editCreatingCategoryTitle");
        this.processingFunction = null;
        this.processingFunctionType = "";

        this.confirmButton = document.getElementById("confirmEditCreating");



        switch (categoryType) {
            case 'create-incomes':
                this.pageTitle.innerText = "Создание категории доходов";
                this.processingFunction = this.addCategoryHttpRequest;
                this.processingFunctionType = "income";
                this.confirmButton.innerText = "Создать";
                break;
            case 'edit-incomes':
                this.pageTitle.innerText = "Редактирование категории доходов";
                this.processingFunction = this.editCategoryHttpRequest;
                this.processingFunctionType = "income";
                this.confirmButton.innerText = "Сохранить";
                break;
            case 'create-expenses':
                this.pageTitle.innerText = "Создание категории расходов";
                this.processingFunction = this.addCategoryHttpRequest;
                this.processingFunctionType = "expense";
                this.confirmButton.innerText = "Создать";
                break;
            case 'edit-expenses':
                this.pageTitle.innerText = "Редактирование категории расходов";
                this.processingFunction = this.editCategoryHttpRequest;
                this.processingFunctionType = "expense";
                this.confirmButton.innerText = "Сохранить";
                break;
            default:
                this.pageTitle.innerText = "Редактирование/создание  категории";
                break;


        }

        this.confirmButton.addEventListener("click", this.processingFunction.bind(this));

        document.getElementById("cancel").addEventListener("click", () => {
            return this.openNewRoute(this.backRoute);
        });




        const inputField = document.getElementById("categoryInput");

        const urlParams = new URLSearchParams(window.location.search);
        //console.log(urlParams.get("title"));
        const id = urlParams.get("id");
        inputField.value = urlParams.get("title");

        this.formFields = [
            {
                inputFiled: inputField,
                inputType: "name",
                validationFeedback: document.getElementById("categoryFeedback")
            }
        ]



    }


    addCategoryHttpRequest() {

        if (FormValidation.formFieldsValidation(this.formFields)) {
            console.log(`Add ${this.processingFunctionType} category ${this.formFields[0].inputFiled.value} request to server`)
            this.openNewRoute(this.backRoute);

        } else {
            console.log("Form is wrong");
        }

    }

    editCategoryHttpRequest() {

        if (FormValidation.formFieldsValidation(this.formFields)) {
            console.log(`Edit ${this.processingFunctionType} category ${this.formFields[0].inputFiled.value} request to server`)
            this.openNewRoute(this.backRoute);

        } else {
            console.log("Form is wrong");
        }

    }

}