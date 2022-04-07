import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild, Router} from "@angular/router";
import {Observable} from "rxjs";
import {loginUrl} from "../options/settings";
import {AuthService} from "../services/auth.service";
import {Injectable} from "@angular/core";
import {TokenStorageService} from "../services/token.service";

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

    constructor(private router: Router, private authService: AuthService, private tokenStorageService: TokenStorageService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<boolean> | boolean {
        return this.checkAuthorization();
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<boolean> | boolean {
        return this.checkAuthorization();
    }

    private checkAuthorization() : Observable<boolean> | boolean {
        let tokens = this.tokenStorageService.getToken();
        if (tokens == null) {
            this.router.navigateByUrl(loginUrl);
        }

        //return !isNaN(Date.parse(tokens.expiresDateTime)) && Date.parse(tokens.expiresDateTime) > Date.now();
        return true;
    }
}