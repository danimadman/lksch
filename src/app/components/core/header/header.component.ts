import { Component, OnInit } from '@angular/core';
import {homeUrl} from "../../../options/settings";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    homeUrl: string = homeUrl;

    constructor() {
    }

    ngOnInit() {
    }
}