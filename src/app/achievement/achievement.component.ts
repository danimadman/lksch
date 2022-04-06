import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Achievement} from "../../models/achievements";
import {NotService} from "../../services/notification.service";
import {AchievementsService} from "../../services/achievements.service";
import {DictService} from "../../services/dict.service";
import {Dict} from "../../models/dicts";
import {achievementsUrl} from '../../options/settings';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {StatusEnum, dictStatus} from "../../options/enums";
import {FileRestrictions} from "@progress/kendo-angular-upload";
import {saveAs} from 'file-saver';
import {ConfirmService} from "../../services/confirm.service";
import {DialogCloseResult} from "@progress/kendo-angular-dialog";
import {
    Message,
    User,
    SendMessageEvent,
} from "@progress/kendo-angular-conversational-ui";
import {AccountService} from "../../services/account.service";
import {SafeUrl} from "@angular/platform-browser";
import {FileService} from "../../services/file.service";

@Component({
    templateUrl: './achievement.html',
    providers: [AchievementsService, NotService, ConfirmService, DictService, AccountService],
    styleUrls: ['./achievements.css']
})

export class AchievementComponent implements OnInit {
    achievementTypes: Dict[];
    statuses: Dict[];
    achievement: Achievement;
    form: FormGroup;
    restrictions: FileRestrictions = {
        allowedExtensions: ["pdf", "jpg", "jpeg", "png", "heic"],
    };
    uploads: Array<any>;
    public comments: Message[] = [];
    public currentUser: User;
    loaded: boolean = false;
    
    constructor(private achievementsService: AchievementsService, private dictService: DictService,
                private notification: NotService, private activatedRoute: ActivatedRoute,
                private router: Router, private confirmService: ConfirmService, private accountService: AccountService,
                private fileService: FileService) {
    }

    ngOnInit() {
        let id = this.activatedRoute.snapshot.params["id"];
        if (!isNaN(Number.parseInt(id)))
            this.getAchievement(Number.parseInt(id));
        else if (id !== 'Add')
            this.router.navigateByUrl(achievementsUrl);
        
        this.getAchievementTypes();
        this.getStatuses();
        this.accountService.getUser().subscribe(
            data => {
                this.currentUser = new class implements User {
                    avatarUrl: string | SafeUrl;
                    id: any;
                    name: string;
                }
                this.currentUser.id = data.id;
                this.currentUser.name = data.lastName + ' ' + data.firstName + ' ' + (data.middleName ?? '');
            },
            error => this.notification.showNotification("error", error?.error?.message)
        );
        
        if (this.achievement === undefined) {
            this.achievement = new Achievement();
            this.achievement.status = dictStatus[0];
            this.achievement.availableStatuses = [dictStatus[1]];
            this.achievement.allowEdit = true;
            this.achievement.event = null;
            this.achievement.title = null;
        }
        
        this.form = new FormGroup({
            type: new FormControl(this.achievement.type, [
                Validators.required
            ]),
            event: new FormControl(this.achievement.event, [
                Validators.required,
                Validators.maxLength(1024)
            ]),
            title: new FormControl(this.achievement.title, [
                Validators.required,
                Validators.maxLength(1024)
            ]),
            yearOfReceipt: new FormControl(this.achievement.yearOfReceipt, [
                Validators.required
            ])
        });

        this.loaded = true;
    }
    
    getBtnStatusName(statusId: number) {
        switch (statusId) {
            case StatusEnum.Draft: 
                return 'Сохранить как черновик';
            case StatusEnum.OnCheck:
                return 'Отправить на проверку';
            case StatusEnum.OnCompletion: 
                return 'Вернуть на доработку';
            case StatusEnum.Checked:
                return 'Проверено';
            case StatusEnum.Rejected:
                return 'Отклонено';
        }
    }

    getAchievementTypes() {
        this.dictService.getAchievementTypes().subscribe(
            data => this.achievementTypes = data,
            error => this.notification.showNotification("error", error?.error?.message)
        );
    }

    getStatuses() {
        this.dictService.getStatuses().subscribe(
            data => this.statuses = data,
            error => this.notification.showNotification("error", error?.error?.message)
        );
    }

    getAchievement(id) {
        this.loaded = false;
        this.achievementsService.getAchievement(id).subscribe(
            data => {
                this.achievement = data;
                this.getComments(data.id);
            },
            error => this.notification.showNotification("error", error?.error?.message)
        );
    }
    
    getComments(achievementId: number) {
        this.achievementsService.getComments(achievementId).subscribe(
            data => this.comments = data,
            error => this.notification.showNotification("error", error?.error?.message 
                ?? 'Не удалось получить список комментариев')
        );
    }
    
    cancel() {
        this.router.navigateByUrl(achievementsUrl);
    }
    
    save(statusId) {
        if (!this.form.valid) {
            this.form.markAllAsTouched();
            return;
        }

        var formData = new FormData();
        if (this.achievement.id !== undefined && this.achievement.id > 0)
            formData.append("Id", this.achievement.id.toString());
        formData.append("TypeId", this.achievement.type.id.toString());
        formData.append("StatusId", statusId);
        formData.append("Title", this.achievement.title);
        formData.append("Event", this.achievement.event);
        formData.append("YearOfReceipt", this.achievement.yearOfReceipt.toString());

        if (this.uploads != undefined) {
            for (let i = 0; i < this.uploads.length; i++) {
                formData.append(`Files[${i}].Id`, "0");
                formData.append(`Files[${i}].FileName`, this.uploads[i].name);
                formData.append(`Files[${i}].File`, this.uploads[i], this.uploads[i].name);
            }
        }
        
        this.achievementsService.saveAchievement(formData).subscribe(
            data => {
                this.notification.showNotification("success", "Сохранено");
                this.router.navigateByUrl(achievementsUrl);
            },
            error => this.notification.showNotification("error", error?.error?.message)
        );
    }
    
    downloadFile(dataItem) {
        this.fileService.getAchievementFile(dataItem.id).subscribe(
            (response: any) => {
                let blob:any = new Blob([response], { type: `${response.type}; charset=utf-8` });
                saveAs(blob, dataItem.fileName);
            },
            error => this.notification.showNotification("error", error?.error?.message ?? 'Не удалось скачать файл')
        );
    }
    
    deleteFile(fileId) {
        this.confirmService.dialogOpen("Удаление", "Вы уверены, что хотите удалить этот файл?").result
            .subscribe((result) => {
                if (result instanceof DialogCloseResult || result.text == this.confirmService.confirmFalse)
                    return;
    
                this.fileService.deleteAchievementFile(fileId).subscribe(
                    data => {
                        if (this.achievement.files == null)
                            return;
    
                        this.achievement.files = this.achievement.files.filter(x => x.id != fileId);
                    },
                    error => this.notification.showNotification("error",
                        error?.error?.message ?? 'Не удалось удалить файл')
                );
        });
    }
    
    deleteAchievement(id) {
        this.confirmService.dialogOpen("Удаление", "Вы уверены, что хотите удалить это достижение?").result
            .subscribe((result) => {
                if (result instanceof DialogCloseResult || result.text == this.confirmService.confirmFalse)
                    return;

                this.achievementsService.deleteAchievement(id).subscribe(
                    data => {
                        this.notification.showNotification("success", 'Достижение удалено')
                        this.router.navigateByUrl(achievementsUrl);
                    },
                    error => this.notification.showNotification("error", error?.error?.message 
                        ?? 'Не удалось удалить достижение')
                );
            });
    }

    sendComment(e: SendMessageEvent): void {
        let comment = e.message.text;
        if (comment == null || comment.length == 0)
            return;
        
        this.achievementsService.sendComment(this.achievement.id, comment).subscribe(
            data => this.comments = [...this.comments, e.message],
            error => this.notification.showNotification("error", error?.error?.message
                ?? 'Не удалось получить список комментариев')
        );
    }
}