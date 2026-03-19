import { Router } from "express";
import { PurchaseController } from "./purchase.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middlewares/validateRequest";
import { PurchaseValidation } from "./purchase.validation";

const router = Router();

router.post(
    "/create-payment-intent",
    checkAuth(UserRole.USER, UserRole.ADMIN),
    validateRequest(PurchaseValidation.createPaymentIntentValidationSchema),
    PurchaseController.createPaymentIntent
);

router.post(
    "/subscribe",
    checkAuth(UserRole.USER, UserRole.ADMIN),
    validateRequest(PurchaseValidation.createSubscriptionValidationSchema),
    PurchaseController.subscribeToPlan
);

export const PurchaseRoutes = router;
