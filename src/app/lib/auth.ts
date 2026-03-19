import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { env } from "../config/env";
import { Status, UserRole } from "../../generated/prisma/enums";

export const auth = betterAuth({
    baseURL: env.BETTER_AUTH_URL,
    secret: env.BETTER_AUTH_SECRET,
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    emailAndPassword: {
        enabled: true,
        minPasswordLength: 6,
        autoSignIn: false,
        requireEmailVerification: true,
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: true,
                default: UserRole.USER,
            },
            status: {
                type: "string",
                required: false,
                default: Status.ACTIVE,
            },
        },
    },
    trustedOrigins: [
        "http://localhost:3000",
        "http://localhost:5000",
        "http://localhost:7000",
        env.BETTER_AUTH_URL!,
        env.FRONTEND_URL!,
    ],

    socialProviders: {
        github: {
            clientId: env.GITHUB_CLIENT_ID,
            clientSecret: env.GITHUB_CLIENT_SECRET,
        },
    },
});