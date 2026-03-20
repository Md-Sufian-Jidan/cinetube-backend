import Stripe from "stripe";
import { env } from "../../config/env";
import { prisma } from "../../lib/prisma";
import AppError from "../../errors/AppError";
import status from "http-status";
import { PlanDuration, PaymentStatus, PurchaseType } from "../../../generated/prisma/enums";
import { sendEmail } from "../../utils/email";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (userId: string, planId: string, mediaId?: string) => {
    const plan = await prisma.subscriptionPlan.findUnique({
        where: { id: planId },
    });

    if (!plan) {
        throw new AppError(status.NOT_FOUND, "Subscription plan not found");
    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: plan.name,
                        description: plan.description || "",
                    },
                    unit_amount: Math.round(plan.price * 100),
                },
                quantity: 1,
            },
        ],
        success_url: `${env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${env.FRONTEND_URL}/payment/cancel`,
        metadata: {
            userId,
            planId,
            mediaId: mediaId || "",
            type: mediaId ? PurchaseType.BUY : PurchaseType.RENT, // Assuming BUY for media, RENT for subscription if needed
        },
    });

    return {
        url: session.url,
    };
};

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

const handleStripeWebhookEvent = async (event: Stripe.Event) => {
    const existingPayment = await prisma.payment.findFirst({
        where: { stripeId: event.id },
    });

    if (existingPayment) {
        console.log(`Payment already exists: ${event.id}`);
        return { message: "Payment already exists" };
    }

    switch (event.type) {
        case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            const userId = session.metadata?.userId;
            const planId = session.metadata?.planId;
            const mediaId = session.metadata?.mediaId;

            if (!userId || !planId) {
                throw new AppError(status.BAD_REQUEST, "Invalid payment metadata");
            }

            const plan = await prisma.subscriptionPlan.findUnique({
                where: { id: planId },
            });

            if (!plan) {
                throw new AppError(status.NOT_FOUND, "Subscription plan not found");
            }

            const user = await prisma.user.findUnique({
                where: { id: userId },
            });

            if (!user) {
                throw new AppError(status.NOT_FOUND, "User not found");
            }

            await prisma.$transaction(async (tx) => {

                await tx.purchase.create({
                    data: {
                        userId,
                        mediaId: mediaId!,
                        amount: plan.price,
                        type: session.metadata?.type as PurchaseType,
                    },
                });

                // 💰 Save payment
                await tx.payment.create({
                    data: {
                        userId,
                        amount: plan.price,
                        status: PaymentStatus.SUCCESS,
                        stripeId: session.id,
                        transactionId: session.payment_intent as string,
                    },
                });

                // 🎟️ Create subscription
                await createSubscription(userId, planId);
            });

            // 📧 Send Confirmation Email
            let mediaTitle = null;
            if (mediaId) {
                const media = await prisma.media.findUnique({ where: { id: mediaId } });
                mediaTitle = media?.title;
            }

            await sendEmail({
                to: user.email,
                subject: "CineTube - Payment Confirmation",
                templateName: "paymentConfirmation",
                templateData: {
                    name: user.name,
                    amount: plan.price,
                    planName: plan.name,
                    transactionId: session.payment_intent as string,
                    mediaTitle: mediaTitle,
                }
            });

            break;
        }

        case "checkout.session.expired": {
            const session = event.data.object;
            console.log(`Checkout session expired`);
            break;
        }

        case "payment_intent.payment_failed": {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            console.log(`Payment intent ${paymentIntent.id} payment failed`);
            break;
        }

        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    return { received: true };
}

export const PaymentService = {
    createCheckoutSession,
    handleStripeWebhookEvent,
    createSubscription,
};