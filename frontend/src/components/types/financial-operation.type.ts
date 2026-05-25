export type FinancialOperationType = {
    id: number,
    type : 'расход' | 'доход',
    category : string,
    amount : number,
    date : Date | null ,
    comments : string;
    deleteButton : HTMLElement | null;
    editButton : HTMLElement | null;
}