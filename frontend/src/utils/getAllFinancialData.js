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
        let result = await HttpUtils.requestWithAuth("GET", "/operations?period=" + period);
        if (!result.error) {
            this.financialData = [];
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
        return false;

    }

    static getDiagramsData() {
        if (this.financialData.length > 0) {
            let expenseData = [];
            let incomeData = [];
            this.financialData.forEach(item => {
                if (item.type === "расход") {
                    expenseData.push(item);
                } else {
                    incomeData.push(item);
                }
            });
            //console.log("expence data", expenseData);
            //console.log("income data", incomeData);
            return [this.getCategorySummaryValue(expenseData), this.getCategorySummaryValue(incomeData)];
        }
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