import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {HomeService} from "../../services/home.service";
import {DictService} from "../../services/dict.service";
import {AccountService} from "../../services/account.service";
import {Profile, ProfileForm} from "../../models/profile";
import {Dict, EducationalInstitution} from "../../models/dicts";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {NotService} from "../../services/notification.service";
import {Announcement} from "../../models/announcement";
import {announcementsUrl} from "../../options/settings";

@Component({
    templateUrl: './home.html',
    providers: [HomeService, AccountService, DictService, NotService],
    styleUrls: ['./home.css']
})

export class HomeComponent implements OnInit {
    profile: Profile = new Profile();
    announcements: Announcement[];
    announcementsUrl: string = announcementsUrl;

    dictEducationalInstitutions: EducationalInstitution[];
    cbDataSource: EducationalInstitution[];

    editMode: boolean = false;

    form: FormGroup;
    
    constructor(private homeService: HomeService, private accountService: AccountService, private router: Router,
                private dictService: DictService, private notification: NotService) {
    }
    
    ngOnInit() {
        this.getProfile();

        this.form = new FormGroup({
            firstName: new FormControl(this.profile.firstName, [
                Validators.required,
                Validators.maxLength(128)
            ]),
            middleName: new FormControl(this.profile.lastName, [
                Validators.maxLength(128)
            ]),
            lastName: new FormControl(this.profile.lastName, [
                Validators.required,
                Validators.maxLength(128)
            ]),
            birthDay: new FormControl(this.profile.birthDay, [Validators.required]),
            isMale: new FormControl(this.profile.isMale, [Validators.required]),
            email: new FormControl(this.profile.email, [
                Validators.required,
                Validators.email
            ]),
            phoneNumber: new FormControl(this.profile.phoneNumber, [
                Validators.required,
                Validators.maxLength(128)
            ]),
            educationalInstitution: new FormControl(this.profile.educationalInstitution.educationalInstitutionId,
                [Validators.required]),
            classNumber: new FormControl(this.profile.classNumber, [
                Validators.required,
                Validators.min(1),
                Validators.max(11)
            ]),
            parentFIO: new FormControl(this.profile.parentFIO, [
                Validators.required,
                Validators.maxLength(128)
            ]),
            parentPhoneNumber: new FormControl(this.profile.parentPhoneNumber, [
                Validators.required,
                Validators.maxLength(128),
            ])
        });

        this.homeService.getAnnouncements(3).subscribe(
            data => this.announcements = data,
            error => this.notification.showNotification("error", "Не удалось получить объявления"));
    }

    getProfile() {
        this.homeService.getProfile().subscribe(
            data =>  {
                this.profile = data;
                if (this.profile == null) {
                    this.profile = new Profile();
                    return;   
                }
                
                if (this.profile.birthDay != null) {
                    this.profile.birthDay = new Date(this.profile.birthDay);
                }
            },
            error => {
                this.notification.showNotification("error", "Не удалось получить профиль");
            });
    }

    getEducationalInstitutions(filter: string = null) {
        if (this.dictEducationalInstitutions == null || this.dictEducationalInstitutions.length == 0) {
            this.dictService.getEducationalInstitution(filter).subscribe(data =>
                this.dictEducationalInstitutions = this.cbDataSource = data);
        }
    }
    
    editProfile() {
        this.getEducationalInstitutions();
        this.editMode = true;
    }
    
    cancel() {
        this.editMode = false;
        this.getProfile();
    }

    save() {
        if (!this.form.valid) {
            this.form.markAllAsTouched();
            return;
        }

        let form = new ProfileForm();
        form.firstName = this.profile.firstName;
        form.middleName = this.profile.middleName;
        form.lastName = this.profile.lastName;
        form.isMale = this.profile.isMale;

        let birthDay = new Date(this.profile.birthDay);
        birthDay.setHours(birthDay.getHours() + 12);
        form.birthDay = birthDay;

        form.email = this.profile.email;
        form.phoneNumber = this.profile.phoneNumber;
        form.educationalInstitutionId = this.profile.educationalInstitution.educationalInstitutionId;
        form.classNumber = this.profile.classNumber;
        form.parentFIO= this.profile.parentFIO;
        form.parentPhoneNumber = this.profile.parentPhoneNumber;
        
        this.homeService.putProfile(form).subscribe(
            data => {
                this.cancel();
                this.notification.showNotification("success", "Профиль успешно сохранен")
            },
            error => this.notification.showNotification("error", error?.error?.message)
        );
    }

    handleFilter(itemText) {
        this.cbDataSource = this.dictEducationalInstitutions.filter(
            (s) => s.educationalInstitutionName.toLowerCase().indexOf(itemText.toLowerCase()) !== -1
        );
    }
}
