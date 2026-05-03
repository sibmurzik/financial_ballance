import {FormValidation} from "../utils/formValidation";
import {HttpUtils} from "../utils/http-utils";


export class Login {
    constructor(openNewRoute) {


        this.openNewRoute = openNewRoute;
        this.email = document.getElementById("emailInput");
        this.password = document.getElementById("passwordInput");
        let userEmail = localStorage.getItem("lumicoinUserEmail");
        let userPassword = localStorage.getItem("lumicoinUserPassword");
        if (userEmail && userPassword) {
            this.email.value = userEmail;
            this.password.value = userPassword;
        }


        this.formFields = [
            {
                inputFiled: this.email,
                inputType: "email",
                validationFeedback: document.getElementById("emailFeedback")
            },
            {
                inputFiled: this.password,
                inputType: "password",
                validationFeedback: document.getElementById("passwordFeedback")
            },

        ]

        this.rememberMe = document.getElementById("checkRememberMe");
        this.loginButton = document.getElementById("loginButton");
        this.loginButton.addEventListener("click", this.login.bind(this, null, null));

        this.mesageWindow = document.getElementById("registerWindow");
        this.messageWindowText = document.getElementById("windowMessage");
        document.getElementById("confirmButton").addEventListener("click", this.closeMessageWindow.bind(this) );

    }

    async login(email, password) {
        let isValidated = false;
        let body = {}

        if (email && password) {
            body = {
                "email": email,
                "password": password,
                "rememberMe": true,
            }
            isValidated = true;
        } else {
            if (FormValidation.formFieldsValidation(this.formFields)) {
                if (this.rememberMe.checked) {
                    localStorage.setItem("lumicoinUserEmail", this.email.value);
                    localStorage.setItem("lumicoinUserPassword", this.password.value);
                }
                isValidated = true;
                body = {
                    "email": this.formFields[0].inputFiled.value,
                    "password": this.formFields[1].inputFiled.value,
                    "rememberMe": this.rememberMe.checked,
                }

            }


        }
        if (isValidated) {
            let result = await HttpUtils.request("POST", "/login", false, body);

            if (result.tokens  && result.user) {
                //console.log("enering to system");
                let userData = {}
                userData.name = result.user.name;
                userData.lastName = result.user.lastName;
                userData.id = result.user.id;
                userData.accessToken = result.tokens.accessToken;
                userData.refreshToken = result.tokens.refreshToken;
                sessionStorage.setItem("lumicoinData", JSON.stringify(userData));
                this.openNewRoute("/");
            } else if (result.error  && result.message) {
                this.showMessageWindow(`Ошибка. Неправильный  e-mail или пароль`);

            } else {
                this.showMessageWindow(`Ошибка входа из-за проблемы соединения с сервером`);
            }

        }




    }
    showMessageWindow(message) {
        this.mesageWindow.style.display = "block";
        document.body.style.background = "rgba(0, 0, 0, 0.45)";
        this.messageWindowText.innerText = message;
    }
    closeMessageWindow() {
        this.mesageWindow.style.display = "none";
        document.body.style.background = "transparent";

    }
}