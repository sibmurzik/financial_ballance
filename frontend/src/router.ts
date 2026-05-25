import {Login} from "./components/login";
import {Signup} from "./components/signup";
import {Main} from "./components/main";
import {sideMenu} from "./components/sideMenu";
import {Incomes} from "./components/incomes/incomes";
import {Expenses} from "./components/expences/expenses";
import {CategoryEditCreating} from "./components/ballance_category/edit_creating_category";
import {AllFinancialStatistic} from "./components/financial_statistic_and_operation/all_financial_statistic";
import {FinancialOperationCreateEdit} from "./components/financial_statistic_and_operation/finance_operation_creating_editing";
import type {RouteType} from "./components/types/route.type";

export class Router {
    private content: HTMLElement | null;
    private title: HTMLElement | null;
    //private sidebarLayout: HTMLElement | null;
    //private mainContent: HTMLElement | null;
    private sideMenuInstance: sideMenu |null;
    private routes:RouteType[];
    
    
    
    constructor() {
        this.content = document.getElementById('content');
        this.title = document.getElementById('title');
        //this.sidebarLayout = document.getElementById('sidebarLayout');
        //this.mainContent = document.getElementById('mainContent');
        this.sideMenuInstance = null;


        this.routes = [
            {
                route: '/',
                title: 'Главная',
                filePathTemplate: '/templates/main.html',
                load: () => {
                    new Main(this.sideMenuInstance as sideMenu, this.openNewRoute.bind(this));


                },
                existSidebar: true,

            },

            {
                route: '/incomes',
                title: 'Категории доходов',
                filePathTemplate: '/templates/balance_categories/balance_categories.html',
                load: () => {
                    new Incomes(this.sideMenuInstance as sideMenu, this.openNewRoute.bind(this));

                },
                existSidebar: true,

            },

            {
                route: '/incomes/create',
                title: 'Создание категории доходов',
                filePathTemplate: '/templates/balance_categories/edit_creating_category.html',
                load: () => {
                    new CategoryEditCreating(this.sideMenuInstance as sideMenu, this.openNewRoute.bind(this), "create-incomes");

                },
                existSidebar: true,

            },

            {
                route: '/incomes/edit',
                title: 'Редактирование категории доходов',
                filePathTemplate: '/templates/balance_categories/edit_creating_category.html',
                load: () => {
                    new CategoryEditCreating(this.sideMenuInstance as sideMenu, this.openNewRoute.bind(this), "edit-incomes");
                },
                existSidebar: true,

            },

            {
                route: '/expenses',
                title: 'Категории расходов',
                filePathTemplate: '/templates/balance_categories/balance_categories.html',
                load: () => {
                    new Expenses(this.sideMenuInstance as sideMenu, this.openNewRoute.bind(this));

                },
                existSidebar: true,

            },

            {
                route: '/expenses/create',
                title: 'Создание категории расходов',
                filePathTemplate: '/templates/balance_categories/edit_creating_category.html',
                load: () => {
                    new CategoryEditCreating(this.sideMenuInstance as sideMenu, this.openNewRoute.bind(this), "create-expenses")
                },
                existSidebar: true,

            },

            {
                route: '/expenses/edit',
                title: 'Редактирование категории расходов',
                filePathTemplate: '/templates/balance_categories/edit_creating_category.html',
                load: () => {
                    new CategoryEditCreating(this.sideMenuInstance as sideMenu, this.openNewRoute.bind(this), "edit-expenses");

                },
                existSidebar: true,

            },

            {
                route: '/financial',
                title: 'Доходы и расходы',
                filePathTemplate: '/templates/financial_statistic/financial_statistic.html',
                load: () => {
                    new AllFinancialStatistic(this.sideMenuInstance as sideMenu, this.openNewRoute.bind(this));

                },
                existSidebar: true,

            },

            {
                route: '/financial/create/income',
                title: 'Создание дохода или расхода',
                filePathTemplate: '/templates/financial_statistic/edit_creating_operation.html',
                load: () => {
                    new FinancialOperationCreateEdit(this.sideMenuInstance as sideMenu, this.openNewRoute.bind(this), "create-incomes");

                },
                existSidebar: true,

            },

            {
                route: '/financial/create/expense',
                title: 'Создание дохода или расхода',
                filePathTemplate: '/templates/financial_statistic/edit_creating_operation.html',
                load: () => {
                    new FinancialOperationCreateEdit(this.sideMenuInstance as sideMenu, this.openNewRoute.bind(this), "create-expenses");

                },
                existSidebar: true,

            },

            {
                route: '/financial/edit/income',
                title: 'Редактирование дохода или расхода',
                filePathTemplate: '/templates/financial_statistic/edit_creating_operation.html',
                load: () => {
                    new FinancialOperationCreateEdit(this.sideMenuInstance as sideMenu, this.openNewRoute.bind(this), "edit-incomes");

                },
                existSidebar: true,

            },

            {
                route: '/financial/edit/expense',
                title: 'Редактирование дохода или расхода',
                filePathTemplate: '/templates/financial_statistic/edit_creating_operation.html',
                load: () => {
                    new FinancialOperationCreateEdit(this.sideMenuInstance as sideMenu, this.openNewRoute.bind(this), "edit-expenses");

                },
                existSidebar: true,

            },




            {
                route: '/login',
                title: 'Авторизация',
                filePathTemplate: '/templates/login.html',
                load: () => {
                    new Login(this.openNewRoute.bind(this));

                },
                existSidebar: false,
            },

            {
                route: '/signup',
                title: 'Регистрация',
                filePathTemplate: '/templates/signup.html',
                load: () => {
                    new Signup(this.openNewRoute.bind(this));

                },
                existSidebar: false,

            },

        ];

        this.initEvents();

    }

    private initEvents(): void {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
        document.addEventListener('click', this.ClickHandler.bind(this));

    }

    private async ClickHandler(e:Event):Promise<void> {
        let element:HTMLLinkElement|null = null;
        const target = e.target as HTMLLinkElement;
        if (target !== null && target instanceof HTMLElement) {
            if (target.nodeName === 'A') {
                element = target;

            } else if (target.nodeName !== null) {
                if (target.parentNode !==null &&  target.parentNode.nodeName === 'A') {
                    element = target.parentNode as HTMLLinkElement;
                }

        }

        }


        if (element) {
            //console.log("Element" + element);
            e.preventDefault();
            const url:string = element.href.replace(window.location.origin, '');
            if (!url || url === '/#' || url.startsWith('javascript:void(0)')) {
                return;
            }

            await this.openNewRoute(url);


        }


    }

    public async openNewRoute(url: string): Promise<void> {
        history.pushState({}, '', url);
        await this.activateRoute();
    }

    private async activateRoute() : Promise<void> {
        const url:string = window.location.pathname;
        const currentRoute:RouteType | undefined = this.routes.find((route) => route.route === url);
        if (currentRoute) {
            if (currentRoute.existSidebar) {
                if (this.content) {
                    this.content.innerHTML = await fetch('/templates/sidebar.html').then(res => res.text());
                    this.content = document.getElementById('mainContent');
                }


            } else {
                this.content = document.getElementById('content');
            }

            if(this.content) {
                this.content.innerHTML = await fetch(currentRoute.filePathTemplate).then(res => res.text());
            }

            if (this.title) {
                this.title.innerText = currentRoute.title + " | Lumincoin finance";
            }

            if (currentRoute.existSidebar) {
                if (this.sideMenuInstance === null) {
                    this.sideMenuInstance = new sideMenu();
                }
            } else {
                this.sideMenuInstance = null;
            }
            currentRoute.load();

        }
    }

}