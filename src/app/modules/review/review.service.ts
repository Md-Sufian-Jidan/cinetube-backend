import { prisma } from "../../lib/prisma";
import AppError from "../../errors/AppError";
import status from "http-status";

const createReviewInDB = async (payload: any) => {
    // Check if media exists
    const media = await prisma.media.findUnique({
        where: { id: payload.mediaId },
    });

    if (!media) {
        throw new AppError(status.NOT_FOUND, "Media not found");
    }

    const result = await prisma.review.create({
        data: payload,
    });
    return result;
};

const updateReviewInDB = async (id: string, userId: string, payload: any) => {
    const review = await prisma.review.findUnique({
        where: { id },
    });

    if (!review) {
        throw new AppError(status.NOT_FOUND, "Review not found");
    }

    if (review.userId !== userId) {
        throw new AppError(status.FORBIDDEN, "You can only update your own reviews!");
    }

    if (review.status === "PUBLISHED") {
        throw new AppError(status.BAD_REQUEST, "Cannot update a published review!");
    }

    const result = await prisma.review.update({
        where: { id },
        data: payload,
    });
    return result;
};

const deleteReviewFromDB = async (id: string, userId: string) => {
    const review = await prisma.review.findUnique({
        where: { id },
    });

    if (!review) {
        throw new AppError(status.NOT_FOUND, "Review not found");
    }

    if (review.userId !== userId) {
        throw new AppError(status.FORBIDDEN, "You can only delete your own reviews!");
    }

    if (review.status === "PUBLISHED") {
        throw new AppError(status.BAD_REQUEST, "Cannot delete a published review!");
    }

    const result = await prisma.review.delete({
        where: { id },
    });
    return result;
};

const toggleLikeOnReview = async (reviewId: string, userId: string) => {
    const existingLike = await prisma.like.findUnique({
        where: {
            userId_reviewId: {
                userId,
                reviewId,
            },
        },
    });

    if (existingLike) {
        await prisma.like.delete({
            where: {
                id: existingLike.id,
            },
        });
        return { liked: false };
    } else {
        await prisma.like.create({
            data: {
                userId,
                reviewId,
            },
        });
        return { liked: true };
    }
};

const createCommentOnReview = async (payload: any) => {
    const result = await prisma.comment.create({
        data: payload,
    });
    return result;
};

const getReviewsForMedia = async (mediaId: string) => {
    const result = await prisma.review.findMany({
        where: {
            mediaId,
            status: "PUBLISHED",
        },
        include: {
            user: {
                select: {
                    name: true,
                    image: true,
                },
            },
            likes: true,
            comments: {
                include: {
                    user: {
                        select: {
                            name: true,
                            image: true,
                        },
                    },
                    replies: true,
                },
            },
        },
    });
    return result;
};

export const ReviewService = {
    createReviewInDB,
    updateReviewInDB,
    deleteReviewFromDB,
    toggleLikeOnReview,
    createCommentOnReview,
    getReviewsForMedia,
};
