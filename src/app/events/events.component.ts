import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {NotService} from "../../services/notification.service";
import {EventsService} from "../../services/events.service";
import {EventShort} from "../../models/events";
import {RoleEnum} from "../../options/enums";
import {AccountService} from "../../services/account.service";
import {eventDetailsUrl, eventsUrl, registeredEventsUrl} from "../../options/settings";

@Component({
    templateUrl: './events.html',
    providers: [NotService, EventsService, AccountService]
})

export class EventsComponent implements OnInit {
    events: EventShort[];
    gridLoading: boolean = true;

    roles: number[] = [];
    isAdmin: boolean = false;

    constructor(private notification: NotService, private router: Router, private eventsService: EventsService,
                private accountService: AccountService) {
    }

    ngOnInit() {
        this.accountService.getRoles().subscribe(data => {
            this.roles = data;
            this.isAdmin = data.includes(RoleEnum.Admin);
        });

        this.eventsService.getEvents().subscribe(
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
        this.router.navigateByUrl(`${eventDetailsUrl}/${event.dataItem.id}?ReturnUrl=` + eventsUrl);
    }

    addEvent() {
        this.router.navigateByUrl(`${eventDetailsUrl}/Add`);
    }
}