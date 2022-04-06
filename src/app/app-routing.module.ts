import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";

import {AuthGuard} from "../guards/auth.guard";

import {SharedComponent} from "./shared/shared.component";
import {HomeComponent} from "./home/home.component";
import {AnnouncementsComponent} from "./announcements/announcements.component";
import {AnnouncementComponent} from "./announcement/announcement.component";
import {AchievementsComponent} from "./achievements/achievements.component";
import {AchievementComponent} from "./achievement/achievement.component";
import {RegisteredEventsComponent} from "./registered-events/registered-events.component";
import {EventsComponent} from "./events/events.component";
import {EventDetailsComponent} from "./event-details/event-details.component";
import {StudentCoursesComponent} from "./student-courses/student-courses.component";
import {CoursesComponent} from "./courses/courses.component";
import {CourseDetailsComponent} from "./course-details/course-details.component";
import {LoginComponent} from "./login/login.component";
import {ForgotPasswordComponent} from "./forgot-password/forgot-password.compontn";
import {ResendEmailConfirmComponent} from "./resend-email-confirm/resend-email-confirm.component";
import {ResetPasswordComponent} from "./reset-password/reset-password.component";
import {RegisterComponent} from "./register/register.component";
import {RegisterConfirmComponent} from "./register-confirm/register-confirm.component";
import {NotFoundComponent} from "./not-found/not-found";

const routes: Routes = [
    { path: '', component: SharedComponent, canActivate: [AuthGuard], canActivateChild: [AuthGuard],
        children: [
            { path: 'Home', component: HomeComponent, pathMatch: "full" },

            { path: 'Announcements', component: AnnouncementsComponent, pathMatch: "full" },
            { path: 'Announcements/:announcementTypeId/:id', component: AnnouncementComponent, pathMatch: "full" },

            { path: 'Achievements', component: AchievementsComponent, pathMatch: "full" },
            { path: 'Achievements/:id', component: AchievementComponent, pathMatch: "full" },

            { path: 'RegisteredEvents', component: RegisteredEventsComponent, pathMatch: "full" },
            { path: 'Events', component: EventsComponent, pathMatch: "full" },
            { path: 'EventDetails/:id', component: EventDetailsComponent, pathMatch: "full" },

            { path: 'StudentCourses', component: StudentCoursesComponent, pathMatch: "full" },
            { path: 'Courses', component: CoursesComponent, pathMatch: "full" },
            { path: 'CourseDetails/:id', component: CourseDetailsComponent, pathMatch: "full" }
        ]
    },
    { path: 'Account/Login', component: LoginComponent },
    { path: 'Account/ForgotPassword', component: ForgotPasswordComponent },
    { path: 'Account/ResendEmailConfirmation', component: ResendEmailConfirmComponent },
    { path: 'Account/ResetPassword/:code', component: ResetPasswordComponent },
    { path: 'Register', component: RegisterComponent },
    { path: 'Register/ConfirmEmail', component: RegisterConfirmComponent },
    { path: '**', component: NotFoundComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule { }