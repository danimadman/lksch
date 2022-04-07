export class RegisterModel {
    constructor() { }
    
    public firstName: string;
    public middleName: string;
    public lastName: string;
    public email: string;
    public password: string;
    public passwordConfirm: string;
    public birthDay: Date;
    public isMale: boolean;
    public phoneNumber: string;
    public isConsentPersonalData: boolean;
}

export class ResendEmailConfirmModel {
    constructor() {
    }
    public email: string;
}