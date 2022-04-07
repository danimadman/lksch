import {Component} from '@angular/core';
import * as settings from '../../../options/settings';
import {Router} from "@angular/router";
import {NotService} from "../../../services/notification.service";
import {TokenStorageService} from "../../../services/token.service";
import {AccountService} from "../../../services/account.service";
import {RoleEnum} from "../../../options/enums";

@Component({
    selector: 'app-menu',
    templateUrl: 'menu.component.html',
    styleUrls: ['menu.component.scss']
})

export class MenuComponent {
    settings = settings;
    public roles: number[];
    public isAdmin: boolean = false;
    showMenu: boolean = false;

    constructor(private notification: NotService, private router: Router,
                private tokenStorageService: TokenStorageService,
                private accountService: AccountService) {
        this.accountService.getRoles().subscribe(data => {
            if (data == null)
                return;
            this.showMenu = true;
            this.roles = data;
            this.isAdmin = data.includes(RoleEnum.Admin);
        },error => this.showMenu = false);
    }

    logout() {
        this.tokenStorageService.deleteToken();
        this.router.navigateByUrl(this.settings.loginUrl);
    }
}
