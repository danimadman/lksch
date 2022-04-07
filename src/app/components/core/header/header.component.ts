import { Component, OnInit } from '@angular/core';
import {homeUrl} from "../../../options/settings";

declare var $: any;

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
        $('#btn-left-menu').on("click", function () {
            $('#left-menu').toggle();
            $('header').toggleClass('sidebar-toggled');

            if ($('header').hasClass('sidebar-toggled')) {
                $(document).on('click', function (e) {
                    if (($(e.target).closest("#left-menu").length === 0) && ($(e.target).closest("#btn-left-menu").length === 0)) {
                        setTimeout(function () {
                            $("#left-menu").hide();
                            $('header').removeClass('sidebar-toggled');
                        });
                    }
                });
            }
        });
    }
}
