export interface User {
    [x: string]: any;
    user: User;
    jwtToken: any;
    id: string;
    firstname?: string;
    lastname?: string;
    bio?: string;
    country?: string;
    email: string;
}