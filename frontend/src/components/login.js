import {FormValidation} from "../utils/formValidation";


export class Login {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.email = document.getElementById("emailInput");
        this.password = document.getElementById("passwordInput");

        let userEmail =  localStorage.getItem("lumicoinUserEmail");
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
        this.loginButton.addEventListener("click", this.login.bind(this));

    }

    login() {

        if (FormValidation.formFieldsValidation(this.formFields)) {
            if (this.rememberMe.checked ) {
                localStorage.setItem("lumicoinUserEmail", this.email.value );
                localStorage.setItem("lumicoinUserPassword", this.password.value);
            }

            console.log("Form is valid");
            this.openNewRoute("/");

        } else {
            console.log("Form is wrong");
        }








    }
}