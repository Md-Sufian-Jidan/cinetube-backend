import { Router } from "express";
import { AdminController } from "./admin.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.get(
    "/dashboard-stats",
    checkAuth(UserRole.ADMIN),
    AdminController.getDashboardStats
);

router.get(
    "/pending-reviews",
    checkAuth(UserRole.ADMIN),
    AdminController.getPendingReviews
);

router.get(
    "/media-analytics",
    checkAuth(UserRole.ADMIN),
    AdminController.getMediaAnalytics
);

router.get(
    "/user-activity",
    checkAuth(UserRole.ADMIN),
    AdminController.getUserActivity
);

export const AdminRoutes = router;
