import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {NotService} from "../../services/notification.service";
import {
    courseDetailsUrl,
    coursesUrl,
    studentCoursesUrl
} from "../../options/settings";
import {StudentCourse} from "../../models/courses";
import {CoursesService} from "../../services/courses.service";

@Component({
    templateUrl: './student-courses.html',
    providers: [NotService, CoursesService]
})

export class StudentCoursesComponent implements OnInit {
    courses: StudentCourse[];
    gridLoading: boolean = true;

    constructor(private notification: NotService, private router: Router, private courseService: CoursesService) {
    }

    ngOnInit() {
        this.courseService.getStudentCourses().subscribe(
            data => {
                this.courses = data;
                this.gridLoading = false;
            },
            error => {
                this.notification.showNotification("error",
                    error?.error?.message ?? 'Не удалось получить курсы');
                this.gridLoading = false;
            }
        );
    }

    cellClick(event) {
        if (event == null)
            return;
        this.router.navigateByUrl(`${courseDetailsUrl}/${event.dataItem.id}?ReturnUrl=` + studentCoursesUrl);
    }

    allCourses() {
        this.router.navigateByUrl(coursesUrl);
    }
}