import config from "../config/config";
import type {SignupBodyType} from "../components/types/requestBodies/signup-body.type";
import type {LoginBodyType} from "../components/types/requestBodies/login-body.type";
import type {FinancialOperationBodyType} from "../components/types/requestBodies/financial-operation-body.type";
import type {CategoryBodyType} from "../components/types/requestBodies/category-body.type";


export class HttpUtils {


    public static async request(method = 'GET', url: string, body: SignupBodyType | LoginBodyType| null) : Promise<any> {
          const  headers: any= {
            'Accept': '*/*',
            'Content-Type': 'application/json',
          }



        let params:{} = {
            method: method,
            headers: headers,
        }
        if (body) {
            params = {
                method: method,
                headers: headers,
                body : JSON.stringify(body)
            }

        }
        return fetch(config.api + url, params)
            .then(response => response.json())
            .catch(error => error);

    }

    public static async requestWithAuth(method = 'GET', url: string, body:FinancialOperationBodyType| CategoryBodyType|null = null):Promise<any> {
        const token = this.getAccessToken();
        let headers: {} = {}

        if (token) {
              headers = {
                'Accept': '*/*',
                'Content-Type': 'application/json',
                'x-auth-token' : token,
              }
        } else {
            headers = {
                'Accept': '*/*',
                'Content-Type': 'application/json',
            }
        }
        let params:{} = {};
        if (body) {
            params = {
                method: method,
                headers: headers,
                body : JSON.stringify(body)
            }

        } else {
            params = {
                method: method,
                headers: headers,
            }
        }


        let result: any = null;
        try {
            let res:Response = await fetch(config.api + url, params);
            console.log("initial response", params);
            result = await res.json();
            console.log("initial response", result);
            if (!res.ok) {
                if (result.error && result.message === "jwt expired") {
                    try {
                   result = await this.repeatRequest(method, url, body);
                   console.log("repeat result", result);
                   if (result.error && result.message === "jwt expired") {
                       return result
                   }
                    }
                    catch (err) {
                        return {error: err};
                    }

                }

            }

        } catch (err) {
            return {error: err};
        }

        console.log(" result", result);

        return result;

    }

    private static async repeatRequest(method = 'GET', url: string, body:FinancialOperationBodyType| CategoryBodyType|null = null): Promise<any> {
        await this.refreshToken();
        return this.requestWithAuth(method, url, body);

    }


    public static checkAuthentification():boolean {
        const lumicoinData: string| null = sessionStorage.getItem("lumicoinData");
        let user: any = null;
        if (lumicoinData) {
            user = JSON.parse(lumicoinData);
        }

        return !!(user && user.accessToken && user.refreshToken);

    }

    private static   getAccessToken():string| null {
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

    public  static async refreshToken() :Promise<any> {
        const header :{} = {
            'Accept': '*/*',
            'Content-Type': 'application/json',
        }
        let lumicoinData: string| null = sessionStorage.getItem("lumicoinData");
        if (!lumicoinData) { lumicoinData= "" }


        return fetch(config.api + '/refresh', {
            method: 'POST',
            headers :header,
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