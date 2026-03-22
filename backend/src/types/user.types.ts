export interface User {
    id: string;
    name: string;
    email: string;
    login: string;
    phone: string;
    password: string;
    createdAt: Date;
}

export interface UserCreateDTO {
    name: string;
    email: string;
    login: string;
    phone: string;
    password: string;
}

export interface UserLoginDTO {
    login: string;
    password: string;
}