export class LoginModel {
    constructor() { }
    public userName: string;
    public password: string;
    public rememberMe: boolean;
}

export class ForgotPasswordModel {
    constructor() {
    }
    public email: string;
}

export class ResetPasswordModel {
    constructor() {
    }
    public email: string;
    public password: string;
    public confirmPassword: string;
    public code: string;
}

export class Role {
    constructor() {
    }
    public id: string;
    public name: string;
}

export class UserModel {
    constructor() {
    }

    public id: string;
    public firstName: string;
    public lastName: string;
    public middleName: string;
    public isMale: boolean;
    public email: string;
    public phoneNumber: string;
    public birthday: Date;
}
