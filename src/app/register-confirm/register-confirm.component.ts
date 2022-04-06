import {Component} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

import * as settings from '../../options/settings';
import {NotService} from "../../services/notification.service";
import {AccountService} from "../../services/account.service";

@Component({
    templateUrl: './register.confirm.html',
    providers: [AccountService, NotService],
    styleUrls: ['./register-confirm.css']
})

export class RegisterConfirmComponent {
    message: string;
    settings = settings;
    successConfirm: boolean = false;
    
    constructor(private accountService: AccountService, private activeRoute: ActivatedRoute) {
        let userId = activeRoute.snapshot.params["userId"];
        let code = activeRoute.snapshot.params["code"];

        activeRoute.queryParams.subscribe(x => {
            if (x.userId != undefined)
                userId = x.userId;
            if (x.code != undefined)
                code = x.code;
        })

        this.accountService.confirmEmail(userId, code).subscribe(data => {
                this.successConfirm = data;
                if (!this.successConfirm)
                    this.message = 'Не удалось подтвердить электронную почту. Попробуйте позже';
            },
            error => this.message = error?.error?.message ?? 'Не удалось подтвердить электронную почту. Попробуйте позже'
        );
    }
}