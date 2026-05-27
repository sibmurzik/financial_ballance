import {FormValidation} from "../utils/formValidation";
import {HttpUtils} from "../utils/http-utils";
import type {DataForValidationType} from "./types/data-for-validation.type";
import type {LoginBodyType} from "./types/requestBodies/login-body.type";
import type {LoginResponseType} from "./types/responseTypes/login-responce.type";
import type {FaultResponseType} from "./types/responseTypes/FaultResponseType";


export class Login {
    readonly openNewRoute: (url: string) => Promise<void>;
    readonly email: HTMLInputElement | null;
    readonly password: HTMLInputElement | null;
    readonly formFields: DataForValidationType[] | undefined;
    private rememberMe: HTMLInputElement | null;
    readonly loginButton: HTMLElement | null;
    private mesageWindow: HTMLElement | null;
    private messageWindowText: HTMLElement | null;


    constructor(openNewRoute: (url: string) => Promise<void>) {


        this.openNewRoute = openNewRoute;
        this.email = document.getElementById("emailInput") as HTMLInputElement;
        this.password = document.getElementById("passwordInput") as HTMLInputElement;
        let userEmail = localStorage.getItem("lumicoinUserEmail");
        let userPassword = localStorage.getItem("lumicoinUserPassword");
        if (userEmail && userPassword && this.email && this.password) {
            this.email.value = userEmail;
            this.password.value = userPassword;
        }

        const emailFeedback: HTMLElement | null = document.getElementById("emailFeedback");
        const passwordFeedback: HTMLElement | null = document.getElementById("passwordFeedback");

        if (emailFeedback && passwordFeedback) {


            this.formFields = [
                {
                    inputFiled: this.email,
                    inputType: "email",
                    validationFeedback: emailFeedback,
                },
                {
                    inputFiled: this.password,
                    inputType: "password",
                    validationFeedback: passwordFeedback,
                },

            ]
        }

        this.rememberMe = document.getElementById("checkRememberMe") as HTMLInputElement;
        this.loginButton = document.getElementById("loginButton");
        if (this.loginButton) {
            this.loginButton.addEventListener("click", this.login.bind(this, null, null));
        }


        this.mesageWindow = document.getElementById("registerWindow");
        this.messageWindowText = document.getElementById("windowMessage");

        const confirmButton: HTMLElement | null = document.getElementById("confirmButton");
        if (confirmButton) {
            confirmButton.addEventListener("click", this.closeMessageWindow.bind(this));
        }


    }

    public async login(email: string | null, password: string | null): Promise<void> {
        let isValidated: boolean = false;
        let body: LoginBodyType | null = null;

        if (email && password) {
            body = {
                "email": email,
                "password": password,
                "rememberMe": true,
            }
            isValidated = true;
        } else {
            if (FormValidation.formFieldsValidation(this.formFields)) {
                if (this.rememberMe && this.rememberMe.checked && this.email && this.password) {
                    localStorage.setItem("lumicoinUserEmail", this.email.value);
                    localStorage.setItem("lumicoinUserPassword", this.password.value);
                }
                isValidated = true;
                if (this.rememberMe && this.formFields && this.formFields[0] && this.formFields[1]) {
                    body = {
                        "email": (this.formFields[0].inputFiled as HTMLInputElement).value,
                        "password": (this.formFields[1].inputFiled as HTMLInputElement).value,
                        "rememberMe": this.rememberMe.checked,
                    }
                }

            }


        }
        if (isValidated) {
            let result: LoginResponseType | FaultResponseType = await HttpUtils.request("POST", "/login", body);

            if ((result as LoginResponseType).tokens && (result as LoginResponseType).user) {
                //console.log("enering to system");
                let userData: any = {}
                userData.name = (result as LoginResponseType).user.name;
                userData.lastName = (result as LoginResponseType).user.lastName;
                userData.id = (result as LoginResponseType).user.id;
                userData.accessToken = (result as LoginResponseType).tokens.accessToken;
                userData.refreshToken = (result as LoginResponseType).tokens.refreshToken;
                sessionStorage.setItem("lumicoinData", JSON.stringify(userData));
                this.openNewRoute("/").then();
            } else if ((result as FaultResponseType).error && (result as FaultResponseType).message) {
                this.showMessageWindow(`Ошибка. Неправильный  e-mail или пароль`);

            } else {
                this.showMessageWindow(`Ошибка входа из-за проблемы соединения с сервером`);
            }

        }


    }

    private showMessageWindow(message: string): void {
        if (this.mesageWindow && this.messageWindowText) {
            this.mesageWindow.style.display = "block";
            document.body.style.background = "rgba(0, 0, 0, 0.45)";
            this.messageWindowText.innerText = message;
        }
    }

    private closeMessageWindow(): void {
        if (this.mesageWindow) {
            this.mesageWindow.style.display = "none";
            document.body.style.background = "transparent";
        }

    }
}