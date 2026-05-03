import {FormValidation} from "../utils/formValidation";
import {HttpUtils} from "../utils/http-utils";
import {Login} from "./login";


export class Signup {

    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.signedUp = false;
        this.formFields = [
            {
                inputFiled: document.getElementById("firstNameInput"),
                inputType: "name",
                validationFeedback: document.getElementById("firstNameFeedback")
            },
            {
                inputFiled: document.getElementById("lastNameInput"),
                inputType: "name",
                validationFeedback: document.getElementById("lastNameFeedback")
            },
            {
                inputFiled: document.getElementById("emailInput"),
                inputType: "email",
                validationFeedback: document.getElementById("emailFeedback")
            },
            {
                inputFiled: document.getElementById("passwordInput"),
                inputType: "password",
                validationFeedback: document.getElementById("passwordFeedback")
            },
            {
                inputFiled: document.getElementById("passwordConfirmInput"),
                inputType: "confirmPassword",
                validationFeedback: document.getElementById("passwordConfirmFeedback")
            },
        ]

        this.loginButton = document.getElementById("loginButton");
        this.loginButton.addEventListener("click", this.signup.bind(this));
        this.mesageWindow = document.getElementById("registerWindow");
        this.messageWindowText = document.getElementById("windowMessage");
        document.getElementById("confirmButton").addEventListener("click", this.closeMessageWindow.bind(this) );
    }

    async signup() {

        if (FormValidation.formFieldsValidation(this.formFields)) {
            const body = {
                "name": this.formFields[0].inputFiled.value,
                "lastName": this.formFields[1].inputFiled.value,
                "email": this.formFields[2].inputFiled.value,
                "password": this.formFields[3].inputFiled.value,
                "passwordRepeat": this.formFields[4].inputFiled.value
            }

            let result =  await HttpUtils.request("POST", "/signup", false, body);

            //console.log("Result", result);
            if (result.user ) {
                this.showMessageWindow(`Пользователь с e-mail ${body.email} успешно зарегистрирован`);
                this.signedUp = true;
            } else if(result.error && result.message === "User with given email already exist") {
                this.showMessageWindow(`Ошибка регистрации. Пользователь с e-mail ${body.email} уже был зарегистрирован`);
            } else {
                this.showMessageWindow(`Ошибка регистрации из-за проблемы соединения с сервером`);
            }


           // this.openNewRoute("/");

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
        if (this.signedUp) {
            this.signedUp = false;
            const login =  new Login(this.openNewRoute,  this.formFields[2].inputFiled.value, this.formFields[3].inputFiled.value,);
            login.login(this.formFields[2].inputFiled.value, this.formFields[3].inputFiled.value, this.signedUp)
                .then(r => console.log("login success"));
        }
    }
}