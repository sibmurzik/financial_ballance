import {FormValidation} from "../../utils/formValidation";
import {Categories} from "../../utils/getAllCategories";
import {allFinancialData} from "../../utils/getAllFinancialData";
import {HttpUtils} from "../../utils/http-utils";
import datepicker, {type DatepickerInstance} from "js-datepicker";
import type {sideMenu} from "../sideMenu";
import type {DataForValidationType} from "../types/data-for-validation.type";
import type {FinancialOperationType} from "../types/financial-operation.type";
import type {FinancialOperationBodyType} from "../types/requestBodies/financial-operation-body.type";
import type {GetOperationResponseType} from "../types/responseTypes/get-operation-response.type";
import type {FaultResponseType} from "../types/responseTypes/FaultResponseType";


export class FinancialOperationCreateEdit {
    readonly openNewRoute:(url: string) => Promise<void>;
    private sideMenuInstance: sideMenu |null = null;
    readonly faultWindow: HTMLElement | null;
    readonly backRoute: '/financial';
    readonly pageTitle: HTMLElement | null;
    private processingFunctionType: string;
    readonly overlay: HTMLElement | null;
    readonly confirmButton: HTMLElement | null;
    readonly categorySelect: HTMLSelectElement | null;
    readonly typeSelect: HTMLSelectElement | null;
    readonly amountInput: HTMLInputElement;
    readonly dateInput: HTMLInputElement | null;
    readonly commentInput: HTMLInputElement | null;
    private processingFunction: () => Promise<void> ;
    readonly formFields: DataForValidationType[] = [];
    private date:string | undefined;

    constructor(sideMenuInstance: sideMenu, openNewRoute: (url: string) => Promise<void>, operationType: string) {
        this.openNewRoute = openNewRoute;
        if (!HttpUtils.checkAuthentification()) {
            this.openNewRoute("/login").then( )
        }

        if (sideMenuInstance) {
            this.sideMenuInstance = sideMenuInstance;
            sideMenuInstance.paintActiveElement(operationType.split('-')[1] + "Page");
            sideMenuInstance.updateSideBarInfo().then();

        }


        this.faultWindow = document.getElementById("faultWindow");
        const faultConfirmButton: HTMLElement| null = document.getElementById("faultConfirmButton");
        if (faultConfirmButton) {
            faultConfirmButton.addEventListener("click", this.closeFaultWindow.bind(this) );
        }
       

        this.backRoute = '/financial';
        this.pageTitle = document.getElementById("editCreatingOperationTitle");
        this.processingFunction = this.addFinancialOperationHttpRequest;
        this.processingFunctionType = "";
        this.overlay = document.getElementById('overlay');

        this.confirmButton = document.getElementById("confirmEditCreating");
        this.typeSelect = document.getElementById("typeSelect") as HTMLSelectElement;
        this.categorySelect = document.getElementById("categorySelect") as HTMLSelectElement;
        this.amountInput = document.getElementById("amountInput") as HTMLInputElement;
        this.dateInput = document.getElementById("dateInput") as HTMLInputElement;
        this.commentInput = document.getElementById("commentsInput")as HTMLInputElement;


        if (this.pageTitle && this.confirmButton && this.typeSelect) {


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
            this.typeSelect.addEventListener("change", (event: Event): void => {
                if (event.target) {
                    this.setCategoryOptions(((event.target as HTMLOptionElement).value ==="income")?"income": "expense").then();
                }

            });
        }

        const cancel : HTMLElement| null = document.getElementById("cancel");
        if (cancel) {
            cancel.addEventListener("click", () => {
                return this.openNewRoute(this.backRoute);
            });
        }

        const typeFeedback:HTMLElement| null = document.getElementById("typeFeedback");
        const categoryFeedback:HTMLElement | null = document.getElementById("categoryFeedback");
        const amountFeedback:HTMLElement | null = document.getElementById("amountFeedback");
        const dateFeedback :HTMLElement | null = document.getElementById("dateFeedback");
        const commentsFeedback:HTMLElement | null = document.getElementById("commentsFeedback");


        if (this.typeSelect && typeFeedback && this.categorySelect  && categoryFeedback
        && this.amountInput && amountFeedback && this.dateInput && dateFeedback && commentsFeedback) {


            this.formFields = [
                {
                    inputFiled: this.typeSelect,
                    inputType: "select",
                    validationFeedback: typeFeedback
                },
                {
                    inputFiled: this.categorySelect,
                    inputType: "select",
                    validationFeedback: categoryFeedback
                },
                {
                    inputFiled: this.amountInput,
                    inputType: "money",
                    validationFeedback: amountFeedback

                },

                {
                    inputFiled: this.dateInput,
                    inputType: "date",
                    validationFeedback: dateFeedback

                },

                {
                    inputFiled: this.commentInput,
                    inputType: "not_required",
                    validationFeedback: commentsFeedback

                },


            ];
        }

        this.date = "";

        if (this.dateInput) {

            datepicker(this.dateInput, {
                customMonths: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
                customDays: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
                onSelect: (instance: DatepickerInstance, date:Date) => {
                    const formatedDate:string[] = this.formatDate(date);
                    this.date = formatedDate[0];
                    if (this.dateInput && formatedDate[1]) {
                        this.dateInput.value = formatedDate[1] ;
                    }

                    //console.log(this.date);

                }
            });
        }

    }

    private formatDate( date: Date ):string []{
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return [`${year}-${month}-${day}`, `${day}.${month}.${year}`];
    }



    private async setCategoryOptions(type:"income" | "expense"):Promise<void> {
        if (this.categorySelect) {
            while (this.categorySelect.length > 1) {
                this.categorySelect.remove(this.categorySelect.length - 1);

            }

            let optionsList:string[] | [];
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
                let option:HTMLOptionElement = new Option(optionsList[i], optionsList[i]);
                this.categorySelect.add(option);
            }
        }


    }

    private async fillingFormFields():Promise<void> {
        const urlParams = new URLSearchParams(window.location.search);
        const idString:string| null = urlParams.get("id");
        let id: number = 0;
        if (idString) {
            id =  parseInt(idString);
        }

        const operationData:FinancialOperationType| undefined = allFinancialData.getFinancialDataById(id);
        if (operationData) {
            const type: "income" | "expense" = operationData.type === "доход" ? "income" : "expense";
            await this.setCategoryOptions(type);


            if (this.categorySelect){
                for (const option of this.categorySelect.options) {
                    option.selected = option.value.toLowerCase() === operationData.category.toLowerCase();
                }

            }
            if (this.amountInput) {
                this.amountInput.value = operationData.amount + "$"
            }

            if (operationData.date) {
                this.date = this.formatDate(operationData.date)[0];
                if (this.dateInput) {
                    this.dateInput.value = operationData.date.toLocaleDateString("ru-RU");
                }


            }


            if (this.commentInput) {
                this.commentInput.value = operationData.comments;
            }

        }

    }


    private async  addFinancialOperationHttpRequest():Promise<void> {

        if (FormValidation.formFieldsValidation(this.formFields)) {

            const result = await HttpUtils.requestWithAuth("POST", "/operations", this.createRequestBody());
            //console.log("result", result);
            this.openNewRoute(this.backRoute).then();
            if (this.sideMenuInstance) {
                await this.sideMenuInstance.updateUserBallance();
            }


        }



    }

    async editFinancialOperationHttpRequest():Promise<void> {

        if (FormValidation.formFieldsValidation(this.formFields)) {
            const urlParams = new URLSearchParams(window.location.search);
            const id:string| null = urlParams.get("id");
            const body:FinancialOperationBodyType | null =  this.createRequestBody();
            let result:GetOperationResponseType|FaultResponseType| undefined = undefined;
            if (body !== null  && id) {
                 result = await HttpUtils.requestWithAuth("PUT", "/operations/"+id , body);
            } else return ;


            if ((result as FaultResponseType).error) {
                this.showFaultWindow()
            }
            this.openNewRoute(this.backRoute).then();
            if (this.sideMenuInstance) {
                await this.sideMenuInstance.updateUserBallance();
            }


        }

    }

    private createRequestBody() : FinancialOperationBodyType | null {

        let catId = null;
        if (this.categorySelect && this.typeSelect) {
            if (this.typeSelect.value === "expense") {
                catId = Categories.getExpensesCategoriesId(this.categorySelect.value);
            } else if (this.typeSelect.value === "income") {
                catId = Categories.getIncomesCategoriesId(this.categorySelect.value);
            }
        }

        //console.log("category id ",catId);
        if(this.typeSelect && this.date && this.commentInput && catId) {
            return {
                "type": this.typeSelect.value === "income" ? "income" : "expense",
                "amount": parseInt(this.amountInput.value),
                "date": this.date,
                "comment": this.commentInput.value? this.commentInput.value : "нет",
                "category_id": catId,
            };
        }
        return null;

    }

    private showFaultWindow(): void  {
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