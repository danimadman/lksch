import {Injectable} from "@angular/core";
import {Observable, throwError} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class FileService {
    private url: string = `${environment.apiEndpoint}File`;

    constructor(private http: HttpClient) {
    }

    /**
     * Получение файла достижения
     * @param fileId ID файла
     */
    getAchievementFile(fileId: number): any {
        return this.http.get(`${this.url}/GetAchievementFile/${fileId}`, { responseType: "blob" });
    }

    /**
     * Удаление файла достижения
     * @param fileId ID файла
     */
    deleteAchievementFile(fileId: number): Observable<boolean> {
        return this.http.delete(`${this.url}/DeleteAchievementFile/${fileId}`).pipe(
            map((data: boolean) => data),
            catchError(err => throwError(err))
        );
    }

    /**
     * Получение файла мероприятия
     * @param eventFileId ID файла
     */
    getEventFile(eventFileId): any {
        return this.http.get(`${this.url}/GetEventFile/${eventFileId}`, { responseType: "blob" });
    }

    /**
     * Сохранения файлов мероприятия
     * @param formData форма, в которой 2 свойства:
     * EventId - ID мероприятия;
     * EventFiles - массив файлов
     */
    postEventFiles(formData: FormData): Observable<boolean> {
        return this.http.post<boolean>(`${this.url}/PostEventFiles`, formData);
    }

    /**
     * Удаление файла мероприятия
     * @param eventFileId ID файла
     */
    deleteEventFile(eventFileId): Observable<boolean> {
        return this.http.delete(`${this.url}/DeleteEventFile/${eventFileId}`).pipe(
            map((data: boolean) => data),
            catchError(err => throwError(err))
        );
    }

    /**
     * Получение файла мероприятия
     * @param eventFileId ID файла
     */
    getConsentPD(): any {
        return this.http.get(`${this.url}/GetConsentPD`, { responseType: "blob" });
    }
}