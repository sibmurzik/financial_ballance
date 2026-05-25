import {FormValidation} from "../utils/formValidation";
import {HttpUtils} from "../utils/http-utils";
import {Login} from "./login";
import type {DataForValidationType} from "./types/DataForValidation.type";
import type {SignupBodyType} from "./types/requestBodies/signup-body.type";
import type {ErrorResponseType} from "./types/error-response.type";
import type {SignedUpResponseType} from "./types/responseTypes/signed-up-response.type";
import type {FaultResponseType} from "./types/responseTypes/FaultResponseType";


export class Signup {
    readonly openNewRoute: (url: string) => Promise<void>;
    private signedUp: boolean;
    readonly formFields: DataForValidationType[] | undefined;
    readonly loginButton: HTMLElement | null;
    readonly mesageWindow: HTMLElement | null;
    readonly messageWindowText: HTMLElement | null;
    userEmail: string| null;
    password: string| null;


    constructor(openNewRoute:(url:string)=> Promise<void>) {
        this.openNewRoute = openNewRoute;
        this.signedUp = false;
        this.userEmail = null;
        this.password = null;

        const firstNameInput  = document.getElementById("firstNameInput") as HTMLInputElement ;
        const firstNameFeedback:HTMLElement|null = document.getElementById("firstNameFeedback") ;

        const lastNameInput = document.getElementById("lastNameInput") as HTMLInputElement;
        const lastNameFeedback:HTMLElement|null = document.getElementById("lastNameFeedback");

        const emailInput = document.getElementById("emailInput") as HTMLInputElement;
        const emailFeedback :HTMLElement|null = document.getElementById("emailFeedback");

        const passwordInput = document.getElementById("passwordInput")  as HTMLInputElement;
        const passwordFeedback:HTMLElement|null = document.getElementById("passwordFeedback");

        const passwordConfirmInput = document.getElementById("passwordConfirmInput") as HTMLInputElement;
        const passwordConfirmFeedback:HTMLElement|null = document.getElementById("passwordConfirmFeedback");



        if (firstNameInput && firstNameFeedback && lastNameInput && lastNameFeedback && emailInput && emailFeedback
        && passwordInput && passwordFeedback && passwordConfirmInput && passwordConfirmFeedback)
        {

            this.formFields = [
                {
                    inputFiled: firstNameInput,
                    inputType: "name",
                    validationFeedback: firstNameFeedback
                },
                {
                    inputFiled: lastNameInput,
                    inputType: "name",
                    validationFeedback: lastNameFeedback
                },
                {
                    inputFiled: emailInput,
                    inputType: "email",
                    validationFeedback: emailFeedback
                },
                {
                    inputFiled: passwordInput,
                    inputType: "password",
                    validationFeedback: passwordFeedback
                },
                {
                    inputFiled: passwordConfirmInput,
                    inputType: "confirmPassword",
                    validationFeedback: passwordConfirmFeedback
                },
            ]
        }

        this.loginButton = document.getElementById("loginButton");
        if (this.loginButton) {
            this.loginButton.addEventListener("click", this.signup.bind(this));
        }

        this.mesageWindow = document.getElementById("registerWindow");
        this.messageWindowText = document.getElementById("windowMessage");
        const confirmButton = document.getElementById("confirmButton");
        if (confirmButton) {
            confirmButton.addEventListener("click", this.closeMessageWindow.bind(this) );
        }


    }

    private async signup() : Promise<void> {
        if (this.formFields && this.formFields[0] && this.formFields[1]
        && this.formFields[2] && this.formFields[3] && this.formFields[4]) {


        if (FormValidation.formFieldsValidation(this.formFields)) {
            const body: SignupBodyType= {
                "name": (this.formFields[0].inputFiled as HTMLInputElement).value,
                "lastName": (this.formFields[1].inputFiled as HTMLInputElement).value,
                "email":(this.formFields[2].inputFiled as HTMLInputElement).value,
                "password": (this.formFields[3].inputFiled as HTMLInputElement).value,
                "passwordRepeat": (this.formFields[4].inputFiled as HTMLInputElement).value

            }

            let result: SignedUpResponseType | FaultResponseType = await HttpUtils.request("POST", "/signup", body);

            //console.log("Result", result);
            if ((result as SignedUpResponseType).user) {
                this.showMessageWindow(`Пользователь с e-mail ${body.email} успешно зарегистрирован`);
                this.signedUp = true;
                this.userEmail = body.email;
                this.password = body.password;
            } else if ((result as FaultResponseType).error && (result as FaultResponseType).message === "User with given email already exist") {
                this.showMessageWindow(`Ошибка регистрации. Пользователь с e-mail ${body.email} уже был зарегистрирован`);
            } else {
                this.showMessageWindow(`Ошибка регистрации из-за проблемы соединения с сервером`);
            }


            // this.openNewRoute("/");

        }
    }

    }
    private showMessageWindow(message : string): void {
        if (this.mesageWindow && this.messageWindowText) {
            this.mesageWindow.style.display = "block";
            document.body.style.background = "rgba(0, 0, 0, 0.45)";
            this.messageWindowText.innerText = message;
        }

    }

    private closeMessageWindow(): void {
        if (this.mesageWindow ) {
            this.mesageWindow.style.display = "none";
        }

        document.body.style.background = "transparent";
        if (this.signedUp && this.formFields && this.formFields[2] && this.formFields[3] ) {
            this.signedUp = false;
            const login =  new Login(this.openNewRoute);
            if (this.userEmail && this.password) {
                login.login(this.userEmail, this.password)
                    .then(r => console.log("login success"));
            }

        }
    }
}