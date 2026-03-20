import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AdminService } from "./admin.service";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";

const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.getDashboardStats();

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Dashboard stats fetched successfully",
        data: result,
    });
});

const getPendingReviews = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.getPendingReviews();

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Pending reviews fetched successfully",
        data: result,
    });
});

const getMediaAnalytics = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.getMediaAnalytics();

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Media analytics fetched successfully",
        data: result,
    });
});

const getUserActivity = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.getUserActivity();

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "User activity fetched successfully",
        data: result,
    });
});

export const AdminController = {
    getDashboardStats,
    getPendingReviews,
    getMediaAnalytics,
    getUserActivity,
};
