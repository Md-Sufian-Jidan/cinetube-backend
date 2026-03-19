import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { env } from "../config/env";
import { Status, UserRole } from "../../generated/prisma/enums";
import { sendEmail } from "../utils/email";

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
        sendResetPassword: async ({ user, url }) => {
            console.log(`Sending reset password email to ${user.email}`);
            console.log(`Reset password URL: ${url}`);
            // In production, use an email service like Resend or Nodemailer
        },
    },

    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: false,
        sendVerificationEmail: async ({ user, url }) => {
            await sendEmail({
                to: user.email,
                subject: "Verify Your Email - CineTube",
                templateName: "verificationEmail",
                templateData: {
                    user,
                    verificationURL: url,
                },
            });
        },
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

    advanced: {
        cookiePrefix: "cinetube",
        defaultCookieAttributes: {
            sameSite: "lax",
            secure: false,    // false in dev (HTTP), true in prod (HTTPS)
            httpOnly: true,
        }
    }
});