import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { ReviewService } from "./review.service";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";

const createReview = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const result = await ReviewService.createReviewInDB({
        ...req.body,
        userId,
    });

    sendResponse(res, {
        statusCode: status.CREATED,
        success: true,
        message: "Review created successfully",
        data: result,
    });
});

const updateReview = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { id } = req.params;
    const result = await ReviewService.updateReviewInDB(id as string, userId, req.body);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Review updated successfully",
        data: result,
    });
});

const deleteReview = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { id } = req.params;
    await ReviewService.deleteReviewFromDB(id as string, userId);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Review deleted successfully",
        data: null,
    });
});

const toggleLike = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { id } = req.params;
    const result = await ReviewService.toggleLikeOnReview(id as string, userId);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: result.liked ? "Liked review" : "Unliked review",
        data: result,
    });
});

const createComment = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const result = await ReviewService.createCommentOnReview({
        ...req.body,
        userId,
    });

    sendResponse(res, {
        statusCode: status.CREATED,
        success: true,
        message: "Comment added successfully",
        data: result,
    });
});

const getMediaReviews = catchAsync(async (req: Request, res: Response) => {
    const { mediaId } = req.params;
    const result = await ReviewService.getReviewsForMedia(mediaId as string);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Reviews fetched successfully",
        data: result,
    });
});

export const ReviewController = {
    createReview,
    updateReview,
    deleteReview,
    toggleLike,
    createComment,
    getMediaReviews,
};
