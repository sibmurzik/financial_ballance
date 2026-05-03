import {HttpUtils} from "../utils/http-utils";

export class sideMenu {

    constructor() {
        this.mainPageButton = document.getElementById('mainPageButton');
        this.incomeAndExpensesButton = document.getElementById('incomeAndExpensesButton');
        this.categoryButton = document.getElementById('categoryButton');
        this.incomeButton = document.getElementById('incomeButton');
        this.spenceButton = document.getElementById('spenceButton');
        this.dropdownNavigationSection = document.getElementById('dropdownNavigationSection');

        this.totalBalance = document.getElementById('totalBalance');
        this.userName = document.getElementById('userName');
        this.burgerMenu = document.getElementById('burgerMenu');
        this.sideMenu = document.getElementById('sideMenu');
        this.closeMenuButton = document.getElementById('closeButton');
        this.burgerMenu.addEventListener("click", (event)=> {
            this.sideMenu.style = 'display:flex';
            event.target.style = 'display:none';
            document.body.style.background = "rgba(0, 0, 0, 0.45)";
            this.closeMenuButton.style.display = "block";

        });

        this.closeMenuButton.addEventListener("click", (event)=> {
            this.sideMenu.style = 'display:none';
            document.body.style.background = "white";
            this.burgerMenu.style.display = "block";

        })

        window.matchMedia("(max-width: 768px)")
            .addEventListener('change', (event)=> {
                if( screen.width > 768) {
                    this.burgerMenu.style.display = "none";
                    this.sideMenu.style = "display:block";
                    this.closeMenuButton.style.display = "none";
                    document.body.style.background = "white";
                } else {
                    this.burgerMenu.style.display = "block";
                    this.sideMenu.style = "display:none";
                }
            });

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

    async updateUserBallance() {
        let result = await HttpUtils.request("GET", "/balance", true);
        if (result.error && result.message === "jwt expired") {}
        else if(result.balance >= 0) {
            this.totalBalance.innerText = result.balance + "$";
        }
    }

    updateUserName() {
        const userInfo = JSON.parse(sessionStorage.getItem("lumicoinData"));
        if (userInfo && userInfo.name && userInfo.lastName) {
            this.userName.innerText = userInfo.name + " " + userInfo.lastName;
        }
    }


}