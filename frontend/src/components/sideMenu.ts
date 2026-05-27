import {HttpUtils} from "../utils/http-utils";
import type {BalanceResponseType} from "./types/responseTypes/ballance-response.type";
import type {ErrorResponseType} from "./types/error-response.type";
import type {UserDataType} from "./types/user-data.type";

export class sideMenu {
    private sideBarInfoUpdated: boolean;
    readonly mainPageButton: HTMLElement | null;
    readonly incomeAndExpensesButton: HTMLElement | null;
    readonly categoryButton: HTMLElement | null;
    readonly incomeButton: HTMLElement | null;
    readonly spenceButton: HTMLElement | null;
    readonly dropdownNavigationSection: HTMLElement | null;
    readonly exitMenu: HTMLElement | null;
    private totalBalance: HTMLElement | null;
    private userName: HTMLElement | null;
    readonly burgerMenu: HTMLElement | null;
    readonly sideMenu: HTMLElement | null;
    readonly closeMenuButton: HTMLElement | null;
    private navElements: (HTMLElement | null)[];

    constructor() {
        this.sideBarInfoUpdated = false;
        this.mainPageButton = document.getElementById('mainPageButton');
        this.incomeAndExpensesButton = document.getElementById('incomeAndExpensesButton');
        this.categoryButton = document.getElementById('categoryButton');
        this.incomeButton = document.getElementById('incomeButton');
        this.spenceButton = document.getElementById('spenceButton');
        this.dropdownNavigationSection = document.getElementById('dropdownNavigationSection');
        this.exitMenu = document.getElementById('exitMenu');

        const exitButton = document.getElementById('exitButton');
        if (exitButton) {
            exitButton.addEventListener("click", (): void => {
                sessionStorage.clear();
                window.location.assign('/login');

            });

        }

        const closeLogout = document.getElementById('closeLogout');
        if (closeLogout) {
            closeLogout.addEventListener("click", (): void => {
                if (this.exitMenu) {
                    this.exitMenu.style.display = 'none';
                }

            });
        }


        this.totalBalance = document.getElementById('totalBalance');
        this.userName = document.getElementById('userName');
        this.burgerMenu = document.getElementById('burgerMenu');
        this.sideMenu = document.getElementById('sideMenu');
        this.closeMenuButton = document.getElementById('closeButton');

        if (this.burgerMenu) {
            this.burgerMenu.addEventListener("click", (event: PointerEvent): void => {
                if (this.closeMenuButton && this.sideMenu && event.target) {
                    this.sideMenu.style = 'display:flex';
                    (event.target as HTMLElement).style = 'display:none';
                    document.body.style.background = "rgba(0, 0, 0, 0.45)";
                    this.closeMenuButton.style.display = "block";

                }


            });

        }

        if (this.closeMenuButton) {
            this.closeMenuButton.addEventListener("click", (event: PointerEvent): void => {
                if (this.sideMenu && this.burgerMenu) {
                    this.sideMenu.style = 'display:none';
                    document.body.style.background = "white";
                    this.burgerMenu.style.display = "block";
                }
            })
        }


        window.matchMedia("(max-width: 768px)")
            .addEventListener('change', (event: MediaQueryListEvent): void => {
                if (this.burgerMenu && this.sideMenu && this.closeMenuButton) {
                    if (screen.width > 768) {
                        this.burgerMenu.style.display = "none";
                        this.sideMenu.style = "display:block";
                        this.closeMenuButton.style.display = "none";
                        document.body.style.background = "white";
                    } else {
                        this.burgerMenu.style.display = "block";
                        this.sideMenu.style = "display:none";
                    }

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

        if (this.categoryButton) {
            this.categoryButton.addEventListener('click', (event: PointerEvent): void => {
                if (this.dropdownNavigationSection) {
                    this.dropdownNavigationSection.classList.toggle('active');
                }

            })
        }

        const logoutButton = document.getElementById('logoutButton');
        if (logoutButton) {
            logoutButton.addEventListener('click', (event: PointerEvent): void => this.logoutMenu())
        }

        this.updateSideBarInfo().then();


    }

    private logoutMenu(): void {
        if (this.exitMenu) {
            this.exitMenu.style.display = "flex";
        }
    }

    private clearNavigationSection(): void {
        //console.log (this.navElements);
        this.navElements.forEach((navElement: HTMLElement | null): void => {
            if (navElement) {
                navElement.classList.remove('active');
            }

        })

    }

    public paintActiveElement(page: string): void {
        this.clearNavigationSection();
        if(this.mainPageButton && this.dropdownNavigationSection && this.incomeButton
            && this.spenceButton && this.incomeAndExpensesButton) {

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

    public async updateUserBallance():Promise<void> {
        let result: BalanceResponseType | ErrorResponseType = await HttpUtils.requestWithAuth("GET", "/balance");
            if ((result as BalanceResponseType).balance >= 0 && this.totalBalance ) {
                this.totalBalance.innerText = (result as BalanceResponseType).balance + " $";
            } else {
                console.error((result as ErrorResponseType).error);
            }


    }

    private updateUserName(): void {
        const sessionStorageData:string | null = sessionStorage.getItem("lumicoinData");
        let userInfo:UserDataType| null = null;
        if (sessionStorageData) {
            userInfo = JSON.parse(sessionStorageData);
        }

        if (userInfo && userInfo.name && userInfo.lastName && this.userName) {
            this.userName.innerText = userInfo.name + " " + userInfo.lastName;
        }
    }

    public async updateSideBarInfo() {
        if (!this.sideBarInfoUpdated) {
            await this.updateUserBallance();
            this.updateUserName();
            this.sideBarInfoUpdated = true;
        }
    }


}