import { env } from "../config/env"
import { Status, UserRole } from "../../generated/prisma/enums"
import { prisma } from "../lib/prisma";
import AppError from "../errors/AppError";
import status from "http-status";
import { auth } from "../lib/auth";

export const seedAdmin = async () => {
    try {
        const existingAdmin = await prisma.user.findUnique({
            where: {
                email: env.ADMIN_EMAIL
            }
        });

        if (existingAdmin) {
            console.log("Admin already exists. Skipping...");
            return;
        }

        const adminUser = await auth.api.signup({
            body: {
                email: env.ADMIN_EMAIL,
                password: env.ADMIN_PASSWORD,
                name: "Admin",
                role: UserRole.ADMIN,
            }
        });

        await prisma.$transaction(async (tx) => {
            await tx.user.update({
                where: { id: adminUser.user.id },
                data: { emailVerified: true }
            });
        });

        console.log("✅ Admin created successfully");
    } catch (error) {
        console.error("❌ Error seeding admin:", error);

        await prisma.user.deleteMany({
            where: {
                email: env.ADMIN_EMAIL
            }
        });
    }
};