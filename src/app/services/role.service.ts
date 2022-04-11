import {Injectable} from "@angular/core";
import {role_key} from "../options/settings";
import {CookieService} from "ngx-cookie-service";

@Injectable({
    providedIn: 'root'
})
export class RoleService {
    constructor(private cookieService: CookieService) {
    }

    saveRole(data: number[]) {
        localStorage.setItem(role_key, JSON.stringify(data));
    }

    getRole(): number[] | null {
        let role = localStorage.getItem(role_key);
        if (role == null)
            return null;

        return JSON.parse(role);
        /*let role = this.cookieService.get(role_key);
        if (role == null)
            return null;

        return role.split(',').map((value, index) => parseInt(value));*/
    }

    removeRole(): void {
        localStorage.removeItem(role_key);
        //this.cookieService.delete(role_key);
    }
}
