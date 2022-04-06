import {Dict} from "./dicts";
import {UserModel} from "./account";
import {DataState} from "../options/enums";
import {Guid} from "../services/Helper/common";

export class EventShort {
    constructor() {
    }

    public id: string;
    public name: string;
    public dateBegin: Date;
    public dateEnd:	Date;
    public typeName: string;
    public statusName: string;
    public registeredCount:	number;
}

export class EventDetails {
    constructor() {
        this.name = null;
        this.description = null;
        this.organizers = null;
        this.location = null;
    }

    public id: string;
    public name: string;
    public description: string;
    public organizers: string;
    public location: string;
    public dateBegin: Date;
    public dateEnd:	Date;
    public eventType: Dict;
    public status: Dict;
}

export class EventFile {
    constructor() {
    }

    public id: string;
    public fileName: string;
}

export class StudentEvent {
    constructor() {
    }

    public id: string;
    public status: Dict;
    public user: UserModel;
}

export class EventAd {
    constructor() {
        this.title = null;
        this.annotation = null;
        this.text = null;
    }

    public id: string;
    public eventId: string;
    public title: string;
    public annotation: string;
    public text: string;
    public dateAdd: Date;
}