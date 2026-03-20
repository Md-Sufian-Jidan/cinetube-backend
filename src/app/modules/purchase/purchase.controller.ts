import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";
import { PaymentService } from "./purchase.service";
import { env } from "../../config/env";
import AppError from "../../errors/AppError";
import { stripe } from "../../config/stripe.config";

const createCheckoutSession = catchAsync(async (req: any, res: Response) => {
    const userId = req.user!.userId;
    const { planId, mediaId } = req.body;
    const result = await PaymentService.createCheckoutSession(userId, planId, mediaId);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Checkout session created successfully",
        data: result,
    });
});

const handleWebhook = catchAsync(async (req: any, res: Response) => {
    const sig = req.headers["stripe-signature"] as string;
    const webhook = env.STRIPE_WEBHOOK_SECRET;

    if (!sig || !webhook) {
        throw new AppError(status.BAD_REQUEST, "Invalid webhook signature");
    }

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhook);
    } catch (error: any) {
        throw new AppError(status.BAD_REQUEST, error.message);
    }

    try {
        const result = await PaymentService.handleStripeWebhookEvent(event);
        sendResponse(res, {
            statusCode: status.OK,
            success: true,
            message: "Webhook handled successfully",
            data: result,
        });
    } catch (error: any) {
        sendResponse(res, {
            statusCode: status.BAD_REQUEST,
            success: false,
            message: error.message || "Handle Stripe Webhook Event Failed",
            data: null,
        })
    }
});

export const PurchaseController = {
    createCheckoutSession,
    handleWebhook,
};
