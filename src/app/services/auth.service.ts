import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
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

    constructor(private http: HttpClient, private tokenStorageService: TokenStorageService) {
    }

    getToken(authData: AuthModel) : Observable<any> {
        return this.http.post(`${this.url}/GetToken`, authData).pipe(map((data: any) => data))
    }

    refreshToken() : Observable<AuthTokens> {
        return this.http.post(`${this.url}/RefreshToken`, {
            refreshToken: this.tokenStorageService.getRefreshToken()
        }).pipe(map((data: AuthTokens) => data))
    }
}