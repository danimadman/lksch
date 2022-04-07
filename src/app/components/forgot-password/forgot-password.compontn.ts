import {Component} from '@angular/core';
import {AccountService} from "../../services/account.service";
import {ForgotPasswordModel} from "../../models/account";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {NotService} from "../../services/notification.service";

@Component({
    templateUrl: './forgot-password.html',
    providers: [AccountService, NotService],
    styleUrls: ['./forgot-password.css']
})

export class ForgotPasswordComponent {
    forgotPasswordModel: ForgotPasswordModel = new ForgotPasswordModel();
    forgotPasswordConfirm: boolean = false;
    form: FormGroup = new FormGroup({
        email: new FormControl(this.forgotPasswordModel.email, [
            Validators.required,
            Validators.email
        ])
    });

    constructor(private accountService: AccountService, private notification: NotService) {
    }

    send() {
        if (!this.form.valid) {
            this.form.markAllAsTouched();
            return;
        }

        this.accountService.forgotPassword(this.forgotPasswordModel).subscribe(
            data => {
                this.forgotPasswordConfirm = true;
            },
            error => this.notification.showNotification("error", error?.error?.message));
    }
}