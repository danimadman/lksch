export class Profile {
    constructor() { }

    public firstName: string;
    public middleName?: string;
    public lastName: string;
    public birthDay: Date;
    public isMale: boolean;
    public email: string;
    public phoneNumber: string;
    public educationalInstitutionId?: any;
    public educationalInstitutionName?: string;
    public classNumber?: number;
    public parentFIO?: string;
    public parentPhoneNumber?: string;
}

export class ProfileForm {
    constructor() {}
    
    public firstName: string;
    public middleName?: string;
    public lastName: string;
    public birthDay: Date;
    public isMale: boolean;
    public email: string;
    public phoneNumber: string;
    public educationalInstitutionId?: number;
    public classNumber?: number;
    public parentFIO?: string;
    public parentPhoneNumber?: string;
}