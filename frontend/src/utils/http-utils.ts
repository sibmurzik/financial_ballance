import config from "../config/config";
import type {SignupBodyType} from "../components/types/requestBodies/signup-body.type";
import type {LoginBodyType} from "../components/types/requestBodies/logn-body.type";
import type {FinancialOperationBodyType} from "../components/types/requestBodies/financial-operation-body.type";
import type {CategoryBodyType} from "../components/types/requestBodies/category-body.type";


export class HttpUtils {
    private static headers: any = {
        'Accept': '*/*',
        'Content-Type': 'application/json',
    }

    public static async request(method = 'GET', url: string, body: SignupBodyType | LoginBodyType| null) : Promise<any> {
        let params:{} = {
            method: method,
            headers: this.headers,
        }
        if (body) {
            params = {
                method: method,
                headers: this.headers,
                body : JSON.stringify(body)
            }

        }
        return fetch(config.api + url, params)
            .then(response => response.json())
            .catch(error => error);

    }

    public static async requestWithAuth(method = 'GET', url: string, body:FinancialOperationBodyType| CategoryBodyType|null = null):Promise<any> {
        const token = this.getAccessToken();
        let params:{} = {
            method: method,
            headers: this.headers,
        }
        if (token) {
            this.headers = {
                'Accept': '*/*',
                'Content-Type': 'application/json',
                'x-auth-token' : token,
            }

        }
        if (body) {
            params = {
                method: method,
                headers: this.headers,
                body : JSON.stringify(body)
            }

        }

        let result: any = null;
        try {
            let res:Response = await fetch(config.api + url, params);
            result = await res.json();
            if (!res.ok) {
                if (result.error && result.message === "jwt expired") {
                    await this.refreshToken().then(token => {
                        if (token.tokens.accessToken && token.tokens.refreshToken) {
                            let token = this.getAccessToken();
                            if (token) {
                                this.headers = {
                                    'Accept': '*/*',
                                    'Content-Type': 'application/json',
                                    'x-auth-token' : token,
                                }
                            }
                            //console.log("params", params);
                        }
                    }).catch(error => console.log(error));

                    //console.log("12nd",  result);
                    let res: Response = await fetch(config.api + url, params);
                    result = await res.json();
                    //console.log("22nd",  result);
                }

            }

        } catch (err) {
            return {error: err};
        }

        return result;

    }


    public static checkAuthentification():boolean {
        const lumicoinData: string| null = sessionStorage.getItem("lumicoinData");
        let user: any = null;
        if (lumicoinData) {
            user = JSON.parse(lumicoinData);
        }

        return !!(user && user.accessToken && user.refreshToken);

    }

    public static getAccessToken():string| null {
        const lumicoinData: string| null = sessionStorage.getItem("lumicoinData");
        let userInfo:any = null;
        if (lumicoinData) {
            userInfo = JSON.parse(lumicoinData);
        }

        if (userInfo && userInfo.accessToken) {
            return userInfo.accessToken;
        }
        return null;
    }

    public static refreshToken() :Promise<any> {
        let lumicoinData: string| null = sessionStorage.getItem("lumicoinData");
        if (!lumicoinData) { lumicoinData= "" }


        return fetch(config.api + '/refresh', {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify({
                "refreshToken": JSON.parse(lumicoinData as string).refreshToken,
            })
        })
            .then(response => {
                if (response.ok) {
                    return Promise.resolve(response.json());
                }
                return Promise.reject(response.json());
            })
            .then(data => {
                //console.log("data", data);
                const lumicoinData: string| null = sessionStorage.getItem("lumicoinData");
                let userData: any = null;
                if (lumicoinData) {
                    userData = JSON.parse(lumicoinData);
                }
                if (userData) {
                    userData.accessToken = data.tokens.accessToken;
                    userData.refreshToken =data.tokens.refreshToken;
                    sessionStorage.setItem("lumicoinData", JSON.stringify(userData));
                }


                return data;
            })
            .catch(error => error);
    }


}