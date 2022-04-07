import {Component} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {loginUrl} from '../../options/settings';
import {RegisterModel} from "../../models/register";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {NotService} from "../../services/notification.service";
import {AccountService} from "../../services/account.service";
import {FileService} from "../../services/file.service";
import {saveAs} from 'file-saver';

@Component({
    templateUrl: './register.html',
    providers: [AccountService, NotService],
    styleUrls: ['./register.css']
})

export class RegisterComponent {
    action: string;
    registerModel: RegisterModel = new RegisterModel();
    form: FormGroup = new FormGroup({
        firstName: new FormControl(this.registerModel.firstName, [
            Validators.required,
            Validators.maxLength(128)
        ]),
        middleName: new FormControl(this.registerModel.lastName, [
            Validators.maxLength(128)
        ]),
        lastName: new FormControl(this.registerModel.lastName, [
            Validators.required,
            Validators.maxLength(128)
        ]),
        birthDay: new FormControl(this.registerModel.birthDay, [Validators.required]),
        isMale: new FormControl(this.registerModel.isMale, [Validators.required]),
        email: new FormControl(this.registerModel.email, [
            Validators.required,
            Validators.email
        ]),
        password: new FormControl(this.registerModel.password, [
            Validators.required,
            Validators.maxLength(128)
        ]),
        passwordConfirm: new FormControl(this.registerModel.passwordConfirm, [
            Validators.required,
            Validators.maxLength(128)
        ]),
        phoneNumber: new FormControl(this.registerModel.phoneNumber, [
            Validators.required,
            Validators.maxLength(128)
        ]),
        isConsentPersonalData: new FormControl(this.registerModel.isConsentPersonalData, [
            Validators.requiredTrue
        ])
    });

    constructor(private accountService: AccountService, private router: Router, private activeRoute: ActivatedRoute,
                private notification: NotService, private fileService: FileService) {
        this.action = activeRoute.snapshot.params["action"];
    }
    
    cancel() {
        this.router.navigateByUrl(loginUrl);
    }

    register() {
        if (!this.form.valid) {
            this.form.markAllAsTouched();
            return;
        }
        
        let birthDay = new Date(this.registerModel.birthDay);
        birthDay.setHours(birthDay.getHours() + 12);
        this.registerModel.birthDay = birthDay;
        
        this.accountService.registration(this.registerModel).subscribe(
            data => this.action = 'RegisterConfirmation',
            error => this.notification.showNotification("error", error?.error?.message))
    }

    downloadConsentPersonalData() {
        this.fileService.getConsentPD().subscribe(
            (response: any) => {
                let blob:any = new Blob([response], { type: `${response.type}; charset=utf-8` });
                console.log(response);
                console.log(blob);
                saveAs(blob, "Согласие на обработку персональных данных.pdf");
            },
            error => this.notification.showNotification("error", error?.error?.message ?? 'Не удалось скачать файл')
        );
    }
}