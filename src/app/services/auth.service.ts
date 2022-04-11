import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {AuthModel, AuthTokens} from "../models/auth";
import {TokenStorageService} from "./token.service";
import {environment} from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private url = `${environment.apiEndpoint}Auth`;
    private headers = new HttpHeaders({'Content-Type': 'application/json'});

    constructor(private http: HttpClient, private tokenStorageService: TokenStorageService) {
    }

    getToken(authData: AuthModel) : Observable<any> {
        //this.tokenStorageService.deleteToken();
        return this.http.post(`${this.url}/GetToken`, authData, {
            withCredentials: true
        }).pipe(map((data: any) => data))
    }

    refreshToken() : Observable<AuthTokens> {
        let refreshToken = this.tokenStorageService.getRefreshToken();
        //console.log(refreshToken);
        //this.tokenStorageService.deleteToken();
        return this.http.post(`${this.url}/RefreshToken`, {
            refreshToken: refreshToken
        },{
            withCredentials: true
        }).pipe(map((data: AuthTokens) => data))
    }
}
