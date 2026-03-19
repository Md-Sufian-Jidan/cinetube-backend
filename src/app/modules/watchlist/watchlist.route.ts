import { Router } from "express";
import { WatchlistController } from "./watchlist.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middlewares/validateRequest";
import { WatchlistValidation } from "./watchlist.validation";

const router = Router();

router.post(
    "/",
    checkAuth(UserRole.USER, UserRole.ADMIN),
    validateRequest(WatchlistValidation.addToWatchlistValidationSchema),
    WatchlistController.addWatchlist
);

router.get(
    "/",
    checkAuth(UserRole.USER, UserRole.ADMIN),
    WatchlistController.getWatchlist
);

router.delete(
    "/:mediaId",
    checkAuth(UserRole.USER, UserRole.ADMIN),
    WatchlistController.removeWatchlist
);

export const WatchlistRoutes = router;
