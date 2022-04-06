import {LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthGuard} from "../guards/auth.guard";
import {CookieService} from "ngx-cookie-service";

import "@progress/kendo-angular-intl/locales/ru/all";
import {DropDownsModule, SharedModule} from '@progress/kendo-angular-dropdowns';
import { CheckBoxModule } from "@progress/kendo-angular-treeview";
import { LabelModule } from "@progress/kendo-angular-label";
import { InputsModule } from "@progress/kendo-angular-inputs";
import { ButtonsModule } from "@progress/kendo-angular-buttons";
import { DateInputsModule } from "@progress/kendo-angular-dateinputs";
import { NotificationModule } from '@progress/kendo-angular-notification';
import { GridModule } from "@progress/kendo-angular-grid";
import { UploadsModule } from "@progress/kendo-angular-upload";
import { ListViewModule } from "@progress/kendo-angular-listview";
import { DialogsModule } from "@progress/kendo-angular-dialog";
import { ChatModule } from "@progress/kendo-angular-conversational-ui";
import { LayoutModule } from "@progress/kendo-angular-layout";
import { MessageService } from "@progress/kendo-angular-l10n";
import { EditorModule } from "@progress/kendo-angular-editor";

import {SharedComponent} from "./shared/shared.component";
import {HomeComponent} from "./home/home.component";
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {RegisterConfirmComponent} from "./register-confirm/register-confirm.component";
import {ForgotPasswordComponent} from "./forgot-password/forgot-password.compontn";
import {ResendEmailConfirmComponent} from "./resend-email-confirm/resend-email-confirm.component";
import {ResetPasswordComponent} from "./reset-password/reset-password.component";
import {AppComponent} from "./app.component";
import {AchievementsComponent} from "./achievements/achievements.component";
import {NotFoundComponent} from "./not-found/not-found";
import {AchievementComponent} from "./achievement/achievement.component";
import {TokenInterceptor} from "../interceptors/token.interceptor";
import {RegisteredEventsComponent} from "./registered-events/registered-events.component";
import {EventsComponent} from "./events/events.component";
import {EventDetailsComponent} from "./event-details/event-details.component";
import {LocalizationMessageService} from "../services/Helper/localization.service";
import {CoursesComponent} from "./courses/courses.component";
import {CourseDetailsComponent} from "./course-details/course-details.component";
import {StudentCoursesComponent} from "./student-courses/student-courses.component";
import {AnnouncementsComponent} from "./announcements/announcements.component";
import {AnnouncementComponent} from "./announcement/announcement.component";
import {AppRoutingModule} from "./app-routing.module";

@NgModule({
    imports: [
        AppRoutingModule,
        BrowserModule, BrowserAnimationsModule,
        FormsModule, ReactiveFormsModule, HttpClientModule,
        //------------------------------------kendo---------------------------------------
        DropDownsModule, ButtonsModule, CheckBoxModule, InputsModule, LabelModule,
        DateInputsModule, NotificationModule, GridModule, UploadsModule, SharedModule, ListViewModule,
        DialogsModule, ChatModule, LayoutModule, EditorModule
        //--------------------------------------------------------------------------------
    ],
    providers: [
        { provide: LOCALE_ID, useValue: "ru-RU" },
        { provide: MessageService, useClass: LocalizationMessageService },
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
        AuthGuard,
        CookieService
    ],
    declarations: [
        AppComponent, SharedComponent, HomeComponent, LoginComponent, RegisterComponent,
        RegisterConfirmComponent, ForgotPasswordComponent, ResendEmailConfirmComponent,
        ResetPasswordComponent, NotFoundComponent,
        AchievementComponent, AchievementsComponent,
        RegisteredEventsComponent, EventsComponent, EventDetailsComponent,
        CoursesComponent, CourseDetailsComponent, StudentCoursesComponent,
        AnnouncementsComponent, AnnouncementComponent
    ],
    bootstrap: [
        AppComponent
    ]
})

export class AppModule { }