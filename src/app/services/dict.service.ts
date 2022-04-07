import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from "rxjs";
import {Dict, EducationalInstitution} from "../models/dicts";
import {catchError, map} from "rxjs/operators";
import {environment} from "../../environments/environment";

@Injectable()
export class DictService {
    private url = `${environment.apiEndpoint}Dict`;

    constructor(private http: HttpClient) {
    }

    getEducationalInstitution(filter: string) : Observable<EducationalInstitution[]> {
        return this.http.get<EducationalInstitution[]>(`${this.url}/GetEducationalInstitution
            ${filter == null || filter.length == 0 ? "" : "/" + filter}`);
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
