import {Injectable} from '@angular/core';
import {
    access_token_key,
    refresh_token_key,
    access_token_type,
    lkschool_tokens, loginUrl
} from "../options/settings";
import {CookieService} from "ngx-cookie-service";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class TokenStorageService {
    constructor(private cookieService: CookieService) {
    }

    setToken(data: any) : void {
        localStorage.removeItem(lkschool_tokens);
        localStorage.setItem(lkschool_tokens, JSON.stringify(data));

        /*this.cookieService.delete(access_token_key);
        this.cookieService.set(access_token_key, data.accessToken, data.expiresIn);

        this.cookieService.delete(access_token_type);
        this.cookieService.set(access_token_type, data.tokenType, data.expiresIn);

        this.cookieService.delete(refresh_token_key);
        this.cookieService.set(refresh_token_key, data.refreshToken, data.expiresIn + refresh_token_expires);*/
    }

    getAuthToken() : string | null {
        //return this.cookieService.get(access_token_key);
        let tokens = this.getToken();
        if (tokens == null)
            return null;
        return tokens.accessToken;
    }

    getAuthTokenType() : string | null {
        //return this.cookieService.get(access_token_type);
        let tokens = this.getToken();
        if (tokens == null)
            return null;
        return tokens.tokenType;
    }

    getRefreshToken() : string | null {
        //return this.cookieService.get(refresh_token_key);
        let tokens = this.getToken();
        if (tokens == null)
            return null;
        return tokens.refreshToken;
    }

    getToken() : any | null {
        let tokensJson = localStorage.getItem(lkschool_tokens);
        if (tokensJson == null)
            return null;

        return JSON.parse(tokensJson);
    }

    deleteToken() : void {
        localStorage.removeItem(lkschool_tokens);

        //this.cookieService.delete(access_token_key);
        //this.cookieService.delete(refresh_token_key);
    }
}