import { Injectable } from '@angular/core';
import {DialogRef, DialogService} from "@progress/kendo-angular-dialog";

@Injectable({
    providedIn: 'root'
})
export class ConfirmService {
    public confirmFalse: string = 'Нет';
    
    constructor(private dialogService: DialogService) {
    }
    
    dialogOpen(title: string, content: string): DialogRef {
        return this.dialogService.open({
            title: title ?? '',
            content: content ?? '',
            actions: [{ text: "Нет" }, { text: "Да", themeColor: "primary" }],
            width: 450,
            height: 200,
            maxWidth: 450,
        });
    }
}