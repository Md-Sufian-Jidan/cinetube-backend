import { z } from "zod";

const createPaymentIntentValidationSchema = z.object({
    body: z.object({
        amount: z.number({
            error: "Amount is required",
        }),
    }),
});

const createSubscriptionValidationSchema = z.object({
    body: z.object({
        planId: z.string({
            error: "Plan ID is required",
        }),
    }),
});

export const PurchaseValidation = {
    createPaymentIntentValidationSchema,
    createSubscriptionValidationSchema,
};
