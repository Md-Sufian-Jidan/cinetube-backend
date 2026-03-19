import { z } from "zod";

const addToWatchlistValidationSchema = z.object({
    body: z.object({
        mediaId: z.string({
            error: "Media ID is required",
        }),
    }),
});

const removeFromWatchlistValidationSchema = z.object({
    body: z.object({
        mediaId: z.string({ error: "Media ID is required" }),
    }),
});

export const WatchlistValidation = {
    addToWatchlistValidationSchema,
    removeFromWatchlistValidationSchema,
};
