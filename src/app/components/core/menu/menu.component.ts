import {Component} from '@angular/core';
import * as settings from '../../../options/settings';
import {Router} from "@angular/router";
import {NotService} from "../../../services/notification.service";
import {TokenStorageService} from "../../../services/token.service";
import {RoleEnum} from "../../../options/enums";
import {RoleService} from "../../../services/role.service";

@Component({
    selector: 'app-menu',
    templateUrl: 'menu.component.html',
    styleUrls: ['menu.component.scss']
})

export class MenuComponent {
    settings = settings;
    roles: number[];
    isAdmin: boolean = false;
    showMenu: boolean = true;

    constructor(private notification: NotService, private router: Router,
                private tokenStorageService: TokenStorageService,
                private roleService: RoleService) {

        this.roles = this.roleService.getRole();
        if (this.roles != null) {
            this.isAdmin = this.roles.includes(RoleEnum.Admin);
        }
    }

    logout() {
        this.tokenStorageService.deleteToken();
        this.roleService.removeRole();
        this.router.navigateByUrl(this.settings.loginUrl);
    }
}
