import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from "rxjs";
import {Dict} from "../models/dicts";
import {catchError, map} from "rxjs/operators";
import {apiUrl} from "../options/settings";

@Injectable()
export class DictService {
    private url = `${apiUrl}/api/Dict`;
    
    constructor(private http: HttpClient) {
    }

    getEducationalInstitution(filter: string) : Observable<Dict[]> {
        return this.http.get(`${this.url}/GetEducationalInstitution
            ${filter == null || filter.length == 0 ? "" : "/" + filter}`).pipe(
                map((data: Dict[]) => data),
                catchError(err => throwError(err))
        );
    }

    getAchievementTypes() : Observable<Dict[]> {
        return this.http.get(`${this.url}/GetAchievementTypes`).pipe(
            map((data: Dict[]) => data),
            catchError(err => throwError(err))
        );
    }

    getEventTypes() : Observable<Dict[]> {
        return this.http.get(`${this.url}/GetEventTypes`).pipe(
            map((data: Dict[]) => data),
            catchError(err => throwError(err))
        );
    }

    getEventStatuses() : Observable<Dict[]> {
        return this.http.get(`${this.url}/GetEventStatuses`).pipe(
            map((data: Dict[]) => data),
            catchError(err => throwError(err))
        );
    }

    getStatuses() : Observable<Dict[]> {
        return this.http.get(`${this.url}/GetStatuses`).pipe(
            map((data: Dict[]) => data),
            catchError(err => throwError(err))
        );
    }

    getStudentEventStatuses(): Observable<Dict[]> {
        return this.http.get<Dict[]>(`${this.url}/GetStudentEventStatuses`);
    }

    getStudentCourseStatuses(): Observable<Dict[]> {
        return this.http.get<Dict[]>(`${this.url}/GetStudentCourseStatuses`);
    }

    getCourseStatuses(): Observable<Dict[]> {
        return this.http.get<Dict[]>(`${this.url}/GetCourseStatuses`);
    }
}