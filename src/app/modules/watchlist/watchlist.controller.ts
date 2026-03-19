import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";
import { WatchlistService } from "./watchlist.service";

const addWatchlist = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const result = await WatchlistService.addWatchlistToDB(userId, req.body);

    sendResponse(res, {
        statusCode: status.CREATED,
        success: true,
        message: "Media added to watchlist successfully",
        data: result,
    });
});

const getWatchlist = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const result = await WatchlistService.getWatchlistFromDB(userId);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Watchlist retrieved successfully",
        data: result,
    });
});

const removeWatchlist = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { mediaId } = req.params;
    const result = await WatchlistService.removeWatchlistFromDB(userId, mediaId as string);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Media removed from watchlist successfully",
        data: result,
    });
});

export const WatchlistController = {
    addWatchlist,
    getWatchlist,
    removeWatchlist,
};
