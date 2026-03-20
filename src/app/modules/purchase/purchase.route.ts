import { Router } from "express";
import { PurchaseController } from "./purchase.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.post(
    "/create-checkout-session",
    checkAuth(UserRole.USER, UserRole.ADMIN),
    PurchaseController.createCheckoutSession
);

export const PurchaseRoutes = router;
