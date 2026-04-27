export class allFinancialData {
    static financialData = [
        {
            id: 1,
            type: 'доход',
            category: 'зарплата',
            amount: 500,
            date: new Date('2022-09-11'),
            comments: "",
            deleteButton: null,
            editButton: null,

        },

        {
            id: 2,
            type: 'расход',
            category: 'жильё',
            amount: 2500,
            date: new Date('2022-09-12'),
            comments: "",
            deleteButton: null,
            editButton: null,

        },
    ]

    static getAllFinancialData() {
        return this.financialData;
    }

    static getFinancialDataById(id) {
        return this.financialData.find(item => item.id === id);
    }

}