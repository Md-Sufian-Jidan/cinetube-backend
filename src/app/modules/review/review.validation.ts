import { z } from "zod";

const createReviewValidationSchema = z.object({
    body: z.object({
        rating: z.number().min(1).max(10, "Rating must be between 1 and 10"),
        content: z.string().min(10, "Review content must be at least 10 characters"),
        tags: z.array(z.string()).optional(),
        isSpoiler: z.boolean().optional().default(false),
        mediaId: z.string({ error: "Media ID is required" }),
    }),
});

const updateReviewValidationSchema = z.object({
    body: z.object({
        rating: z.number().min(1).max(10).optional(),
        content: z.string().min(10).optional(),
        tags: z.array(z.string()).optional(),
        isSpoiler: z.boolean().optional(),
    }),
});

const createCommentValidationSchema = z.object({
    body: z.object({
        content: z.string().min(1, "Comment content is required"),
        reviewId: z.string({ error: "Review ID is required" }),
        parentId: z.string().optional(),
    }),
});

export const ReviewValidation = {
    createReviewValidationSchema,
    updateReviewValidationSchema,
    createCommentValidationSchema,
};
