export type AuthData = {
    id: number;
    username: string;
    fullname: string;
    department_id: number;
    user_level_id: number;
    token: string;
    refresh_token: string;
    [key: string]: any;
};

export type AuthContextData = {
    auth: AuthData;
    login: (user: AuthData) => void;
    logout: () => void;
};