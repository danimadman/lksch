import {Dict} from "./dicts";
import {FileModel} from "./files";

export class Achievement {
    constructor() {
        this.type = null;
        this.status = new Dict();
        this.availableStatuses = [];
    }
    public id: number;
    public type: Dict;
    public event: string;
    public title: string;
    public yearOfReceipt: number;
    public fileName: string;
    public status: Dict;
    public availableStatuses: Dict[];
    public files: FileModel[];
    public allowEdit: boolean;
    public allowApprove: boolean;
}

export class AchievementForm {
    constructor() {
        
    }
    
    public id: number;
    public typeId: number;
    public event: string;
    public title: string;
    public yearOfReceipt: number;
    public statusId: number;
    public files: FileModel[];
}

export class ChatMessage {
    constructor() {
    }
    
    public text: string;
    public timestamp: string;
    public author: ChatUser;
}

export class ChatUser {
    constructor() {
    }
    
    public id: string;
    public name: string;
    avatarUrl: string;
}