import {Component, OnInit} from "@angular/core";
import {NotService} from "../../services/notification.service";
import {Router} from "@angular/router";
import {CoursesService} from "../../services/courses.service";
import {AccountService} from "../../services/account.service";
import {Course} from "../../models/courses";
import {RoleEnum} from "../../options/enums";
import {courseDetailsUrl, coursesUrl} from "../../options/settings";

@Component({
    templateUrl: './courses.html',
    providers: [AccountService, CoursesService]
})

export class CoursesComponent implements OnInit {
    courses: Course[];
    gridLoading: boolean = true;

    roles: number[] = [];
    isAdmin: boolean = false;

    constructor(private notification: NotService, private router: Router, private coursesService: CoursesService,
                private accountService: AccountService) {
    }

    ngOnInit() {
        this.accountService.getRoles().subscribe(data => {
            this.roles = data;
            this.isAdmin = data.includes(RoleEnum.Admin);
        });

        this.coursesService.getCourses().subscribe(
            data => {
                this.courses = data;
                this.gridLoading = false;
            },
            error => {
                this.notification.showNotification("error",
                    error?.error?.message ?? 'Не удалось получить список курсов');
                this.gridLoading = false;
            }
        );
    }

    cellClick({dataItem}) {
        if (dataItem == null)
            return;

        this.router.navigateByUrl(`${courseDetailsUrl}/${dataItem.id}?ReturnUrl=` + coursesUrl);
    }

    addCourse() {
        this.router.navigateByUrl(`${courseDetailsUrl}/Add`);
    }
}