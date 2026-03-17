import { Response } from "express";

interface ApiResponse<T> {
    success: boolean;
    statusCode: number;
    message: string;
    data: T | null;
}

export const sendResponse = <T>(res: Response, responseData: ApiResponse<T>) => {
    const { success, statusCode, message, data } = responseData;
    res.status(statusCode).json({
        success,
        statusCode,
        message,
        data,
    });
};