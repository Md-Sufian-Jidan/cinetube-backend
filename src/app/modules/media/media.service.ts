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

const getAllMediaFromDB = async (query: any) => {
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
        page = 1,
        limit = 10,
    } = query;

    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};

    // ✅ FILTERS

    if (genre) {
        where.genres = {
            some: {
                name: {
                    in: Array.isArray(genre) ? genre : [genre],
                },
            },
        };
    }

    if (releaseYear) {
        where.releaseYear = Number(releaseYear);
    }

    if (type) {
        where.type = type;
    }

    if (pricing) {
        where.pricing = pricing;
    }

    // ✅ Rating Filter (IMPORTANT)
    if (minRating || maxRating) {
        where.averageRating = {};

        if (minRating) {
            where.averageRating.gte = Number(minRating);
        }

        if (maxRating) {
            where.averageRating.lte = Number(maxRating);
        }
    }

    // ✅ SEARCH (POWERFUL 🔥)
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
            totalReviews: sortOrder,
        };
    }

    // ✅ MAIN QUERY + COUNT (for pagination)
    const [data, total] = await Promise.all([
        prisma.media.findMany({
            where,
            orderBy,
            skip,
            take: Number(limit),
            include: {
                genres: true,
                cast: true,
                _count: {
                    select: {
                        reviews: true,
                    },
                },
            },
        }),

        prisma.media.count({ where }),
    ]);

    return {
        meta: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPage: Math.ceil(total / Number(limit)),
        },
        data,
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
