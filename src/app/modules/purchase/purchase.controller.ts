import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";
import { PurchaseService } from "./purchase.service";

const createPaymentIntent = catchAsync(async (req: Request, res: Response) => {
    const { amount } = req.body;
    const result = await PurchaseService.createPaymentIntent(amount);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Payment intent created successfully",
        data: result,
    });
});

const subscribeToPlan = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { planId } = req.body;
    const result = await PurchaseService.subscribeToPlan(userId, planId);

    sendResponse(res, {
        statusCode: status.CREATED,
        success: true,
        message: "Subscription created successfully",
        data: result,
    });
});

export const PurchaseController = {
    createPaymentIntent,
    subscribeToPlan,
};
