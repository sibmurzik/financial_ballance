export class Categories {
    static  incomesCategories = [
        {
            id: 1,
            title: 'Депозиты',
            element: null,
            editButton: null,
            deleteButton: null,

        },
        {
            id: 2,
            title: 'Зарплата',
            element: null,
            editButton: null,
            deleteButton: null,
        },
        {
            id: 3,
            title: 'Сбережения',
            element: null,
            editButton: null,
            deleteButton: null,
        },
        {
            id: 4,
            title: 'Инвестиции',
            element: null,
            editButton: null,
            deleteButton: null,
        },
    ];

    static expensesCategories = [
        {
            id: 1,
            title: 'Еда',
            element: null,
            editButton: null,
            deleteButton: null,

        },
        {
            id: 2,
            title: 'Жильё',
            element: null,
            editButton: null,
            deleteButton: null,
        },
        {
            id: 3,
            title: 'Здоровье',
            element: null,
            editButton: null,
            deleteButton: null,
        },
        {
            id: 4,
            title: 'Кафе',
            element: null,
            editButton: null,
            deleteButton: null,
        },

        {
            id: 5,
            title: 'Авто',
            element: null,
            editButton: null,
            deleteButton: null,
        },
        {
            id: 6,
            title: 'Одежда',
            element: null,
            editButton: null,
            deleteButton: null,
        },
        {
            id: 7,
            title: 'Развлечения',
            element: null,
            editButton: null,
            deleteButton: null,
        },
        {
            id: 8,
            title: 'Счета',
            element: null,
            editButton: null,
            deleteButton: null,
        },
        {
            id: 9,
            title: 'Спорт',
            element: null,
            editButton: null,
            deleteButton: null,
        },


    ];

    static getIncomesCategories() {
        return this.incomesCategories;
    }

    static getIncomesCategoriesTitles() {
        return this.incomesCategories.map(category => category.title);
    }

    static getExpensesCategories() {
        return this.expensesCategories;
    }

    static getExpensesCategoriesTitles() {
        return this.expensesCategories.map(category => category.title);
    }
}