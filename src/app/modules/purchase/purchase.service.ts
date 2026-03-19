import Stripe from "stripe";
import { env } from "../../config/env";
import { prisma } from "../../lib/prisma";
import AppError from "../../errors/AppError";
import status from "http-status";
import { PlanDuration } from "../../../generated/prisma/enums";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (amount: number) => {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // convert to cents
        currency: "usd",
        payment_method_types: ["card"],
    });

    return {
        clientSecret: paymentIntent.client_secret,
    };
};

const subscribeToPlan = async (userId: string, planId: string) => {
    const plan = await prisma.subscriptionPlan.findUnique({
        where: { id: planId },
    });

    if (!plan) {
        throw new AppError(status.NOT_FOUND, "Subscription plan not found");
    }

    // Check if user already has an active subscription
    const existingSubscription = await prisma.userSubscription.findFirst({
        where: {
            userId,
            isActive: true,
            endDate: {
                gt: new Date(),
            },
        },
    });

    if (existingSubscription) {
        throw new AppError(status.BAD_REQUEST, "User already has an active subscription");
    }

    // Calculate end date based on duration
    const startDate = new Date();
    const endDate = new Date(startDate);
    if (plan.duration === PlanDuration.MONTHLY) {
        endDate.setMonth(endDate.getMonth() + 1);
    } else if (plan.duration === PlanDuration.YEARLY) {
        endDate.setFullYear(endDate.getFullYear() + 1);
    }

    const result = await prisma.userSubscription.create({
        data: {
            userId,
            planId,
            startDate,
            endDate,
            isActive: true,
        },
    });

    return result;
};

export const PurchaseService = {
    createPaymentIntent,
    subscribeToPlan,
};
