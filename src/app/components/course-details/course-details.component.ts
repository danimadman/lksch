import {Component, OnInit} from "@angular/core";
import {CoursesService} from "../../services/courses.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Dict} from "../../models/dicts";
import {AccountService} from "../../services/account.service";
import {CourseAd, CourseDetails, ProgrammModule, ProgrammTheme, StudentRegistered} from "../../models/courses";
import {NotService} from "../../services/notification.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DictService} from "../../services/dict.service";
import {CourseStatusEnum, DataState, RoleEnum} from "../../options/enums";
import {coursesUrl, studentCoursesUrl} from "../../options/settings";
import {SelectEvent} from "@progress/kendo-angular-layout";
import {State} from "@progress/kendo-data-query";
import {DialogCloseResult} from "@progress/kendo-angular-dialog";
import {ConfirmService} from "../../services/confirm.service";
import {UserModel} from "../../models/account";
import {Guid} from "../../services/Helper/common";
import {RoleService} from "../../services/role.service";

@Component({
    templateUrl: './course-details.html',
    providers: [CoursesService, AccountService, DictService]
})

export class CourseDetailsComponent implements OnInit {
    returnUrl: string;

    form: FormGroup;
    formCourse: FormGroup;
    formCourseProgramModule: FormGroup;

    user: UserModel;
    roles: number[] = [];
    isAdmin: boolean = false;
    allowEdit: boolean = false;
    allowCourseRegistred: boolean = false;

    courseStatuses: Dict[];
    studentCoursetStatuses: Dict[];

    courseId: string;
    courseDetails: CourseDetails;

    studentRegistered: StudentRegistered[];
    studentCourseStatus: Dict;
    studentRegisteredNewRecord: number = 0;

    showCourseAddDetails: boolean = false;
    courseAd: CourseAd;
    courseAds: CourseAd[] = [];

    courseProgramms: ProgrammModule[] = [];

    gridState: State = {
        filter: {
            logic: "and",
            filters: [{ field: "dataState", operator: "neq", value: DataState.Deleted }],
        },
    };

    constructor(private notification: NotService, private router: Router, private activateRoute: ActivatedRoute,
                private courseService: CoursesService, private accountService: AccountService,
                private dictService: DictService, private confirmService: ConfirmService,
                private roleService: RoleService) {
        this.courseId = activateRoute.snapshot.params["id"];
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

        this.getCourseStatuses();
        this.getStudentCourseStatuses();

        if (this.courseId != 'Add') {
            this.getCourseDetails();
        }
        if (this.courseDetails == null)
            this.courseDetails = new CourseDetails();

        this.form = new FormGroup({
            name: new FormControl(this.courseDetails.name, [
                Validators.required,
                Validators.maxLength(1024)
            ]),
            description: new FormControl(this.courseDetails.description, [
                Validators.required,
                Validators.maxLength(2048)
            ]),
            teachers: new FormControl(this.courseDetails.teachers, [
                Validators.required,
                Validators.maxLength(1024)
            ]),
            location: new FormControl(this.courseDetails.location, [
                Validators.required,
                Validators.maxLength(1024)
            ]),
            dateBegin: new FormControl(this.courseDetails.dateBegin, [
                Validators.required
            ]),
            dateEnd: new FormControl(this.courseDetails.dateEnd, [
                Validators.required
            ]),
            academicHours: new FormControl(this.courseDetails.academicHours, [
                Validators.required,
                Validators.min(0),
                Validators.max(999)
            ]),
            cost: new FormControl(this.courseDetails.cost, [
                Validators.required,
                Validators.min(0),
                Validators.max(9999999)
            ]),
            status: new FormControl(this.courseDetails.status, [
                Validators.required
            ])
        });
    }

    getCourseStatuses() {
        this.dictService.getCourseStatuses().subscribe(
            data => this.courseStatuses = data,
            error => this.notification.showNotification("error",
                error?.error?.message ?? 'Не удалось справочник статусов курса')
        );
    }

    getStudentCourseStatuses() {
        this.dictService.getStudentCourseStatuses().subscribe(
            data => this.studentCoursetStatuses = data,
            error => this.notification.showNotification("error",
                error?.error?.message ?? 'Не удалось справочник статусов записавшихся на курс')
        );
    }

    cancel() {
        if (this.isAdmin)
            this.router.navigateByUrl(this.returnUrl ?? coursesUrl);
        else
            this.router.navigateByUrl(this.returnUrl ?? studentCoursesUrl);
    }

    onTabSelect(e: SelectEvent) {
        switch (e.index) {
            case 0:
                break;
            case 1:
                if (!this.isAdmin)
                    return;
                this.studentCourseRecordRead();
                break;
            case 2:
                break;
        }
    }

    /* -------------- COURSE -------------- */

    getCourseDetails() {
        this.courseService.getCourseDetails(this.courseId).subscribe(
            data => {
                this.courseDetails = data;

                this.allowCourseRegistred = !this.isAdmin && data.status.id == CourseStatusEnum.Recruiting;

                this.getCourseAds();
                this.getStudentRegisteredList();
                this.getCourseProgramms();
            },
            error => this.notification.showNotification("error",
                error?.error?.message ?? 'Не удалось получить детали выбранного курса')
        );
    }

    saveCourse() {
        if (!this.allowEdit)
            return;

        if (!this.form.valid) {
            this.form.markAllAsTouched();
            return;
        }

        let date = new Date(this.courseDetails.dateBegin);
        date.setHours(date.getHours() + 12);
        this.courseDetails.dateBegin = date;
        date = new Date(this.courseDetails.dateEnd);
        date.setHours(date.getHours() + 12);
        this.courseDetails.dateEnd = date;

        let formData = new FormData();
        if (this.courseDetails.id != null)
            formData.append('Id', this.courseDetails.id);
        formData.append('Name', this.courseDetails.name);
        formData.append('Description', this.courseDetails.description);
        formData.append('Teachers', this.courseDetails.teachers);
        formData.append('DateBegin', this.courseDetails.dateBegin.toDateString());
        formData.append('DateEnd', this.courseDetails.dateEnd.toDateString());
        formData.append('AcademicHours', this.courseDetails.academicHours.toString().replace('.', ','));
        formData.append('Cost', this.courseDetails.cost.toString().replace('.', ','));
        formData.append('StatusId', this.courseDetails.status.id.toString());
        formData.append('Location', this.courseDetails.location);

        this.courseDetails.id == null
            ? this.courseService.postEvent(formData).subscribe(
                data => {
                    this.courseId = this.courseDetails.id = data;
                    this.notification.showNotification("success", "Сохранено");
                },error => this.notification.showNotification("error",
                    error?.error?.message ?? 'Произошла ошибка во время сохранения курса'))
            : this.courseService.putEvent(formData).subscribe(
                data => {
                    this.notification.showNotification("success", "Сохранено");
                },error => this.notification.showNotification("error",
                    error?.error?.message ?? 'Произошла ошибка во время сохранения курса'));
    }

    /* -------------- COURSE PROGRAMM -------------- */

    getCourseProgramms() {
        this.courseService.getCourseProgramm(this.courseId).subscribe(
            data => {
                if (data == null)
                    return;

                this.courseProgramms = [];
                for (let i = 0; i < data.length; i++) {
                    let module = data[i];
                    if (module.themes?.length > 0)
                        for (let j = 0; j < module.themes.length; j++) {
                            module.themes[j].date = convertUTCDateToLocalDate(new Date(module.themes[j].date));
                        }
                    this.courseProgramms.push(module);
                }
            },
            error => this.notification.showNotification("error",
                error?.error?.message ?? 'Не удалось получить программу курса')
        );

        function convertUTCDateToLocalDate(date) {
            var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);

            var offset = date.getTimezoneOffset() / 60;
            var hours = date.getHours();

            newDate.setHours(hours - offset);
            return newDate;
        }
    }

    addTheme(moduleId) {
        if (moduleId == null)
            return;

        var module = this.courseProgramms.find(x => x.id == moduleId);
        if (module == undefined)
            return;

        let newTheme = new ProgrammTheme();
        newTheme.id = Guid.newGuid();
        newTheme.dataState = DataState.Added;

        if (module.themes == null)
            module.themes = [];

        module.themes.push(newTheme);
    }

    addModule() {
        let newModule = new ProgrammModule();
        newModule.id = Guid.newGuid();
        newModule.dataState = DataState.Added;

        this.courseProgramms.push(newModule);
    }

    removeTheme(moduleId, themeId) {
        if (themeId == null || moduleId == null)
            return;

        let module = this.courseProgramms.find(x => x.id == moduleId);
        if (module == null)
            return;

        let theme = module.themes.find(x => x.id == themeId);
        if (theme == null)
            return;

        if (theme.dataState == DataState.Added)
            module.themes = module.themes.filter(x => x.id != themeId);
        else {
            theme.dataState = DataState.Deleted;
        }
    }

    removeModule(moduleId) {
        if (moduleId == null)
            return;

        let module = this.courseProgramms.find(x => x.id == moduleId);
        if (module == null)
            return;

        if (module.dataState == DataState.Added)
            this.courseProgramms = this.courseProgramms.filter(x => x.id != moduleId);
        else {
            module.dataState = DataState.Deleted;
            module.themes = module.themes.filter(x => x.dataState != DataState.Added);
            for (let i = 0; i < module.themes?.length ?? 0; i++) {
                module.themes[i].dataState = DataState.Deleted;
            }
        }
    }

    programStateChange(dataItem) {
        if (dataItem == null)
            return;

        if (dataItem.dataState != DataState.Added)
            dataItem.dataState = DataState.Updated;
    }

    recalcModuleAcademicHours(moduleId) {
        let module = this.courseProgramms.find(x => x.id == moduleId);
        if (module == null || module.themes == null) {
            module.academicHours = 0;
            return;
        }
        module.academicHours = module.themes.reduce((partialSum, x) =>
            partialSum + x.academicHours, 0);
    }

    recalcModuleDate(moduleId) {
        let module = this.courseProgramms.find(x => x.id == moduleId);
        if (module == null || module.themes == null) {
            module.date = "";
            return;
        }

        let dates = [];
        for (let i = 0; i < module.themes.length; i++) {
            if (module.themes[i].date != null)
                dates.push(module.themes[i].date);
        }

        let min = new Date(Math.min.apply(null, dates));
        let max = new Date(Math.max.apply(null, dates));

        module.date = `c ${min.toLocaleDateString("ru-RU")} по ${max.toLocaleDateString("ru-RU")}`;
    }

    async saveCourseProgramm() {
        if (!this.allowEdit || this.courseProgramms == null)
            return;

        if (!this.enableSaveCourseProgramm()){
            this.notification.showNotification("error", "Заполните все необходимые поля");
            return;
        }

        /*if (addList.length == 0 && updateList.length == 0 && deleteList.length == 0) {
            this.notification.showNotification("info", 'Нет данных для сохранения');
            return;
        }*/

        try {
            for (let index = 0; index < this.courseProgramms.length; index++) {
                let module = this.courseProgramms[index];

                switch (module.dataState) {
                    case DataState.Added:
                        await this.courseService.postProgramModule({
                            CourseId: this.courseDetails.id,
                            Name: module.name
                        }).then(data => {
                            module.dataState = null;
                            module.id = data;
                        });
                        await this.saveChangesProgramThemes(module.id, module.themes);
                        break;
                    case DataState.Updated:
                        await this.courseService.putProgramModule({
                            Id: module.id,
                            Name: module.name
                        }).then(data => module.dataState = null);
                        await this.saveChangesProgramThemes(module.id, module.themes);
                        break;
                    case DataState.Deleted:
                        await this.saveChangesProgramThemes(module.id, module.themes);
                        await this.courseService.deleteProgramModule(module.id);
                        break;
                    // если в модулях е было изменений, то проверим темы модулей
                    default:
                        await this.saveChangesProgramThemes(module.id, module.themes);
                        break;
                }
            }

            this.notification.showNotification("success", 'Программа курса сохранена');
            this.getCourseProgramms();
        }
        catch (e) {
            this.notification.showNotification("error",
                e?.error?.message ?? 'Произошла ошибка во время удаления темы модуля');
        }
    }

    async saveChangesProgramThemes(moduleId, themes: ProgrammTheme[]) {
        if (themes == null || themes.length == 0)
            return;

        for (let i = 0; i < themes.length ?? 0; i++) {
            let theme = themes[i];

            switch (theme.dataState) {
                case DataState.Added:
                    await this.courseService.postProgramTheme({
                        ModuleId: moduleId,
                        Name: theme.name,
                        AcademicHours: theme.academicHours,
                        Date: theme.date,
                        Location: theme.location
                    }).then(data => {
                        theme.dataState = null;
                        theme.id = data;
                    });
                    break;
                case DataState.Updated:
                    await this.courseService.putProgramTheme({
                        Id: theme.id,
                        Name: theme.name,
                        AcademicHours: theme.academicHours,
                        Date: theme.date,
                        Location: theme.location
                    }).then(data => theme.dataState = null);
                    break;
                case DataState.Deleted:
                    await this.courseService.deleteProgramTheme(theme.id);
                    break;
            }
        }
    }

    // в будущем надо поменять на formArray, а то это страшно выглядит)
    enableSaveCourseProgramm(){
        if (this.courseProgramms == null)
            return false;

        for (let i = 0; i < this.courseProgramms.length; i++) {
            let module = this.courseProgramms[i];
            if (module.dataState != DataState.Deleted && (module.name == null || module.name.length == 0))
                return false;

            if (module.themes == null)
                continue;

            for (let j = 0; j < module.themes.length; j++) {
                let theme = module.themes[j];
                if (theme.dataState == DataState.Deleted)
                    continue;
                if (theme.name == null || theme.name.length == 0 || theme.date == null || theme.academicHours == null ||
                    theme.academicHours == 0 || theme.location == null || theme.location.length == 0)
                    return false;
            }
        }

        return true;
    }

    /* -------------- STUDENT REGISTERED -------------- */

    getStudentRegisteredList() {
        if (this.courseDetails.id == null)
            return;

        this.courseService.getStudentRegistered(this.courseDetails.id).subscribe(
            data => {
                this.studentRegistered = data;
                this.studentRegisteredNewRecord = data?.filter(x => x.isNewRecord)?.length ?? 0;
                this.studentCourseStatus = data?.find(x => x.user?.id == this.user?.id)?.status;
            },
            error => this.notification.showNotification("error",
                error?.error?.message ?? 'Не удалось получить список записавшихся на курс')
        );
    }

    removeStudentCourse({dataItem}) {
        if (!this.allowEdit || dataItem == null || dataItem.id == null)
            return;

        this.confirmService.dialogOpen("Удаление", "Вы уверены, что хотите удалить эту запись?").result
            .subscribe((result) => {
                if (result instanceof DialogCloseResult || result.text == this.confirmService.confirmFalse)
                    return;

                this.courseService.deleteStudentRegistered(dataItem.id).subscribe(
                    data => {
                        this.notification.showNotification("success", 'Удалено');
                        this.getStudentRegisteredList();
                    },error => this.notification.showNotification("error",
                        error?.error?.message ?? 'Произошла ошибка во время удаления записи'));
            });
    }

    dataStateChange(status, gridItem) {
        if (gridItem == null || status == null)
            return;

        this.courseService.updateStudentCourseStatus({
            studentCourseId: gridItem.id,
            statusId: status.id
        }).subscribe(
            data => {
                gridItem.status = status;
                this.notification.showNotification("success", 'Статус обновлен');
            },error => this.notification.showNotification("error",
                error?.error?.message ?? 'Произошла ошибка во время обновления статуса'));
    }

    registerCourse() {
        if (!this.allowCourseRegistred || this.courseId == null)
            return;

        this.courseService.postStudentCourse({
            courseId: this.courseId
        }).subscribe(
            data => {
                this.notification.showNotification("success", "Заявка на регистрацию подана");
                this.cancel();
            },error => this.notification.showNotification("error",
                error?.error?.message ?? "Не удалось зарегистрироваться"));
    }

    studentCourseRecordRead() {
        if (!this.isAdmin || this.studentRegistered == null)
            return;

        this.studentRegistered.filter(x => x.isNewRecord).forEach(x => {
            this.courseService.studentCourseRecordRead(x.id);
        })
    }

    /* -------------- COURSE ADS -------------- */

    getCourseAds() {
        if (this.courseDetails.id == null)
            return;

        this.courseService.getCourseAds(this.courseDetails.id).subscribe(
            data => this.courseAds = data,
            error => this.notification.showNotification("error",
                error?.error?.message ?? 'Не удалось получить список новостей и объявлений')
        );
    }

    addCourseAd() {
        if (!this.allowEdit)
            return;

        this.courseAd = new CourseAd();
        this.courseAd.courseId = this.courseId;

        this.formCourse = new FormGroup({
            text: new FormControl(this.courseAd.text, [
                Validators.required
            ]),
            annotation: new FormControl(this.courseAd.annotation, [
                Validators.required,
                Validators.maxLength(1024)
            ]),
            title: new FormControl(this.courseAd.title, [
                Validators.required,
                Validators.maxLength(512)
            ])
        });
        this.showCourseAddDetails = true;
    }

    closeCourseAdDetails() {
        this.showCourseAddDetails = false;
    }

    removeCourseAd(event) {
        if (!this.allowEdit)
            return;

        this.confirmService.dialogOpen("Удаление", "Вы уверены, что хотите удалить эту запись?").result
            .subscribe((result) => {
                if (result instanceof DialogCloseResult || result.text == this.confirmService.confirmFalse)
                    return;

                this.courseService.deleteCourseAd(event.dataItem.id).subscribe(
                    data => {
                        this.notification.showNotification("success", 'Удалено');
                        this.getCourseAds();
                    },error =>this.notification.showNotification("error",
                        error?.error?.message ?? 'Произошла ошибка во время удаления объявления'));
            });
    }

    courseAdDetails(event) {
        if (event?.dataItem?.id == null)
            return;

        //console.log(event);
        this.courseAd = this.courseAds.find(x => x.id == event.dataItem.id);

        this.formCourse = new FormGroup({
            text: new FormControl(this.courseAd.text, [
                Validators.required
            ]),
            annotation: new FormControl(this.courseAd.annotation, [
                Validators.required,
                Validators.maxLength(1024)
            ]),
            title: new FormControl(this.courseAd.title, [
                Validators.required,
                Validators.maxLength(512)
            ])
        })

        this.showCourseAddDetails = true;
    }

    saveCourseAd() {
        if (!this.allowEdit)
            return;

        if (!this.formCourse.valid) {
            this.formCourse.markAllAsTouched();
            return;
        }

        if (this.courseAd.id != null) {
            this.courseService.putCourseAd(this.courseAd).subscribe(
                data => {
                    this.showCourseAddDetails = false;
                    this.courseAd = null;

                    this.notification.showNotification("success", 'Сохранено');

                    this.getCourseAds();
                },error => this.notification.showNotification("error",
                    error?.error?.message ?? 'Произошла ошибка во время сохранения объявления'));
        }
        else {
            this.courseService.postCourseAd(this.courseAd).subscribe(
                data => {
                    this.notification.showNotification("success", 'Сохранено');

                    this.showCourseAddDetails = false;
                    this.courseId = null;

                    this.getCourseAds();
                },error => {
                    this.notification.showNotification("error",
                        error?.error?.message ?? 'Произошла ошибка во время сохранения объявления');
                    console.log(error);
                });
        }
    }
}
