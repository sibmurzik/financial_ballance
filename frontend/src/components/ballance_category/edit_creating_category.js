import {FormValidation} from "../../utils/formValidation";
import {HttpUtils} from "../../utils/http-utils";
import {Categories} from "../../utils/getAllCategories";

export class CategoryEditCreating {
    constructor(sideMenuInstance, openNewRoute, categoryType) {
        this.openNewRoute = openNewRoute;
        if (!HttpUtils.checkAuthentification()) {
            this.openNewRoute("/login")
        }

        if (sideMenuInstance) {
            sideMenuInstance.paintActiveElement(categoryType.split('-')[1] + "Page");
            sideMenuInstance.updateSideBarInfo().then();

        }

        this.backRoute = '/' + categoryType.split('-')[1];


        this.pageTitle = document.getElementById("editCreatingCategoryTitle");
        this.processingFunction = null;
        this.processingFunctionType = "";

        this.confirmButton = document.getElementById("confirmEditCreating");
        this.faultWindow = document.getElementById("faultWindow");
        this.categoryExist = false;
        document.getElementById("faultConfirmButton").addEventListener("click", this.closeFaultWindow.bind(this) );


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
                categoryId: id,
                inputFiled: inputField,
                inputType: "name",
                validationFeedback: document.getElementById("categoryFeedback")
            }
        ]


    }


    async addCategoryHttpRequest() {

        if (FormValidation.formFieldsValidation(this.formFields)) {
            //console.log(`Add ${this.processingFunctionType} category ${this.formFields[0].inputFiled.value} request to server`);
            const result = await HttpUtils.requestWithAuth("POST", "/categories/" + this.processingFunctionType, {"title": this.formFields[0].inputFiled.value});
            if (result.error) {
                if (result.message === "This record already exists") {
                    this.categoryExist = true;
                }
                this.showFaultWindow();
            }

            this.openNewRoute(this.backRoute);


        }

    }

    async editCategoryHttpRequest() {

        if (FormValidation.formFieldsValidation(this.formFields)) {
            console.log(`Edit ${this.processingFunctionType} category ${this.formFields[0].inputFiled.value} request to server`)

            const result = await HttpUtils.requestWithAuth("PUT", "/categories/" + this.processingFunctionType + "/" + this.formFields[0].categoryId,
                {"title": this.formFields[0].inputFiled.value});

            if (result.error) {
                this.showFaultWindow();
            }

            this.openNewRoute(this.backRoute);

        }

    }

    showFaultWindow() {
        this.faultWindow.style.display = "block";
        document.body.style.background = "rgba(0, 0, 0, 0.45)";
        if (this.categoryExist) {
            document.getElementById("faultMessage").innerText = "Данная категория уже существует";
            this.categoryExist = false;
        }
    }

    closeFaultWindow() {
        this.faultWindow.style.display = "none";
        document.body.style.background = "transparent";

    }

}