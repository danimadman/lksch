import {Component} from '@angular/core';
import * as settings from '../../options/settings';
import {AccountService} from "../../services/account.service";
import {Router} from "@angular/router";
import {NotService} from "../../services/notification.service";
import {TokenStorageService} from "../../services/token.service";
import {RoleEnum} from "../../options/enums";

@Component({
    templateUrl: './shared.html',
    styleUrls: ["./shared.css"],
    providers: [AccountService,NotService]
})

export class SharedComponent {
    settings = settings;
    public roles: number[] = [];
    public isAdmin: boolean = false;

    constructor(private accountService: AccountService, private notification: NotService, private router: Router,
                private tokenStorageService: TokenStorageService) {
        this.accountService.getRoles().subscribe(data => {
            this.roles = data;
            this.isAdmin = data.includes(RoleEnum.Admin);
        });
        this.router.navigateByUrl(settings.homeUrl);
    }

    logout() {
        this.tokenStorageService.deleteToken();
        this.router.navigateByUrl(this.settings.loginUrl);
    }
}