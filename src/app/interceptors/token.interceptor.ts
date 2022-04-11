import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import { AuthService} from "../services/auth.service";
import {Observable, switchMap, throwError} from 'rxjs';
import {TokenStorageService} from "../services/token.service";
import {Router} from "@angular/router";
import {loginUrl} from "../options/settings";
import {catchError} from "rxjs/operators";
import {NotService} from "../services/notification.service";
import {AuthTokens} from "../models/auth";
import {RoleService} from "../services/role.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private auth: AuthService, private tokenStorageService: TokenStorageService, private route: Router,
                private notification: NotService, private authService: AuthService, private roleService: RoleService) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(this.addAuthenticationToken(request)).pipe(
            catchError(err => {
                if (err instanceof HttpErrorResponse) {
                    //console.log('status code ' + err.status);
                    switch (err.status) {
                        case 401:
                            return this.authService.refreshToken().pipe(
                                switchMap((data: AuthTokens) => {
                                    this.tokenStorageService.setToken(data);
                                    return next.handle(this.addAuthenticationToken(request));
                                }),
                                catchError(err => {
                                    this.tokenStorageService.deleteToken();
                                    this.roleService.removeRole();
                                    this.route.navigateByUrl(loginUrl);
                                    return throwError(() => err);
                                })
                            );
                            break;
                        default:
                            //this.notification.showNotification("error",
                            //  err?.error?.message ?? "Произошла ошибка при обработке запроса");
                            return throwError(() => err);
                    }
                }
            })
        );
    }

    private addAuthenticationToken(request) {
        let accessToken = this.tokenStorageService.getAuthToken();
        let accessTokenType = this.tokenStorageService.getAuthTokenType();
        if (accessToken == null || accessTokenType == null)
            return request;

        return request.clone({
            setHeaders: {
                Authorization: `${accessTokenType} ${accessToken}`,
            }
        });
    }
}
