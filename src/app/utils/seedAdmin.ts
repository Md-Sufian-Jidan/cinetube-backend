import { env } from "../config/env";
import { Status, UserRole } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";
import { auth } from "../lib/auth";
import AppError from "../errors/AppError";
import status from "http-status";

const seedAdmin = async () => {
    const adminData = {
        name: "Admin",
        email: env.ADMIN_EMAIL,
        password: env.ADMIN_PASSWORD,
        role: UserRole.ADMIN,
        status: Status.ACTIVE,
    };

    try {
        const existingAdmin = await prisma.user.findUnique({
            where: {
                email: adminData.email,
            },
        });

        if (existingAdmin) {
            console.log("⚠️ Admin already exists. Skipping...");
            return;
        }

        const result = await auth.api.signUpEmail({
            body: adminData
        });

        if (!result?.user?.id) {
            throw new AppError(status.INTERNAL_SERVER_ERROR, "Invalid response from auth signup");
        }

        await prisma.user.update({
            where: {
                id: result.user.id,
            },
            data: {
                emailVerified: true,
                status: Status.ACTIVE,
            },
        });

        console.log("✅ Admin created and verified successfully!");
    } catch (error: any) {
        console.error("❌ Error seeding admin:", {
            message: error?.message,
            stack: error?.stack,
        });

        console.log("🧹 Cleaning up partial data...");

        await prisma.user.deleteMany({
            where: {
                email: adminData.email,
            },
        });

        console.log("🧹 Cleanup completed.");
    }
};

seedAdmin();