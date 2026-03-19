import { Router } from "express";
import { MediaController } from "./media.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middlewares/validateRequest";
import { MediaValidation } from "./media.validation";

const router = Router();

router.post(
    "/",
    checkAuth(UserRole.ADMIN),
    validateRequest(MediaValidation.createMediaValidationSchema),
    MediaController.createMedia
);

router.get(
    "/",
    MediaController.getAllMedia
);

router.get(
    "/:id",
    MediaController.getSingleMedia
);

router.patch(
    "/:id",
    checkAuth(UserRole.ADMIN),
    validateRequest(MediaValidation.updateMediaValidationSchema),
    MediaController.updateMedia
);

router.delete(
    "/:id",
    checkAuth(UserRole.ADMIN),
    MediaController.deleteMedia
);

export const MediaRoutes = router;