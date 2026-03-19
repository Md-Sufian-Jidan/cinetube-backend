import { MediaType, MediaPricing, CastRole } from "../../../generated/prisma/enums";

export interface IMedia {
    title: string;
    synopsis: string;
    releaseYear: number;
    director: string;
    type: MediaType;
    pricing: MediaPricing;
    streamingLink?: string;
    posterUrl?: string;
    genres: string[]; // Genre names
    cast: {
        name: string;
        role: CastRole;
        bio?: string;
    }[];
}
