import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {map, catchError} from 'rxjs/operators';
import {Course, CourseAd, CourseDetails, ProgrammModule, StudentCourse, StudentRegistered} from "../models/courses";
import {environment} from "../../environments/environment";
@Injectable()
export class CoursesService {
    private url = `${environment.apiEndpoint}Courses`;

    constructor(private http: HttpClient) {
    }

    getStudentCourses(): Observable<StudentCourse[]> {
        return this.http.get(`${this.url}/GetStudentCourses`).pipe(
            map((courses: StudentCourse[]) => {
                return courses.map(function (course: StudentCourse): StudentCourse {
                    course.dateBegin = new Date(course.dateBegin);
                    course.dateEnd = new Date(course.dateEnd);
                    return course;
                });
            })
        );
    }

    getCourses(): Observable<Course[]> {
        return this.http.get(`${this.url}/GetCourses`).pipe(
            map((courses: Course[]) => {
                return courses.map(function (course: Course): Course {
                    course.dateBegin = new Date(course.dateBegin);
                    course.dateEnd = new Date(course.dateEnd);
                    return course;
                });
            })
        );
    }

    getCourseDetails(id): Observable<CourseDetails> {
        //return this.http.get<CourseDetails>(`${this.url}/GetCourseDetails/${id}`);
        return this.http.get(`${this.url}/GetCourseDetails/${id}`).pipe(
            map((data: CourseDetails) => {
                data.dateBegin = new Date(data.dateBegin);
                data.dateEnd = new Date(data.dateEnd);
                return data;
            })
        );
    }

    postEvent(data: FormData): Observable<string> {
        return this.http.post<string>(`${this.url}/PostCourse`, data);
    }

    putEvent(data: FormData): Observable<boolean> {
        return this.http.put<boolean>(`${this.url}/PutCourse`, data);
    }

    /* -------------- COURSE ADS -------------- */

    getCourseAds(courseId): Observable<CourseAd[]> {
        return this.http.get(`${this.url}/GetCourseAds/${courseId}`).pipe(
            map((courses: CourseAd[]) => {
                return courses.map(function (course: CourseAd): CourseAd {
                    course.dateAdd = new Date(course.dateAdd);
                    return course;
                });
            })
        );
    }

    postCourseAd(data: CourseAd): Observable<string> {
        return this.http.post<string>(`${this.url}/PostCourseAd`, data);
    }

    putCourseAd(data: CourseAd): Observable<boolean> {
        return this.http.put<boolean>(`${this.url}/PutCourseAd`, data);
    }

    deleteCourseAd(id): Observable<boolean> {
        return this.http.delete<boolean>(`${this.url}/DeleteCourseAd/${id}`);
    }

    /* -------------- STUDENT Registered -------------- */

    getStudentRegistered(courseId): Observable<StudentRegistered[]> {
        return this.http.get<StudentRegistered[]>(`${this.url}/GetStudentRegisteredList/${courseId}`);
    }

    postStudentCourse(data: any): Observable<string> {
        return this.http.post<string>(`${this.url}/PostStudentCourse`, data);
    }

    updateStudentCourseStatus(data: any): Observable<boolean> {
        return this.http.put<boolean>(`${this.url}/UpdateStudentCourseStatus`, data);
    }

    deleteStudentRegistered(id): Observable<boolean> {
        return this.http.delete<boolean>(`${this.url}/DeleteStudentCourse/${id}`);
    }

    /* -------------- COURSE PROGRAMM -------------- */

    getCourseProgramm(courseId): Observable<ProgrammModule[]> {
        return this.http.get<ProgrammModule[]>(`${this.url}/GetCourseProgramm/${courseId}`);
    }

    postProgramModule(data: any): Promise<string> {
        return this.http.post<string>(`${this.url}/PostProgramModule`, data).toPromise();
    }

    putProgramModule(data: any): Promise<boolean> {
        return this.http.put<boolean>(`${this.url}/PutProgramModule`, data).toPromise();
    }

    deleteProgramModule(id): Promise<boolean> {
        return this.http.delete<boolean>(`${this.url}/DeleteProgramModule/${id}`).toPromise();
    }

    postProgramTheme(data: any): Promise<string> {
        return this.http.post<string>(`${this.url}/PostProgramTheme`, data).toPromise();
    }

    putProgramTheme(data: any): Promise<boolean> {
        return this.http.put<boolean>(`${this.url}/PutProgramTheme`, data).toPromise();
    }

    deleteProgramTheme(id): Promise<boolean> {
        return this.http.delete<boolean>(`${this.url}/DeleteProgramTheme/${id}`).toPromise();
    }
}