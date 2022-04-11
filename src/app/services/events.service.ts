import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {map, catchError} from 'rxjs/operators';
import {EventAd, EventDetails, EventFile, EventShort, StudentEvent} from "../models/events";
import {environment} from "../../environments/environment";

@Injectable()
export class EventsService {
    private url = `${environment.apiEndpoint}Events`;

    constructor(private http: HttpClient) {
    }

    /* -------------- EVENT -------------- */

    getRegisteredEvents(): Observable<EventShort[]> {
        return this.http.get(`${this.url}/GetRegisteredEvents`).pipe(
            map((data: EventShort[]) => {
                return data.map(function (d: EventShort): EventShort {
                    d.dateBegin = new Date(d.dateBegin);
                    d.dateEnd = new Date(d.dateEnd);
                    return d;
                });
            })
        );
    }

    getEvents(): Observable<EventShort[]> {
        return this.http.get(`${this.url}/GetEvents`).pipe(
            map((data: EventShort[]) => {
                return data.map(function (d: EventShort): EventShort {
                    d.dateBegin = new Date(d.dateBegin);
                    d.dateEnd = new Date(d.dateEnd);
                    return d;
                });
            })
        );
    }

    getEventDetails(id: string): Observable<EventDetails> {
        return this.http.get(`${this.url}/GetEventDetails/${id}`).pipe(
            map((data: EventDetails) => {
                data.dateBegin = new Date(data.dateBegin);
                data.dateEnd = new Date(data.dateEnd);
                return data;
            }),
            catchError(err => throwError(err))
        );
    }

    postEvent(data: EventDetails): Observable<string> {
        /*return this.http.post(`${this.url}/PostEvent`, data).pipe(
            map((data: string) => data),
            catchError(err => throwError(err))
        );*/
        return this.http.post<string>(`${this.url}/PostEvent`, data);
    }

    putEvent(data: EventDetails): Observable<boolean> {
        /*return this.http.put(`${this.url}/PutEvent`, data).pipe(
            map((data: boolean) => data),
            catchError(err => throwError(err))
        );*/
        return this.http.put<boolean>(`${this.url}/PutEvent`, data);
    }

    /* -------------- EVENT FILES -------------- */

    getEventFilesList(eventId): Observable<EventFile[]> {
        return this.http.get(`${this.url}/GetEventFileList/${eventId}`).pipe(
            map((data: EventFile[]) => data),
            catchError(err => throwError(err))
        );
    }

    /* -------------- STUDENT EVENTS -------------- */

    getStudentEvents(eventId): Observable<StudentEvent[]> {
        return this.http.get(`${this.url}/GetStudentEvents/${eventId}`).pipe(
            map(
                (data: StudentEvent[]) => {
                    return data.map(function (d: StudentEvent): StudentEvent {
                        d.user.birthday = new Date(d.user.birthday);
                        return d;
                    });
                }
            )
        );
    }

    postStudentEvent(data: any): Observable<string> {
        return this.http.post<string>(`${this.url}/PostStudentEvent`, data);
    }

    updateStudentEventStatus(data: any): Observable<boolean> {
        return this.http.put<boolean>(`${this.url}/UpdateStudentEventStatus`, data);
    }

    deleteStudentEvent(id): Observable<boolean> {
        return this.http.delete<boolean>(`${this.url}/DeleteStudentEvent/${id}`);
    }

    studentEventRecordRead(id): Observable<boolean> {
        return this.http.put<boolean>(`${this.url}/StudentEventRecordRead/${id}`, null);
    }

    /* -------------- EVENT ADS -------------- */

    getEventAds(eventId): Observable<EventAd[]> {
        return this.http.get(`${this.url}/GetEventAds/${eventId}`).pipe(
            map((data: EventAd[]) => {
                return data.map(function (d: EventAd): EventAd {
                    d.dateAdd = new Date(d.dateAdd);
                    return d;
                });
            })
        );
    }

    postEventAd(data: EventAd): Observable<string> {
        return this.http.post<string>(`${this.url}/PostEventAd`, data);
    }

    putEventAd(data: EventAd): Observable<boolean> {
        return this.http.put<boolean>(`${this.url}/PutEventAd`, data);
    }

    deleteEventAd(id): Observable<boolean> {
        return this.http.delete<boolean>(`${this.url}/DeleteEventAd/${id}`);
    }
}
