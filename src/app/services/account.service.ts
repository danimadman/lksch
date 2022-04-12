import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LoginModel, ForgotPasswordModel, ResetPasswordModel, UserModel} from "../models/account";
import {Observable, throwError} from 'rxjs';
import {map, catchError} from 'rxjs/operators';
import {RegisterModel, ResendEmailConfirmModel} from "../models/register";
import {environment} from "../../environments/environment";

@Injectable()
export class AccountService {
    private url = `${environment.apiEndpoint}Account`;

    constructor(private http: HttpClient) {
    }

    login(loginModel: LoginModel) : Observable<boolean> {
        return this.http.post(`${this.url}/Login`, loginModel).pipe(
            map((data: boolean) => data),
            catchError((err) => throwError(err))
        )
    }
    
    logout() : Observable<boolean> {
        return this.http.get(`${this.url}/Logout`).pipe(
            map((data: boolean) => data),
            catchError((err) => throwError(err))
        )
    }
    
    forgotPassword(model: ForgotPasswordModel): Observable<boolean> {
        return this.http.post(`${this.url}/ForgotPassword`, model).pipe(
            map((data: boolean) => data),
            catchError(err => throwError(err))
        );
    }

    resetPassword(model: ResetPasswordModel): Observable<boolean> {
        return this.http.post(`${this.url}/ConfirmResetPassword`, model).pipe(
            map((data: boolean) => data),
            catchError(err => throwError(err))
        );
    }
    
    getRoles() : Observable<number[]> {
        return this.http.get<number[]>(`${this.url}/GetRoles`, {
            withCredentials: true
        });
    }

    getUser(): Observable<UserModel> {
        return this.http.get<UserModel>(`${this.url}/GetUser`);
    }

    registration(registerModel: RegisterModel): Observable<boolean> {
        return this.http.post(`${this.url}/Register`, registerModel).pipe(
            map((data: boolean) => data),
            catchError(err => throwError(err))
        );
    }

    resendEmailConfirm(model: ResendEmailConfirmModel): Observable<boolean> {
        return this.http.post(`${this.url}/ResendEmailConfirmation`, model).pipe(
            map((data: boolean) => data),
            catchError(err => throwError(err))
        );
    }

    confirmEmail(userId: string, code: string): Observable<boolean>  {
        return this.http.get(`${this.url}/ConfirmEmail?userId=${userId}&code=${code}`).pipe(
            map((data: boolean) => data),
            catchError(err => throwError(err))
        );
    }
}
