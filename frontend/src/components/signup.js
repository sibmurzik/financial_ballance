import {FormValidation} from "../utils/formValidation";


export class Signup {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;



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
        this.loginButton.addEventListener("click", this.login.bind(this));

    }

    login() {

        if (FormValidation.formFieldsValidation(this.formFields)) {


            console.log("Form is valid");
            this.openNewRoute("/");

        } else {
            console.log("Form is wrong");
        }








    }
}