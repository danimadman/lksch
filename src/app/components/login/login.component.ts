import {Component} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import * as settings from '../../options/settings';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {NotService} from "../../services/notification.service";
import {AuthService} from "../../services/auth.service";
import {AuthModel} from "../../models/auth";
import {TokenStorageService} from "../../services/token.service";
import {Store} from "@ngrx/store";
import {IUserState} from "../../reducers/user-auth";
import {AccountService} from "../../services/account.service";
import {RoleService} from "../../services/role.service";

@Component({
    templateUrl: './login.html',
    providers: [AuthService, NotService, AccountService],
    styleUrls: ['./login.css']
})

export class LoginComponent {
    authModel: AuthModel = new AuthModel();
    returnUrl: string;
    settings = settings;
    form: FormGroup = new FormGroup({
        login: new FormControl(this.authModel.login, [
            Validators.required,
            Validators.email
        ]),
        password: new FormControl(this.authModel.password, [
            Validators.required
        ])
    });
    
    constructor(private authService: AuthService, private router: Router, activeRoute: ActivatedRoute,
                private notification: NotService, private tokenStorageService: TokenStorageService,
                private roleService: RoleService, private accountService: AccountService) {
        this.returnUrl = activeRoute.snapshot.params["returnUrl"];

        if (this.tokenStorageService.getAuthToken() != null)
            this.router.navigateByUrl(settings.homeUrl);
    }

    login() {
        if (!this.form.valid) {
            this.form.markAllAsTouched();
            return;
        }

        this.authService.getToken(this.authModel).subscribe(
            _ => {
                this.tokenStorageService.setToken(_);
                this.accountService.getRoles().subscribe(data => {
                    this.roleService.saveRole(data);
                    this.router.navigateByUrl(this.settings.homeUrl);
                });
            },
            error => this.notification.showNotification("error",
                error?.error?.message ?? 'Не удалось авторизоваться'));
    }
    
    registerForm() {
        this.router.navigateByUrl(this.settings.registerUrl);
    }
}
