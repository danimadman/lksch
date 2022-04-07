import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {map, catchError} from 'rxjs/operators';
import {Achievement, ChatMessage} from "../models/achievements";
import {Message} from "@progress/kendo-angular-conversational-ui";
import {environment} from "../../environments/environment";

@Injectable()
export class AchievementsService {
    private url = `${environment.apiEndpoint}Achievements`;
    
    constructor(private http: HttpClient) {
    }
    
    getAchievements(): Observable<Achievement[]> {
        return this.http.get(`${this.url}/GetAchievements`).pipe(
          map((data: Achievement[]) => data),
          catchError(err => throwError(err))  
        );
    }

    getAchievement(id): Observable<Achievement> {
        return this.http.get(`${this.url}/GetAchievement/${id}`).pipe(
            map((data: Achievement) => data),
            catchError(err => throwError(err))
        );
    }
    
    saveAchievement(data: FormData): Observable<boolean> {
        if (data.get("Id") === null) {
            return this.http.post(`${this.url}/PostAchievement`, data).pipe(
                map((data: boolean) => data),
                catchError(err => throwError(err))
            );
        }
        else {
            return this.http.put(`${this.url}/PutAchievement`, data).pipe(
                map((data: boolean) => data),
                catchError(err => throwError(err))
            );
        }
    }

    deleteAchievement(id): Observable<boolean> {
        return this.http.delete(`${this.url}/DeleteAchievement/${id}`).pipe(
            map((data: boolean) => data),
            catchError(err => throwError(err))
        );
    }

    getComments(achievementId): Observable<Message[]> {
        return this.http.get(`${this.url}/GetComments/${achievementId}`).pipe(
            map((data: ChatMessage[]) => {
                return data.map(function(comment: ChatMessage): Message {
                    return new class implements Message {
                        author = comment.author;
                        text = comment.text;
                        timestamp = new Date(comment.timestamp);
                    };
                });
            }),
            catchError(err => throwError(err))
        );
    }

    sendComment(achievementId: number, text: string): Observable<boolean> {
        return this.http.get(`${this.url}/SendComment/${achievementId}/${text}`).pipe(
            map((data: boolean) => data),
            catchError(err => throwError(err))
        );
    }
}