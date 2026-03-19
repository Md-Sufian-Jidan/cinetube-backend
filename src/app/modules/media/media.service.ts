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
    const { genre, releaseYear, type, pricing, searchTerm } = filters;

    const where: any = {};

    if (genre) {
        where.genres = {
            some: {
                name: genre,
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

    if (searchTerm) {
        where.OR = [
            { title: { contains: searchTerm, mode: "insensitive" } },
            { director: { contains: searchTerm, mode: "insensitive" } },
        ];
    }

    const result = await prisma.media.findMany({
        where,
        include: {
            genres: true,
            cast: true,
        },
    });

    return result;
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

export const MediaService = {
    createMedia,
    getAllMediaFromDB,
    getSingleMediaFromDB,
    updateMediaInDB,
    deleteMediaFromDB,
};
