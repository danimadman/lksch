export class AuthModel {
    constructor() {
    }

    public login: string;
    public password: string;
}

export class AuthTokens {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    login: string;
    expiresDateTime: Date;
    tokenType: string;
}

export class AuthRefreshToken{
    constructor() {
    }

    refreshToken: string;
}