import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";
import { PaymentService } from "./purchase.service";

const createPaymentIntent = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { planId } = req.body;
    const result = await PaymentService.createPaymentIntent(userId, planId);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Payment intent created successfully",
        data: result,
    });
});

const handleWebhook = catchAsync(async (req: any, res: Response) => {
    const sig = req.headers["stripe-signature"] as string;
    const result = await PaymentService.handleStripeWebhook(sig, req.body);

    res.status(status.OK).json(result);
});

export const PurchaseController = {
    createPaymentIntent,
    handleWebhook,
};
