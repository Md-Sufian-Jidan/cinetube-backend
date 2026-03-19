import { NextFunction, Request, Response } from "express";
import { Status, UserRole } from "../../generated/prisma/enums";
import { auth } from "../lib/auth";
import AppError from "../errors/AppError";
import status from "http-status";

export const checkAuth = (...requiredRoles: UserRole[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const session = await auth.api.getSession({
                headers: req.headers as HeadersInit,
            });

            if (!session) {
                throw new AppError(status.UNAUTHORIZED, "You are not authorized!");
            }


            if (!session.user.emailVerified) {
                throw new AppError(
                    status.FORBIDDEN,
                    "Email verification required to access this resource. Please verfiy your email!",
                );
            }

            if (session.user.status === Status.INACTIVE || session.user.status === Status.BLOCKED) {
                throw new AppError(
                    status.FORBIDDEN,
                    "Your account is not active. Please contact the admin for assistance.",
                );
            }

            const user = session.user;

            req.user = {
                userId: user.id,
                email: user.email,
                role: user.role as UserRole,
            };

            if (requiredRoles.length > 0 && !requiredRoles.includes(req.user.role)) {
                throw new AppError(status.FORBIDDEN, "You are not allowed to access this resource!");
            }

            next();
        } catch (error: any) {
            next(error);
        }
    };
};
