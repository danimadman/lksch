import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ResetPasswordModel} from "../../models/account";
import {NotService} from "../../services/notification.service";
import {AccountService} from "../../services/account.service";
import {ActivatedRoute} from "@angular/router";
import * as settings from '../../options/settings';

@Component({
    templateUrl: './reset-password.html',
    providers: [AccountService, NotService],
    styleUrls: ['./reset-password.css']
})

export class ResetPasswordComponent {
    resetPasswordModel: ResetPasswordModel = new ResetPasswordModel();
    resetPasswordConfirm: boolean = false;
    settings = settings;
    form: FormGroup = new FormGroup({
        email: new FormControl(this.resetPasswordModel.email, [
            Validators.required,
            Validators.email
        ]),
        password: new FormControl(this.resetPasswordModel.password, [
            Validators.required
        ]),
        confirmPassword: new FormControl(this.resetPasswordModel.confirmPassword, [
            Validators.required
        ])
    });

    constructor(private accountService: AccountService, private notification: NotService, 
                private activatedRoute: ActivatedRoute) {
        this.resetPasswordModel.code = activatedRoute.snapshot.params["code"];
    }

    send() {
        if (!this.form.valid) {
            this.form.markAllAsTouched();
            return;
        }
        
        if (this.resetPasswordModel.password !== this.resetPasswordModel.confirmPassword) {
            this.notification.showNotification("error", "Пароли не совпадают")
            return;
        }

        this.accountService.resetPassword(this.resetPasswordModel).subscribe(
            data => {
                this.resetPasswordConfirm = true;
            },
            error => {
                this.notification.showNotification("error", error?.error?.message);
                this.resetPasswordConfirm = false;
            });
    }
}