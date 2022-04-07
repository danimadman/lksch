import {Component} from '@angular/core';
import {ResendEmailConfirmModel} from "../../models/register";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {NotService} from "../../services/notification.service";
import {AccountService} from "../../services/account.service";

@Component({
    templateUrl: './resend-email-confirm.html',
    providers: [AccountService, NotService],
    styleUrls: ['./resend-email-confirm.css']
})

export class ResendEmailConfirmComponent {
    resendEmailModel: ResendEmailConfirmModel = new ResendEmailConfirmModel();
    resendEmailConfirm: boolean = false;
    form: FormGroup = new FormGroup({
        email: new FormControl(this.resendEmailModel.email, [
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

        this.accountService.resendEmailConfirm(this.resendEmailModel).subscribe(
            data => {
                this.resendEmailConfirm = true;
            },
            error => {
                this.notification.showNotification("error", error?.error?.message)
                this.resendEmailConfirm = false;
            });
    }
}