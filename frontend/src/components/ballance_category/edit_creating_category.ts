import {FormValidation} from "../../utils/formValidation";
import {HttpUtils} from "../../utils/http-utils";
import type {sideMenu} from "../sideMenu";
import type {CategoryEditFormFieldsType} from "../types/category-edit-formFields.type";
import type {GetCategoriesResponseType} from "../types/responseTypes/get-category-response.type";
import type {FaultResponseType} from "../types/responseTypes/FaultResponseType";


export class CategoryEditCreating {
    readonly openNewRoute: (url: string) => Promise<void>;
    readonly backRoute: string;
    private overlay: HTMLElement | null;
    readonly pageTitle: HTMLElement | null;
    private processingFunction: () => Promise<void>;
    readonly processingFunctionType: string;
    readonly confirmButton: HTMLElement | null;
    readonly faultWindow: HTMLElement | null;
    private categoryExist: boolean;
    readonly formFields: CategoryEditFormFieldsType[];

    constructor(sideMenuInstance: sideMenu, openNewRoute: (url: string) => Promise<void>, categoryType: string) {
        this.openNewRoute = openNewRoute;
        if (!HttpUtils.checkAuthentification()) {
            this.openNewRoute("/login").then()
        }

        if (sideMenuInstance) {
            sideMenuInstance.paintActiveElement(categoryType.split('-')[1] + "Page");
            sideMenuInstance.updateSideBarInfo().then();

        }

        this.backRoute = '/' + categoryType.split('-')[1];
        this.overlay = document.getElementById('overlay');
        this.processingFunction = () => Promise.resolve();


        this.pageTitle = document.getElementById("editCreatingCategoryTitle");

        this.processingFunctionType = "";

        this.confirmButton = document.getElementById("confirmEditCreating");
        this.faultWindow = document.getElementById("faultWindow");
        this.categoryExist = false;

        const faultConfirmButton = document.getElementById("faultConfirmButton");
        if (faultConfirmButton) {
            faultConfirmButton.addEventListener("click", this.closeFaultWindow.bind(this));

        }


        if (this.pageTitle && this.confirmButton) {


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
        }

        if (this.confirmButton) {
            this.confirmButton.addEventListener("click", this.processingFunction.bind(this));
        }

        const cancel: HTMLElement | null = document.getElementById("cancel");
        if (cancel) {
            cancel.addEventListener("click", () => {
                return this.openNewRoute(this.backRoute);
            });
        }


        const inputField = document.getElementById("categoryInput") as HTMLInputElement;

        const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
        //console.log(urlParams.get("title"));
        const id: string | null = urlParams.get("id");
        if (inputField) {
            const title = urlParams.get("title");
            if (title) {
                inputField.value = title;
            }

        }


        this.formFields = [
            {
                categoryId: id,
                inputFiled: inputField,
                inputType: "name",
                validationFeedback: document.getElementById("categoryFeedback")
            }
        ]


    }


    private async addCategoryHttpRequest(): Promise<void> {

        if (FormValidation.formFieldsValidation(this.formFields)) {
            //console.log(`Add ${this.processingFunctionType} category ${this.formFields[0].inputFiled.value} request to server`);
            let title: string = "";
            if (this.formFields[0]) {
                title = this.formFields[0].inputFiled.value;
            }

            const result: GetCategoriesResponseType | FaultResponseType = await HttpUtils.requestWithAuth("POST", "/categories/" + this.processingFunctionType, {"title": title});
            if ((result as FaultResponseType).error) {
                if ((result as FaultResponseType).message === "This record already exists") {
                    this.categoryExist = true;
                }
                this.showFaultWindow();
            }

            this.openNewRoute(this.backRoute).then();


        }

    }

    private async editCategoryHttpRequest(): Promise<void> {

        if (FormValidation.formFieldsValidation(this.formFields)) {
            //console.log(`Edit ${this.processingFunctionType} category ${this.formFields[0].inputFiled.value} request to server`)
            let title: string = "";
            let id: string | null= "";
            if (this.formFields[0]) {
                title = this.formFields[0].inputFiled.value;
                id = this.formFields[0].categoryId
            }


            const result: GetCategoriesResponseType | FaultResponseType = await HttpUtils.requestWithAuth("PUT", "/categories/" + this.processingFunctionType + "/" + id, {"title": title});


            if ((result as FaultResponseType).error) {
                this.showFaultWindow();
            }

            this.openNewRoute(this.backRoute).then();

        }

    }

    private showFaultWindow(): void {
        if (this.faultWindow && this.overlay) {
            this.faultWindow.style.display = "block";
            this.overlay.style.display = "block";
        }
        if (this.categoryExist) {
            const faultMessage: HTMLElement | null = document.getElementById("faultWindow");
            if (faultMessage) {
                faultMessage.innerText = "Данная категория уже существует";

            }
            this.categoryExist = false;

        }
    }

    private closeFaultWindow(): void {
        if (this.faultWindow && this.overlay) {
            this.faultWindow.style.display = "none";
            this.overlay.style.display = "none";
        }

    }

}