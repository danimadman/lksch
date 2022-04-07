import {Component} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {AccountService} from "./services/account.service";
import {TokenStorageService} from "./services/token.service";

@Component({
    selector: 'app-root',
    templateUrl: `app.component.html`,
    styleUrls: ['app.component.scss'],
    providers: [AccountService]
})

export class AppComponent {
    title: string;
    showMenu: boolean = false;

    constructor(private router: Router, private route: ActivatedRoute,
                private tokenStorageService: TokenStorageService) {
        /*router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                Function('set', 'page', event.urlAfterRedirects);
                Function('send', 'pageview');
            }
        });*/
        /*router.events
            .filter((event) => event instanceof NavigationEnd)
            .map(() => this.route.firstChild)
            .filter((childRoute) => childRoute !== null)
            .switchMap((childRoute) => childRoute.data)
            .filter((data) => !!data)
            .subscribe((data: Data) => {
                this.title = data.title;
            });*/
    }

    attach($event) {
        //console.log('attach');
    }

    detach($event) {
        //console.log('detach');
    }

    activate($event) {
        //console.log('activate');
        //console.log($event);
        let token = this.tokenStorageService.getAuthToken();
        //console.log(token);
        this.showMenu = token != null;
    }

    deactivate($event) {
        //console.log('deactivate');
    }
}
