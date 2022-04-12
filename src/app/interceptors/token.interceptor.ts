import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import { AuthService} from "../services/auth.service";
import {BehaviorSubject, filter, Observable, switchMap, take, throwError} from 'rxjs';
import {TokenStorageService} from "../services/token.service";
import {Router} from "@angular/router";
import {loginUrl} from "../options/settings";
import {catchError} from "rxjs/operators";
import {NotService} from "../services/notification.service";
import {RoleService} from "../services/role.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    private isTokenRefreshing: boolean = false;
    tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    constructor(private auth: AuthService, private tokenStorageService: TokenStorageService, private route: Router,
                private notification: NotService, private authService: AuthService, private roleService: RoleService) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let accessToken = this.tokenStorageService.getAuthToken();
        let accessTokenType = this.tokenStorageService.getAuthTokenType();
        if (accessToken != null && accessTokenType != null)
            request = this.addAuthenticationToken(request, accessToken, accessTokenType);

        return next.handle(request).pipe(
            catchError(err => {
                if (err instanceof HttpErrorResponse) {
                    //console.log('status code ' + err.status);
                    switch ((<HttpErrorResponse>err).status) {
                        case 401:
                            console.log(this.isTokenRefreshing);
                            return this.handle401Error(request, next);
                            break;
                        default:
                            //this.notification.showNotification("error",
                            // err?.error?.message ?? "Произошла ошибка при обработке запроса");
                            return throwError(() => err);
                    }
                }
                else return throwError(() => err);
            })
        );
    }

    private addAuthenticationToken(request, token: string, tokenType: string = 'Bearer') {
        if (tokenType == null || token == null)
            return request;

        return request.clone({
            setHeaders: {
                Authorization: `${tokenType} ${token}`,
            }
        });
    }

    private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
        if (!this.isTokenRefreshing) {
            let refreshToken = this.tokenStorageService.getRefreshToken();
            if (refreshToken == null)
                this.route.navigateByUrl(loginUrl);

            this.isTokenRefreshing = true;
            this.tokenSubject.next(null);

            return this.authService.refreshToken().pipe(
                switchMap(token => {
                    this.isTokenRefreshing = false;
                    this.tokenSubject.next(token.accessToken);

                    this.tokenStorageService.setToken(token);

                    return next.handle(this.addAuthenticationToken(request, token.accessToken, token.tokenType));
                }),
                catchError((err) => {
                    this.isTokenRefreshing = false;

                    this.tokenStorageService.deleteToken();
                    this.roleService.removeRole();

                    this.route.navigateByUrl(loginUrl);

                    return throwError(err);
                })
            );
        }

        return this.tokenSubject.pipe(
            filter(token => token !== null),
            take(1),
            switchMap((token) => next.handle(this.addAuthenticationToken(request, token)))
        );
    }
}
