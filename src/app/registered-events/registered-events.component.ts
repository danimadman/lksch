import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {NotService} from "../../services/notification.service";
import {EventsService} from "../../services/events.service";
import {EventShort} from "../../models/events";
import {eventDetailsUrl, eventsUrl, registeredEventsUrl} from "../../options/settings";

@Component({
    templateUrl: './registered-events.html',
    providers: [NotService, EventsService]
})

export class RegisteredEventsComponent implements OnInit {
    events: EventShort[];
    gridLoading: boolean = true;

    constructor(private notification: NotService, private router: Router, private eventsService: EventsService) {
    }

    ngOnInit() {
        this.eventsService.getRegisteredEvents().subscribe(
            data => {
                this.events = data;
                this.gridLoading = false;
            },
            error => {
                this.notification.showNotification("error",
                    error?.error?.message ?? 'Не удалось получить мероприятия');
                this.gridLoading = false;
            }
        );
    }

    cellClick(event) {
        if (event == null)
            return;
        this.router.navigateByUrl(`${eventDetailsUrl}/${event.dataItem.id}?ReturnUrl=` + registeredEventsUrl);
    }

    allEvents() {
        this.router.navigateByUrl(eventsUrl);
    }
}