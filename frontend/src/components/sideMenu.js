export class sideMenu {

    constructor() {
        this.mainPageButton = document.getElementById('mainPageButton');
        this.incomeAndExpensesButton = document.getElementById('incomeAndExpensesButton');
        this.categoryButton = document.getElementById('categoryButton');
        this.incomeButton = document.getElementById('incomeButton');
        this.spenceButton = document.getElementById('spenceButton');
        this.dropdownNavigationSection = document.getElementById('dropdownNavigationSection');

        this.navElements = [
            this.mainPageButton,
            this.incomeAndExpensesButton,
            this.categoryButton,
            this.incomeButton,
            this.spenceButton,
            this.dropdownNavigationSection,
        ]

        this.categoryButton.addEventListener('click', (event) => {
            this.dropdownNavigationSection.classList.toggle('active');
        })




    }

    clearNavigationSection() {
        //console.log (this.navElements);
        this.navElements.forEach(navElement => {
            navElement.classList.remove('active');
        })


    }

    paintActiveElement(page) {
        this.clearNavigationSection();
        switch (page) {
            case 'mainPage':
                this.mainPageButton.classList.add('active');
                break;

            case 'incomesPage':
                this.dropdownNavigationSection.classList.add('active');
                this.incomeButton.classList.add('active');
                break;

            case 'expensesPage':
                this.dropdownNavigationSection.classList.add('active');
                this.spenceButton.classList.add('active');
                break;

            case 'financialPage':
                this.incomeAndExpensesButton.classList.add('active');

        }
    }


}