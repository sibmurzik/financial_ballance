import {HttpUtils} from "./http-utils";
import {Incomes} from "../components/incomes/incomes";

export class Categories {
    static  incomesCategories = [

    ];

    static expensesCategories = [

    ];

    static  getIncomesCategories() {
        return this.incomesCategories;

    }

    static getIncomesCategoriesTitles() {
        return this.incomesCategories.map(category => category.title);
    }

    static getIncomesCategoriesId (title) {
        const cat = this.incomesCategories.find(category => category.title === title);
        return cat ? cat.id : null;
    }

    static getExpensesCategories() {
        return this.expensesCategories;
    }

    static getExpensesCategoriesTitles() {
        return this.expensesCategories.map(category => category.title);
    }

    static getExpensesCategoriesId (title) {
        const cat = this.expensesCategories.find(category => category.title === title);
        return cat ? cat.id : null;
    }

    static async updateCategory(category) {
        const result = await  HttpUtils.requestWithAuth("GET", "/categories/" + category);
        let array = [];
        if (result.error ) {
            return false;
        }
        result.forEach((item) => {
            let categoryObject = {};
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