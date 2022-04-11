import {Dict} from "./dicts";
import {UserModel} from "./account";
import {DataState} from "../options/enums";

export class Course {
    constructor() {
    }

    public id: string;
    public name: string;
    public dateBegin: string | Date;
    public dateEnd: string | Date;
    public academicHours: number;
    public status: Dict;
    public members: number;
}

export class StudentCourse {
    constructor() {
    }

    public id: string;
    public name: string;
    public dateBegin: string | Date;
    public dateEnd: string | Date;
    public academicHours: number;
    public status: Dict;
    public studentCourseStatus: Dict;
}

export class CourseDetails {
    constructor() {
        this.name = null;
        this.description = null;
        this.teachers = null;
        this.location = null;
    }

    public id: string;
    public name: string;
    public description: string;
    public teachers: string;
    public dateBegin: string | Date;
    public dateEnd: string | Date;
    public academicHours: number;
    public cost: number;
    public status: Dict;
    public location: string;
}

export class CourseAd {
    constructor() {
        this.title = null;
        this.annotation = null;
        this.text = null;
    }

    public id: string;
    public courseId: string;
    public title: string;
    public annotation: string;
    public text: string;
    public dateAdd: Date;
}

export class StudentRegistered {
    constructor() {
    }

    public id: string;
    public isNewRecord: boolean;
    public status: Dict;
    public user: UserModel;
}

export class ProgrammModule {
    constructor() {
        this.name = null;
        this.themes = [];
    }

    public id: string;
    public name: string;
    public themes: ProgrammTheme[];

    public date: string;
    public academicHours: number;

    public dataState: DataState;
}

export class ProgrammTheme {
    constructor() {
        this.name = null;
        this.location = null;
    }

    public id: string;
    public name: string;
    public academicHours: number;
    public date: Date;
    public location: string;

    public dataState: DataState;
}
