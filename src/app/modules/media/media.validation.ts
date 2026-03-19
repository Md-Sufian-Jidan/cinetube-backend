import { z } from "zod";
import { MediaType, MediaPricing, CastRole } from "../../../generated/prisma/enums";

const createMediaValidationSchema = z.object({
    body: z.object({
        title: z.string({ error: "Title is required" }),
        synopsis: z.string({ error: "Synopsis is required" }),
        releaseYear: z.number({ error: "Release year is required" }),
        director: z.string({ error: "Director is required" }),
        type: z.nativeEnum(MediaType, { error: "Media type is required" }),
        pricing: z.nativeEnum(MediaPricing).default(MediaPricing.FREE),
        streamingLink: z.string().url().optional(),
        posterUrl: z.string().url().optional(),
        genres: z.array(z.string()).min(1, "At least one genre is required"),
        cast: z.array(
            z.object({
                name: z.string({ error: "Cast name is required" }),
                role: z.nativeEnum(CastRole, { error: "Cast role is required" }),
                bio: z.string().optional(),
            })
        ).min(1, "At least one cast member is required"),
    }),
});

const updateMediaValidationSchema = z.object({
    body: z.object({
        title: z.string().optional(),
        synopsis: z.string().optional(),
        releaseYear: z.number().optional(),
        director: z.string().optional(),
        type: z.nativeEnum(MediaType).optional(),
        pricing: z.nativeEnum(MediaPricing).optional(),
        streamingLink: z.string().url().optional(),
        posterUrl: z.string().url().optional(),
        genres: z.array(z.string()).optional(),
        cast: z.array(
            z.object({
                name: z.string().optional(),
                role: z.nativeEnum(CastRole).optional(),
                bio: z.string().optional(),
            })
        ).optional(),
    }),
});

export const MediaValidation = {
    createMediaValidationSchema,
    updateMediaValidationSchema,
};
