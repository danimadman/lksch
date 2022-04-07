import {Component, OnInit} from '@angular/core';
import {HomeService} from "../../services/home.service";
import {NotService} from "../../services/notification.service";
import {Announcement} from "../../models/announcement";
import {ActivatedRoute} from "@angular/router";
import {announcementsUrl} from "../../options/settings";

@Component({
    templateUrl: './announcement.html',
    providers: [HomeService],
    styleUrls: ['./announcement.css']
})

export class AnnouncementComponent implements OnInit {
    announcement: Announcement = new Announcement();
    announcementUrl: string = announcementsUrl;

    constructor(private homeService: HomeService, private notification: NotService,
                private activatedRoute: ActivatedRoute) {
    }

    ngOnInit() {
        let id = this.activatedRoute.snapshot.params["id"];
        let announcementTypeId = this.activatedRoute.snapshot.params["announcementTypeId"];
        this.homeService.getAnnouncement(announcementTypeId, id).subscribe(
            data => this.announcement = data,
            error => this.notification.showNotification("error", "Не удалось открыть объявление"));
    }
}