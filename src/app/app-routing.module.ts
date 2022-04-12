import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "./guards/auth.guard";
import {NgModule} from "@angular/core";

import {HomeComponent} from "./components/home/home.component";
import {AnnouncementsComponent} from "./components/announcements/announcements.component";
import {AnnouncementComponent} from "./components/announcement/announcement.component";
import {AchievementsComponent} from "./components/achievements/achievements.component";
import {AchievementComponent} from "./components/achievement/achievement.component";
import {RegisteredEventsComponent} from "./components/registered-events/registered-events.component";
import {EventsComponent} from "./components/events/events.component";
import {EventDetailsComponent} from "./components/event-details/event-details.component";
import {StudentCoursesComponent} from "./components/student-courses/student-courses.component";
import {CoursesComponent} from "./components/courses/courses.component";
import {CourseDetailsComponent} from "./components/course-details/course-details.component";
import {LoginComponent} from "./components/login/login.component";
import {ForgotPasswordComponent} from "./components/forgot-password/forgot-password.compontn";
import {ResendEmailConfirmComponent} from "./components/resend-email-confirm/resend-email-confirm.component";
import {ResetPasswordComponent} from "./components/reset-password/reset-password.component";
import {RegisterComponent} from "./components/register/register.component";
import {RegisterConfirmComponent} from "./components/register-confirm/register-confirm.component";
import {NotFoundComponent} from "./components/not-found/not-found";

const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },

    { path: 'Announcements', component: AnnouncementsComponent, canActivate: [AuthGuard] },
    { path: 'Announcements/:announcementTypeId/:id', component: AnnouncementComponent, canActivate: [AuthGuard] },

    { path: 'Achievements', component: AchievementsComponent, canActivate: [AuthGuard] },
    { path: 'Achievements/:id', component: AchievementComponent, canActivate: [AuthGuard] },

    { path: 'RegisteredEvents', component: RegisteredEventsComponent, canActivate: [AuthGuard] },
    { path: 'Events', component: EventsComponent, canActivate: [AuthGuard] },
    { path: 'EventDetails/:id', component: EventDetailsComponent, canActivate: [AuthGuard] },

    { path: 'StudentCourses', component: StudentCoursesComponent, canActivate: [AuthGuard] },
    { path: 'Courses', component: CoursesComponent, canActivate: [AuthGuard] },
    { path: 'CourseDetails/:id', component: CourseDetailsComponent, canActivate: [AuthGuard] },

    { path: 'Account/Login', component: LoginComponent },
    { path: 'Account/ForgotPassword', component: ForgotPasswordComponent },
    { path: 'Account/ResendEmailConfirmation', component: ResendEmailConfirmComponent },
    { path: 'Account/ResetPassword', component: ResetPasswordComponent },
    { path: 'Register', component: RegisterComponent },
    { path: 'Register/ConfirmEmail', component: RegisterConfirmComponent },
    { path: "**", redirectTo: '/', pathMatch: "full" }
    //{ path: '**', component: NotFoundComponent }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes/*, {useHash: true}*/) ],
    exports: [ RouterModule ]
})

export class AppRoutes {}
