import {HttpUtils} from "./http-utils";
import type {FinancialOperationType} from "../components/types/financial-operation.type";
import type {GetOperationResponseType} from "../components/types/responseTypes/get-operation-response.type";
import type {FaultResponseType} from "../components/types/responseTypes/FaultResponseType";

export class allFinancialData {


    private static financialData: FinancialOperationType[] = [];

    public static getAllFinancialData(): FinancialOperationType[] {
        return this.financialData;
    }

    static getFinancialDataById(id: number): FinancialOperationType | undefined {
        if (this.financialData.length > 0) {
            return this.financialData.find((item: FinancialOperationType): boolean => item.id === id);
        }


    }


    public static async httpsRequestGettingUserOperations(period: string): Promise<boolean> {
        let result: GetOperationResponseType[] | FaultResponseType = await HttpUtils.requestWithAuth("GET", "/operations" + period);
        //console.log("getting date", result);
        this.financialData = [];
        if ((result as FaultResponseType).error) {
            return false;
        }


        (result as GetOperationResponseType[]).forEach((item: GetOperationResponseType): void => {
            let operation: FinancialOperationType = {
                id: 0,
                type: 'расход',
                category: "",
                amount: 0,
                date: null,
                comments: "",
                deleteButton: null,
                editButton: null
            };
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

    public static getDiagramsData(): Map<string, number>[] {
        let expenseData: FinancialOperationType[] = [];
        let incomeData: FinancialOperationType[] = [];
        this.financialData.forEach((item: FinancialOperationType): void => {
            if (item.type === "расход") {
                expenseData.push(item);
            } else {
                incomeData.push(item);
            }
        });
        return [this.getCategorySummaryValue(expenseData), this.getCategorySummaryValue(incomeData)];
    }

    public static getCategorySummaryValue(operationsArray: FinancialOperationType[]): Map<string, number> {
        let result: Map<string, number> = new Map();
        operationsArray.forEach((item: FinancialOperationType): void => {
            let value: number = 0;
            if (result.has(item.category)) {
                const mapValue:number | undefined = result.get(item.category);
                if (mapValue !== undefined) {
                    value= mapValue;
                }

            }

            result.set(item.category, value + item.amount)


        })
        return result;

    }


}