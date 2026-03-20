import { Response } from "express";

interface ApiResponse<T> {
    success: boolean;
    statusCode: number;
    message: string;
    data: T | null;
    meta?: {
        page: number;
        limit: number;
        total: number;
        totalPage: number;
    } | null;
}

export const sendResponse = <T>(res: Response, responseData: ApiResponse<T>) => {
    const { success, statusCode, message, data, meta } = responseData;
    res.status(statusCode).json({
        success,
        statusCode,
        message,
        data,
        meta
    });
};