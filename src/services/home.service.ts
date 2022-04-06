import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {Profile} from "../models/profile";
import {Observable, throwError} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {apiUrl} from "../options/settings";
import {Announcement} from "../models/announcement";
import {CourseAd} from "../models/courses";

@Injectable()
export class HomeService {
    private url = `${apiUrl}/api/Home`;
    
    constructor(private http: HttpClient) {
    }

    getProfile(): Observable<Profile> {
        return this.http.get(`${this.url}/GetProfile`).pipe(
            map((data: Profile) => data),
            catchError(err => throwError(err))
        );
    }
    
    putProfile(profile: Profile): Observable<boolean> {
        return this.http.put(`${this.url}/PutProfile`, profile).pipe(
            map((data: boolean) => data),
            catchError(err => throwError(err))
        );
    }

    getAnnouncements(count?: number): Observable<Announcement[]> {
        return this.http.get(`${this.url}/GetAnnouncements/${count}`).pipe(
            map((data: Announcement[]) => {
                return data.map(function (d: Announcement): Announcement {
                    d.dateAdd = new Date(d.dateAdd);
                    return d;
                });
            })
        );
    }

    getAnnouncement(announcementTypeId, id): Observable<Announcement> {
        return this.http.get(`${this.url}/GetAnnouncement/${announcementTypeId}/${id}`).pipe(
            map((data: Announcement) => {
                data.dateAdd = new Date(data.dateAdd);
                return data;
            })
        );
    }
}