import Stripe from "stripe";
import { env } from "../../config/env";
import { prisma } from "../../lib/prisma";
import AppError from "../../errors/AppError";
import status from "http-status";
import { PlanDuration, PaymentStatus } from "../../../generated/prisma/enums";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

// ✅ 1. Create Payment Intent
const createPaymentIntent = async (userId: string, planId: string) => {
    const plan = await prisma.subscriptionPlan.findUnique({
        where: { id: planId },
    });

    if (!plan) {
        throw new AppError(status.NOT_FOUND, "Subscription plan not found");
    }

    const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(plan.price * 100),
        currency: "usd",
        automatic_payment_methods: { enabled: true },
        metadata: {
            userId,
            planId,
        },
    });

    return {
        clientSecret: paymentIntent.client_secret,
    };
};

// ✅ 2. Internal: Create Subscription (NOT EXPOSED)
const createSubscription = async (userId: string, planId: string) => {
    const plan = await prisma.subscriptionPlan.findUnique({
        where: { id: planId },
    });

    if (!plan) {
        throw new AppError(status.NOT_FOUND, "Subscription plan not found");
    }

    const existing = await prisma.userSubscription.findFirst({
        where: {
            userId,
            isActive: true,
            endDate: { gt: new Date() },
        },
    });

    if (existing) return existing; // prevent duplicate

    const startDate = new Date();
    const endDate = new Date(startDate);

    if (plan.duration === PlanDuration.MONTHLY) {
        endDate.setMonth(endDate.getMonth() + 1);
    } else {
        endDate.setFullYear(endDate.getFullYear() + 1);
    }

    return prisma.$transaction(async (tx) => {
        const subscription = await tx.userSubscription.create({
            data: {
                userId,
                planId,
                startDate,
                endDate,
                isActive: true,
            },
        });

        return subscription;
    });
};

// ✅ 3. Webhook Handler
const handleStripeWebhook = async (sig: string, rawBody: string | Buffer) => {
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            rawBody,
            sig,
            env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err: any) {
        throw new AppError(status.BAD_REQUEST, `Webhook signature verification failed: ${err.message}`);
    }

    // 🔥 Handle successful payment
    if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        const userId = paymentIntent.metadata.userId;
        const planId = paymentIntent.metadata.planId;

        if (!userId || !planId) {
            throw new AppError(status.BAD_REQUEST, "Invalid payment metadata");
        }

        // ✅ prevent duplicate processing
        const existingPayment = await prisma.payment.findFirst({
            where: { stripeId: paymentIntent.id },
        });

        if (existingPayment) return { received: true };

        await prisma.$transaction(async (tx) => {
            // 💰 Save payment
            await tx.payment.create({
                data: {
                    userId,
                    amount: paymentIntent.amount / 100,
                    status: PaymentStatus.SUCCESS,
                    stripeId: paymentIntent.id,
                },
            });

            // 🎟️ Create subscription
            await createSubscription(userId, planId);
        });
    }

    return { received: true };
};

export const PaymentService = {
    createPaymentIntent,
    handleStripeWebhook,
    createSubscription,
};