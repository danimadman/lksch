import {Component, OnInit} from '@angular/core';
import {HomeService} from "../../services/home.service";
import {DictService} from "../../services/dict.service";
import {AccountService} from "../../services/account.service";
import {NotService} from "../../services/notification.service";
import {Announcement} from "../../models/announcement";
import {announcementsUrl} from "../../options/settings";

@Component({
    templateUrl: './announcements.html',
    providers: [HomeService, AccountService, DictService, NotService],
    styleUrls: ['./announcements.css']
})

export class AnnouncementsComponent implements OnInit {
    announcements: Announcement[];
    announcementsUrl: string = announcementsUrl;

    constructor(private homeService: HomeService, private notification: NotService) {
    }

    ngOnInit() {
        this.homeService.getAnnouncements().subscribe(
            data => this.announcements = data,
            error => this.notification.showNotification("error", "Не удалось получить объявления"));
    }
}