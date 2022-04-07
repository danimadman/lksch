export class Profile {
    constructor() {
        this.educationalInstitution = new EducationalInstitution();
    }

    public firstName: string;
    public middleName?: string;
    public lastName: string;
    public birthDay: Date;
    public isMale: boolean;
    public email: string;
    public phoneNumber: string;
    public educationalInstitution?: EducationalInstitution;
    public classNumber?: number;
    public parentFIO?: string;
    public parentPhoneNumber?: string;
}

export class EducationalInstitution {
    constructor() {
    }

    public educationalInstitutionId: number;
    public educationalInstitutionName: string;
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
