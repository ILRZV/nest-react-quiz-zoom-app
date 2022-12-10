export interface IOnAuth {
    code: string;
    href: string;
    state: string;
}

export interface IAuthorizeResponse {
    codeChallenge: string;
    state: string;
}