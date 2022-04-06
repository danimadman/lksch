import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {map, catchError} from 'rxjs/operators';
import {apiUrl} from "../options/settings";
import {AuthModel, AuthRefreshToken, AuthTokens} from "../models/auth";
import {TokenStorageService} from "./token.service";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private url = `${apiUrl}/api/Auth`;

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