import { Injectable } from '@angular/core';
import {NotificationService, NotificationSettings} from "@progress/kendo-angular-notification";

@Injectable({
    providedIn: 'root'
})
export class NotService {
    private _notificationSettings: NotificationSettings = {
        content: '',
        animation: { type: "slide", duration: 400 },
        position: { horizontal: "right", vertical: "top" },
        type: { style: "none", icon: true },
        height: 40,
        cssClass: 'k-display-flex k-align-items-center' 
    };

    constructor(private notificationService: NotificationService) {
    }

    showNotification(type: 'none' | 'success' | 'warning' | 'error' | 'info', message: string) {
        this._notificationSettings.content = message ?? '';
        this._notificationSettings.type.style = type;
        this.notificationService.show(this._notificationSettings);
    }
}