import config from "../config/config";

export class HttpUtils {
    static async request(method = 'GET', url, useAuth = true, body = null) {
        const params = {
            method : method,
            headers : {
                'Accept': '*/*',
                'Content-Type': 'application/json',
            }
        }

        if (useAuth) {
            let token = this.getAccessToken();
            if (token) {
                params.headers['x-auth-token'] = token;
            }



        }
        if(body) {
            params.body = JSON.stringify(body);
        }


        // 1234Dyma$

        return  fetch(config.api + url, params)
            .then(res => {
                if (!res.ok) {
                    //console.log(res.status);
                }
                    return res.json()
                })
            .catch(err => err);




    }

    static checkAuthentification() {
        const user = JSON.parse(sessionStorage.getItem("lumicoinData"));
        return !!(user && user.accessToken && user.refreshToken);

    }

    static getAccessToken() {
        const userInfo = JSON.parse(sessionStorage.getItem("lumicoinData"));
        if (userInfo && userInfo.accessToken) {
            return userInfo.accessToken;
        }
        return null;
    }

    static async  refreshToken() {
        const body = {
            "refreshToken": JSON.parse(sessionStorage.getItem("lumicoinData")).refreshToken
        }

        return this.request("POST", "/refresh", false, body).then(res => {
            let userData = JSON.parse(sessionStorage.getItem("lumicoinData"));
            userData.accessToken = res.tokens.accessToken;
            userData.refreshToken = res.tokens.refreshToken;
            sessionStorage.setItem("lumicoinData", JSON.stringify(userData));
            return res.json();

        }).catch(err => err);
    }
}