import {HttpUtils} from "./http-utils";
import type {CategoryObjectType} from "../components/types/category-object.type";
import type {GetCategoriesResponseType} from "../components/types/responseTypes/get-category-response.type";
import type {FaultResponseType} from "../components/types/responseTypes/FaultResponseType";

export class Categories {
    private static   incomesCategories:CategoryObjectType[] = [

    ];

    private static expensesCategories: CategoryObjectType[] = [

    ];

    public  static  getIncomesCategories() :CategoryObjectType[] {
        return this.incomesCategories;

    }

    public static getIncomesCategoriesTitles():string[] {

        return this.incomesCategories.map((category: CategoryObjectType): string  => category.title);
    }

    public static getIncomesCategoriesId (title: string): number| null {
        const cat: CategoryObjectType | undefined = this.incomesCategories.find((category: CategoryObjectType): boolean => category.title === title);
        return cat ? cat.id : null;
    }

    public static getExpensesCategories() : CategoryObjectType[] {
        return this.expensesCategories;
    }

    public static getExpensesCategoriesTitles(): string[] {
        return this.expensesCategories.map((category: CategoryObjectType):string => category.title);
    }

    public static getExpensesCategoriesId (title: string): number | null {
        const cat : CategoryObjectType | undefined = this.expensesCategories.find(category => category.title === title);
        return cat ? cat.id : null;
    }

    public static async updateCategory(category:"income" | "expense"):Promise<boolean> {
        const result: GetCategoriesResponseType[] | FaultResponseType = await  HttpUtils.requestWithAuth("GET", "/categories/" + category);
        let array: CategoryObjectType[] = [];
        if ((result as FaultResponseType).error ) {
            return false;
        }
        (result as GetCategoriesResponseType[]).forEach((item: GetCategoriesResponseType): void => {
            let categoryObject: CategoryObjectType  = {
                id : 0,
                title : "",
                element : null,
                editButton : null,
                deleteButton :  null,
            };
            categoryObject.id = item.id;
            categoryObject.title = item.title;
            categoryObject.element = null;
            categoryObject.editButton = null;
            categoryObject.deleteButton = null;
            array.push(categoryObject);
        });
        if (category === "expense") {
            this.expensesCategories= [];
            this.expensesCategories = JSON.parse(JSON.stringify(array));
        } else if (category === "income") {
            this.incomesCategories =  [];
            this.incomesCategories = JSON.parse(JSON.stringify(array));
        }
        //console.log(this.incomesCategories);
        //console.log(this.expensesCategories);
        return true;

    }
}