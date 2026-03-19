import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { MediaService } from "./media.service";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";

const createMedia = catchAsync(async (req: Request, res: Response) => {
    const result = await MediaService.createMedia(req.body);

    sendResponse(res, {
        statusCode: status.CREATED,
        success: true,
        message: "Media created successfully",
        data: result,
    });
});

const getAllMedia = catchAsync(async (req: Request, res: Response) => {
    const result = await MediaService.getAllMediaFromDB(req.query);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Media fetched successfully",
        data: result,
    });
});

const getSingleMedia = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await MediaService.getSingleMediaFromDB(id as string);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Media fetched successfully",
        data: result,
    });
});

const updateMedia = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await MediaService.updateMediaInDB(id as string, req.body);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Media updated successfully",
        data: result,
    });
});

const deleteMedia = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    await MediaService.deleteMediaFromDB(id as string);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Media deleted successfully",
        data: null,
    });
});

export const MediaController = {
    createMedia,
    getAllMedia,
    getSingleMedia,
    updateMedia,
    deleteMedia,
};