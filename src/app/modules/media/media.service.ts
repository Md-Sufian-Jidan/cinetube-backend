import { Status } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { IMedia } from "./media.interface";

const createMedia = async (payload: IMedia) => {
    const { genres, cast, ...mediaData } = payload;

    const result = await prisma.media.create({
        data: {
            ...mediaData,
            genres: {
                connectOrCreate: genres.map((name) => ({
                    where: { name },
                    create: { name },
                })),
            },
            cast: {
                create: cast.map((member) => ({
                    name: member.name,
                    role: member.role,
                    bio: member.bio,
                })),
            },
        },
        include: {
            genres: true,
            cast: true,
        },
    });

    return result;
};

const getAllMediaFromDB = async (filters: any) => {
    const {
        genre,
        releaseYear,
        type,
        pricing,
        searchTerm,
        minRating,
        maxRating,
        sortBy,
        sortOrder = "desc",
    } = filters;

    const where: any = {};

    // ✅ Genre filter (multiple support)
    if (genre) {
        where.genres = {
            some: {
                name: {
                    in: Array.isArray(genre) ? genre : [genre],
                },
            },
        };
    }

    // ✅ Release year
    if (releaseYear) {
        where.releaseYear = Number(releaseYear);
    }

    // ✅ Type
    if (type) {
        where.type = type;
    }

    // ✅ Pricing
    if (pricing) {
        where.pricing = pricing;
    }

    // ✅ Rating filter (if you have field like avgRating)
    // if (minRating || maxRating) {
    //     where.averageRating = {};
    //     if (minRating) where.averageRating.gte = Number(minRating);
    //     if (maxRating) where.averageRating.lte = Number(maxRating);
    // }

    // ✅ SEARCH (FULL POWER 🔥)
    if (searchTerm) {
        where.OR = [
            {
                title: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            },
            {
                director: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            },
            {
                streamingLink: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            },
            {
                genres: {
                    some: {
                        name: {
                            contains: searchTerm,
                            mode: "insensitive",
                        },
                    },
                },
            },
            {
                cast: {
                    some: {
                        name: {
                            contains: searchTerm,
                            mode: "insensitive",
                        },
                    },
                },
            },
        ];
    }

    // ✅ SORTING
    let orderBy: any = { createdAt: "desc" };

    if (sortBy === "latest") {
        orderBy = { releaseYear: "desc" };
    }

    if (sortBy === "rating") {
        orderBy = { averageRating: sortOrder };
    }

    if (sortBy === "reviews") {
        orderBy = {
            reviews: {
                _count: sortOrder,
            },
        };
    }

    const result = await prisma.media.findMany({
        where,
        orderBy,
        include: {
            genres: true,
            cast: true,
            _count: {
                select: {
                    reviews: true,
                },
            },
        },
    });

    const averageRating = await prisma.review.aggregate({
        _avg: {
            rating: true,
        },
    });

    return {
        result,
        averageRating,
    };
};

const getSingleMediaFromDB = async (id: string) => {
    const result = await prisma.media.findUnique({
        where: { id },
        include: {
            genres: true,
            cast: true,
            reviews: {
                where: {
                    status: "PUBLISHED",
                },
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true,
                        },
                    },
                },
            },
        },
    });

    return result;
};

const updateMediaInDB = async (id: string, data: Partial<IMedia>) => {
    const { genres, cast, ...mediaData } = data;

    const result = await prisma.media.update({
        where: { id },
        data: {
            ...mediaData,
            ...(genres && {
                genres: {
                    set: [], // Clear existing genres
                    connectOrCreate: genres.map((name) => ({
                        where: { name },
                        create: { name },
                    })),
                },
            }),
            ...(cast && {
                cast: {
                    deleteMany: {}, // Clear existing cast for this media
                    create: cast.map((member) => ({
                        name: member.name!,
                        role: member.role!,
                        bio: member.bio,
                    })),
                },
            }),
        },
        include: {
            genres: true,
            cast: true,
        },
    });

    return result;
};

const deleteMediaFromDB = async (id: string) => {
    const result = await prisma.media.delete({
        where: {
            id,
        },
    });
    return result;
};

export const MediaService = {
    createMedia,
    getAllMediaFromDB,
    getSingleMediaFromDB,
    updateMediaInDB,
    deleteMediaFromDB,
};
