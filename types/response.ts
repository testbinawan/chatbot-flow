type Data = {
    [key: string]: any;
};

export type ResponseData = {
    request_time: number;
    response_code: number;
    success: boolean;
    total_data?: number;
    data?: Data | Data[];
    title?: string;
    message?: string;
};
