import { prisma } from "../../lib/prisma";
import AppError from "../../errors/AppError";
import status from "http-status";
import { IWatchlist } from "./watchlist.interface";

const addWatchlistToDB = async (userId: string, payload: IWatchlist) => {
    const media = await prisma.media.findUnique({
        where: { id: payload.mediaId },
    });

    if (!media) {
        throw new AppError(status.NOT_FOUND, "Media not found");
    }

    const result = await prisma.watchlist.create({
        data: {
            userId,
            mediaId: payload.mediaId,
        },
    });

    return result;
};

const getWatchlistFromDB = async (userId: string) => {
    const result = await prisma.watchlist.findMany({
        where: { userId },
        include: {
            media: {
                include: {
                    genres: true,
                    cast: true
                }
            },
        },
    });

    return result;
};

const removeWatchlistFromDB = async (userId: string, mediaId: string) => {
    // Check if watchlist item exists
    const watchlist = await prisma.watchlist.findUnique({
        where: {
            userId_mediaId: {
                userId,
                mediaId,
            },
        },
    });

    if (!watchlist) {
        throw new AppError(status.NOT_FOUND, "Media not found in watchlist");
    }

    const result = await prisma.watchlist.delete({
        where: {
            userId_mediaId: {
                userId,
                mediaId,
            },
        },
    });

    return result;
};

export const WatchlistService = {
    addWatchlistToDB,
    getWatchlistFromDB,
    removeWatchlistFromDB,
};
