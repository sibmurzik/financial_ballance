import {HttpUtils} from "./http-utils";

export class allFinancialData {


    static financialData = []

    static getAllFinancialData() {
        return this.financialData;
    }

    static getFinancialDataById(id) {
        return this.financialData.find(item => item.id === id);
    }

    static sortOperationsByCategory(type) {

    }

    static updateFinancialData(data) {

    }

    static async httpsRequestGettingUserOperations(period) {
        let result = await HttpUtils.requestWithAuth("GET", "/operations" + period);
        console.log("getting date", result);
        this.financialData = [];
        if (result.error ) {
            return false;
        }


            result.forEach((item) => {
                let operation = {};
                operation.id = item.id;
                operation.type = (item.type === 'expense') ? 'расход' : 'доход';
                operation.category = item.category;
                operation.amount = item.amount;
                operation.date = new Date(item.date);
                operation.comments = item.comment;
                operation.deleteButton = null;
                operation.editButton = null;
                this.financialData.push(operation);
            })
            this.financialData.sort((a, b) => a.id - b.id);
            return true;




    }

    static getDiagramsData() {
            let expenseData = [];
            let incomeData = [];
            this.financialData.forEach(item => {
                if (item.type === "расход") {
                    expenseData.push(item);
                } else {
                    incomeData.push(item);
                }
            });
            return [this.getCategorySummaryValue(expenseData), this.getCategorySummaryValue(incomeData)];
    }

    static getCategorySummaryValue(operationsArray) {
        let result = new Map();
        operationsArray.forEach(item => {
            let value = 0;
            if (result.has(item.category)) {
                value = result.get(item.category);

            }
            result.set(item.category, value + item.amount)
        })
        return result;

    }




}