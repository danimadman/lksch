import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {NotService} from "../../services/notification.service";
import {EventsService} from "../../services/events.service";
import {EventAd, EventDetails, EventFile, StudentEvent} from "../../models/events";
import {DataState, EventStatusEnum, RoleEnum} from "../../options/enums";
import {AccountService} from "../../services/account.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Dict} from "../../models/dicts";
import {DictService} from "../../services/dict.service";
import {eventsUrl, registeredEventsUrl} from "../../options/settings";
import {SelectEvent} from "@progress/kendo-angular-layout";
import {FileRestrictions} from "@progress/kendo-angular-upload";
import {saveAs} from 'file-saver';
import {FileService} from "../../services/file.service";
import {State} from "@progress/kendo-data-query";
import {UserModel} from "../../models/account";
import {ConfirmService} from "../../services/confirm.service";
import {DialogCloseResult} from "@progress/kendo-angular-dialog";
import {RoleService} from "../../services/role.service";

@Component({
    templateUrl: './event-details.html',
    providers: [NotService, EventsService, AccountService, DictService]
})

export class EventDetailsComponent implements OnInit {
    returnUrl: string;

    form: FormGroup;
    formEventAd: FormGroup;

    user: UserModel;
    roles: number[] = [];
    isAdmin: boolean = false;
    allowEdit: boolean = false;
    allowEventRegister: boolean = false;

    eventTypes: Dict[];
    eventStatuses: Dict[];
    studentEventStatuses: Dict[];

    eventId: string;
    eventDetails: EventDetails;

    eventFiles: EventFile[];
    eventFilesAdd: Array<any>;
    restrictions: FileRestrictions = {
        allowedExtensions: ["pdf", "doc", "docx", "jpg", "jpeg", "png", "heic"],
    };

    studentEvents: StudentEvent[];
    studentEventStatus: Dict;
    studentEventsNewRecord: number = 0;

    showEventAdDetails: boolean = false;
    eventAd: EventAd;
    eventAds: EventAd[];

    gridState: State = {
        filter: {
            logic: "and",
            filters: [{ field: "dataState", operator: "neq", value: DataState.Deleted }],
        },
    };

    constructor(private notification: NotService, private router: Router, private activateRoute: ActivatedRoute,
                private eventsService: EventsService, private accountService: AccountService,
                private dictService: DictService, private fileService: FileService,
                private confirmService: ConfirmService, private roleService: RoleService) {
        this.eventId = activateRoute.snapshot.params["id"];
        activateRoute.queryParams.subscribe(x => {
            if (x.ReturnUrl != undefined)
                this.returnUrl = x.ReturnUrl;
        })
    }

    ngOnInit() {
        this.accountService.getUser().subscribe(data => {
            this.user = data;
        });

        this.roles = this.roleService.getRole();
        if (this.roles != null)
            this.allowEdit = this.isAdmin = this.roles.includes(RoleEnum.Admin);

        this.getEventTypes();
        this.getEventStatuses();
        this.getStudentEventStatuses();

        if (this.eventId != 'Add') {
            this.getEventDetails();
        }
        if (this.eventDetails == null)
            this.eventDetails = new EventDetails();

        this.form = new FormGroup({
            name: new FormControl(this.eventDetails.name, [
                Validators.required,
                Validators.maxLength(1024)
            ]),
            description: new FormControl(this.eventDetails.description, [
                Validators.required,
                Validators.maxLength(1024)
            ]),
            organizers: new FormControl(this.eventDetails.organizers, [
                Validators.required,
                Validators.maxLength(1024)
            ]),
            location: new FormControl(this.eventDetails.location, [
                Validators.required,
                Validators.maxLength(1024)
            ]),
            dateBegin: new FormControl(this.eventDetails.dateBegin, [
                Validators.required
            ]),
            dateEnd: new FormControl(this.eventDetails.dateEnd, [
                Validators.required
            ]),
            eventType: new FormControl(this.eventDetails.eventType, [
                Validators.required
            ]),
            status: new FormControl(this.eventDetails.status, [
                Validators.required
            ])
        });
    }

    getEventTypes() {
        this.dictService.getEventTypes().subscribe(
            data => this.eventTypes = data,
            error => this.notification.showNotification("error",
                error?.error?.message ?? 'Не удалось справочник типов мероприятия')
        );
    }

    getEventStatuses() {
        this.dictService.getEventStatuses().subscribe(
            data => this.eventStatuses = data,
            error => this.notification.showNotification("error",
                error?.error?.message ?? 'Не удалось справочник статусов мероприятия')
        );
    }

    getStudentEventStatuses() {
        this.dictService.getStudentEventStatuses().subscribe(
            data => this.studentEventStatuses = data,
            error => this.notification.showNotification("error",
                error?.error?.message ?? 'Не удалось справочник статусов записавшихся на мероприятие')
        );
    }

    cancel() {
        if (this.isAdmin)
            this.router.navigateByUrl(this.returnUrl ?? eventsUrl);
        else
            this.router.navigateByUrl(registeredEventsUrl);
    }

    onTabSelect(e: SelectEvent) {
        switch (e.index) {
            case 0:
                break;
            case 1:
                if (!this.isAdmin)
                    return;
                this.studentEventRecordRead();
                break;
            case 2:
                break;
        }
    }

    /* -------------- EVENT -------------- */

    getEventDetails() {
        this.eventsService.getEventDetails(this.eventId).subscribe(
            data => {
                this.eventDetails = data;
                this.allowEventRegister = !this.isAdmin && data.status.id == EventStatusEnum.Recruiting;

                this.getEventFiles();
                this.getStudentEvents();
                this.getEventAds();
            },
            error => this.notification.showNotification("error",
                error?.error?.message ?? 'Не удалось получить детали выбранного мероприятия')
        );
    }

    saveEvent() {
        if (!this.form.valid) {
            this.form.markAllAsTouched();
            return;
        }

        if (!this.allowEdit)
            return;

        let date = new Date(this.eventDetails.dateBegin);
        date.setHours(date.getHours() + 12);
        this.eventDetails.dateBegin = date;
        date = new Date(this.eventDetails.dateEnd);
        date.setHours(date.getHours() + 12);
        this.eventDetails.dateEnd = date;

        if (this.eventDetails.id == null) {
            this.eventsService.postEvent(this.eventDetails).subscribe(
                data => {
                    this.eventId = this.eventDetails.id = data;
                    this.notification.showNotification("success", "Сохранено");
                },error => this.notification.showNotification("error",
                    error?.error?.message ?? 'Произошла ошибка во время сохранения мероприятия'))
        }
        else {
            this.eventsService.putEvent(this.eventDetails).subscribe(
                data => {
                    this.notification.showNotification("success", "Сохранено");
                },error => this.notification.showNotification("error",
                    error?.error?.message ?? 'Произошла ошибка во время сохранения мероприятия'))
        }
    }

    /* -------------- EVENT FILES -------------- */

    downloadFile(fileInfo) {
        if (fileInfo == null)
            return;

        this.fileService.getEventFile(fileInfo.id).subscribe(
            (response: any) => {
                let blob:any = new Blob([response], { type: `${response.type}; charset=utf-8` });
                saveAs(blob, fileInfo.fileName);
            },
            error => this.notification.showNotification("error", error?.error?.message
                ?? 'Не удалось скачать файл')
        );
    }

    getEventFiles() {
        if (this.eventDetails.id == null)
            return;

        this.eventsService.getEventFilesList(this.eventDetails.id).subscribe(
            data => {
                this.eventFiles = data;
            },
            error => this.notification.showNotification("error",
                error?.error?.message ?? 'Не удалось получить материалы мероприятия')
        );
    }

    saveEventFiles() {
        if (!this.allowEdit || this.eventFilesAdd == null || this.eventFilesAdd.length == 0)
            return;

        let formData = new FormData();
        formData.append('EventId', this.eventDetails.id);
        for (let i = 0; i < this.eventFilesAdd.length; i++) {
            formData.append(`Files[${i}].FileName`, this.eventFilesAdd[i].name);
            formData.append(`Files[${i}].File`, this.eventFilesAdd[i], this.eventFilesAdd[i].name);
        }
        this.fileService.postEventFiles(formData)
            .subscribe(
                data => {
                    this.notification.showNotification("success", "Файлы сохранены");
                    this.getEventFiles();
                    this.eventFilesAdd = null;
                },error => this.notification.showNotification("error",
                    error?.error?.message ?? 'Произошла ошибка во время сохранения файлов'));
    }

    deleteFile(fileId) {
        if (!this.allowEdit)
            return;

        this.confirmService.dialogOpen("Удаление", "Вы уверены, что хотите удалить этот файл?").result
            .subscribe((result) => {
                if (result instanceof DialogCloseResult || result.text == this.confirmService.confirmFalse)
                    return;

                this.fileService.deleteEventFile(fileId).subscribe(
                    data => {
                        this.notification.showNotification("success", "Файлы удален");
                        this.getEventFiles();
                    },error => this.notification.showNotification("error",
                        error?.error?.message ?? 'Произошла ошибка во время удаления файла'));
            });
    }

    /* -------------- STUDENT EVENTS -------------- */

    getStudentEvents() {
        if (this.eventDetails.id == null)
            return;

        this.eventsService.getStudentEvents(this.eventDetails.id).subscribe(
            data =>  {
                this.studentEvents = data;
                this.studentEventsNewRecord = data?.filter(x => x.isNewRecord)?.length ?? 0;
                this.studentEventStatus = data?.find(x => x.user?.id == this.user?.id)?.status;
            },
            error => this.notification.showNotification("error",
                error?.error?.message ?? 'Не удалось получить список записавшихся на мероприятие')
        );
    }

    removeStudentEvent({dataItem}) {
        if (!this.allowEdit || dataItem == null || dataItem.id == null)
            return;

        this.confirmService.dialogOpen("Удаление", "Вы уверены, что хотите удалить эту запись?").result
            .subscribe((result) => {
                if (result instanceof DialogCloseResult || result.text == this.confirmService.confirmFalse)
                    return;

                this.eventsService.deleteStudentEvent(dataItem.id).subscribe(
                    data => {
                        this.notification.showNotification("success", 'Удалено');
                        this.getStudentEvents();
                    },error => this.notification.showNotification("error",
                        error?.error?.message ?? 'Произошла ошибка во время удаления записи'));
            });
    }

    registerEvent() {
        if (!this.allowEventRegister || this.eventId == null)
            return;

        this.eventsService.postStudentEvent({
            eventId: this.eventId
        }).subscribe(
            data => {
                this.notification.showNotification("success", "Заявка на регистрацию подана");
                this.cancel();
            },error => this.notification.showNotification("error",
                error?.error?.message ?? "Не удалось зарегистрироваться"));
    }

    dataStateChange(status, gridItem) {
        if (gridItem?.id == null || status == null)
            return;

        this.eventsService.updateStudentEventStatus({
            StudentEventId: gridItem.id,
            StatusId: status.id
        }).subscribe(
            data => {
                gridItem.status = status;
                this.notification.showNotification("success", 'Статус обновлен');
            },error => this.notification.showNotification("error",
                error?.error?.message ?? 'Произошла ошибка во время обновления статуса'));
    }

    studentEventRecordRead() {
        if (!this.isAdmin || this.studentEvents == null)
            return;

        for (let i = 0; i < this.studentEvents.length; i++) {
            if (this.studentEvents[i].isNewRecord) {
                this.eventsService.studentEventRecordRead(this.studentEvents[i].id);
            }
        }
    }

    /* -------------- EVENT ADS -------------- */

    getEventAds() {
        if (this.eventDetails.id == null)
            return;

        this.eventsService.getEventAds(this.eventDetails.id).subscribe(
            data => {
                this.eventAds = data;
            },
            error => this.notification.showNotification("error",
                error?.error?.message ?? 'Не удалось получить список новостей и объявлений')
        );
    }

    addEventAd() {
        if (!this.allowEdit)
            return;

        this.eventAd = new EventAd();
        this.eventAd.eventId = this.eventId;

        this.formEventAd = new FormGroup({
            annotation: new FormControl(this.eventAd.annotation, [
                Validators.required,
                Validators.maxLength(1024)
            ]),
            text: new FormControl(this.eventAd.text, [
                Validators.required
            ]),
            title: new FormControl(this.eventAd.title, [
                Validators.required,
                Validators.maxLength(512)
            ])
        });
        this.showEventAdDetails = true;
    }

    closeEventAdDetails() {
        this.showEventAdDetails = false;
    }

    removeEventAd(event) {
        if (!this.allowEdit)
            return;

        this.confirmService.dialogOpen("Удаление", "Вы уверены, что хотите удалить эту запись?").result
            .subscribe((result) => {
                if (result instanceof DialogCloseResult || result.text == this.confirmService.confirmFalse)
                    return;

                this.eventsService.deleteEventAd(event.dataItem.id).subscribe(
                    data => {
                        this.notification.showNotification("success", 'Удалено');
                        this.getEventAds();
                    },error =>this.notification.showNotification("error",
                        error?.error?.message ?? 'Произошла ошибка во время удаления объявления'));
            });
    }

    eventAdDetails(event) {
        if (event?.dataItem?.id == null)
            return;

        this.eventAd = this.eventAds.find(x => x.id == event.dataItem.id);

        this.formEventAd = new FormGroup({
            annotation: new FormControl(this.eventAd.annotation, [
                Validators.required,
                Validators.maxLength(1024)
            ]),
            text: new FormControl(this.eventAd.text, [
                Validators.required
            ]),
            title: new FormControl(this.eventAd.title, [
                Validators.required,
                Validators.maxLength(512)
            ])
        });

        this.showEventAdDetails = true;
    }

    saveEventAd() {
        if (!this.allowEdit)
            return;

        if (!this.formEventAd.valid) {
            this.formEventAd.markAllAsTouched();
            return;
        }

        if (this.eventAd.id != null) {
            this.eventsService.putEventAd(this.eventAd).subscribe(
                data => {
                    this.showEventAdDetails = false;
                    this.eventAd = null;

                    this.notification.showNotification("success", 'Сохранено');

                    this.getEventAds();
                },error => this.notification.showNotification("error",
                    error?.error?.message ?? 'Произошла ошибка во время сохранения объявления'));
        }
        else {
            this.eventsService.postEventAd(this.eventAd).subscribe(
                data => {
                    this.notification.showNotification("success", 'Сохранено');
                    this.showEventAdDetails = false;
                    this.eventAd = null;
                    this.getEventAds();
                },error => {
                    this.notification.showNotification("error",
                        error?.error?.message ?? 'Произошла ошибка во время сохранения объявления');
                    console.log(error);
                });
        }
    }
}
