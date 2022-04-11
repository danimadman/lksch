import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Achievement} from "../../models/achievements";
import {NotService} from "../../services/notification.service";
import {AchievementsService} from "../../services/achievements.service";
import {addAchievementUrl, achievementsUrl} from '../../options/settings';
import {RoleEnum} from '../../options/enums';
import {AccountService} from "../../services/account.service";
import {DictService} from "../../services/dict.service";
import {RoleService} from "../../services/role.service";

@Component({
    templateUrl: './achievements.html',
    providers: [AchievementsService, NotService, AccountService, DictService],
    styleUrls: ['./achievements.css']
})

export class AchievementsComponent implements AfterViewInit, OnInit {
    achievements: Achievement[];

    roles: number[] = [];
    isAdmin: boolean = false;

    gridLoading: boolean = true;

    constructor(private achievementsService: AchievementsService, private notification: NotService,
                private router: Router, private roleService: RoleService) {
    }

    ngOnInit() {
        this.roles = this.roleService.getRole();
        if (this.roles != null)
            this.isAdmin = this.roles.includes(RoleEnum.Admin);

        this.getAchievements();
    }

    ngAfterViewInit() {
    }
    
    getAchievements() {
        this.achievementsService.getAchievements().subscribe(
            data => {
                this.achievements = data;
                this.gridLoading = false;
            },
            error => {
                this.notification.showNotification("error",
                    error?.error?.message ?? "Не удалось загрузить достижения");
                this.gridLoading = false;
            }
        );
    }
    
    cellClick(event) {
        let dataItem = event.dataItem;
        if (dataItem !== undefined)
            this.router.navigateByUrl(`${achievementsUrl}/${dataItem.id}`);
    }
    
    addAchievement() {
        this.router.navigateByUrl(addAchievementUrl);
    }

    filter() {
        
    }
}
