import config from "../config/config";


export class HttpUtils {
    static headers = {
        'Accept': '*/*',
        'Content-Type': 'application/json',
    }

    static async request(method = 'GET', url, body = null) {
        const params = {
            method: method,
            headers: this.headers,
        }
        if (body) {
            params.body = JSON.stringify(body);
        }
        return fetch(config.api + url, params)
            .then(response => response.json())
            .catch(error => error);

    }

    static async requestWithAuth(method = 'GET', url, body = null) {
        const token = this.getAccessToken();
        const params = {
            method: method,
            headers: this.headers,
        }
        if (token) {
            params.headers['x-auth-token'] = token;
        }
        if (body) {
            params.body = JSON.stringify(body);
        }

        let result = null;
        try {
            let res = await fetch(config.api + url, params);
            result = await res.json();
            if (!res.ok) {
                if (result.error && result.message === "jwt expired") {
                    await this.refreshToken().then(token => {
                        if (token.tokens.accessToken && token.tokens.refreshToken) {
                            let token = this.getAccessToken();
                            if (token) {
                                params.headers['x-auth-token'] = token;
                            }
                            //console.log("params", params);
                        }
                    }).catch(error => console.log(error));

                    //console.log("12nd",  result);
                    let res = await fetch(config.api + url, params);
                    result = await res.json();
                    //console.log("22nd",  result);
                }

            }

        } catch (err) {
            return {error: err};
        }

        return result;

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

    static refreshToken() {


        return fetch(config.api + '/refresh', {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify({
                "refreshToken": JSON.parse(sessionStorage.getItem("lumicoinData")).refreshToken,
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
                let userData = JSON.parse(sessionStorage.getItem("lumicoinData"));
                userData.accessToken = data.tokens.accessToken;
                userData.refreshToken =data.tokens.refreshToken;
                sessionStorage.setItem("lumicoinData", JSON.stringify(userData));
                return data;
            })
            .catch(error => error);
    }


}