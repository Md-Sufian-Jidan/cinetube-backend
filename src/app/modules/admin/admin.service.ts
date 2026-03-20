import { prisma } from "../../lib/prisma";
import { ReviewStatus, PaymentStatus } from "../../../generated/prisma/enums";

const getDashboardStats = async () => {
    const [userCount, mediaCount, pendingReviewsCount, successfulPayments] = await Promise.all([
        prisma.user.count(),
        prisma.media.count(),
        prisma.review.count({
            where: {
                status: ReviewStatus.PENDING,
            },
        }),
        prisma.payment.findMany({
            where: {
                status: PaymentStatus.SUCCESS,
            },
            select: {
                amount: true,
            },
        }),
    ]);

    const totalRevenue = successfulPayments.reduce((acc, payment) => acc + payment.amount, 0);

    return {
        userCount,
        mediaCount,
        pendingReviewsCount,
        totalRevenue,
    };
};

const getPendingReviews = async () => {
    const result = await prisma.review.findMany({
        where: {
            status: ReviewStatus.PENDING,
        },
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                },
            },
            media: {
                select: {
                    title: true,
                },
            },
        },
    });

    return result;
};

const getMediaAnalytics = async () => {
    const result = await prisma.media.findMany({
        include: {
            _count: {
                select: {
                    reviews: true,
                },
            },
            reviews: {
                select: {
                    rating: true,
                },
            },
        },
    });

    // Calculate average rating for each media
    const analytics = result.map((media) => {
        const totalRating = media.reviews.reduce((acc, review) => acc + review.rating, 0);
        const averageRating = media._count.reviews > 0 ? totalRating / media._count.reviews : 0;

        return {
            id: media.id,
            title: media.title,
            totalReviews: media._count.reviews,
            averageRating: parseFloat(averageRating.toFixed(2)),
        };
    });

    return analytics;
};

const getUserActivity = async () => {
    const [recentPurchases, recentReviews] = await Promise.all([
        prisma.purchase.findMany({
            take: 10,
            orderBy: {
                createdAt: "desc",
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
                media: {
                    select: {
                        title: true,
                    },
                },
            },
        }),
        prisma.review.findMany({
            take: 10,
            orderBy: {
                createdAt: "desc",
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
                media: {
                    select: {
                        title: true,
                    },
                },
            },
        }),
    ]);

    return {
        recentPurchases,
        recentReviews,
    };
};

export const AdminService = {
    getDashboardStats,
    getPendingReviews,
    getMediaAnalytics,
    getUserActivity,
};
