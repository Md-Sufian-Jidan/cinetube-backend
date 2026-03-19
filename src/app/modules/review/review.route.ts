import { Router } from "express";
import { ReviewController } from "./review.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middlewares/validateRequest";
import { ReviewValidation } from "./review.validation";

const router = Router();

router.post(
    "/",
    checkAuth(UserRole.USER, UserRole.ADMIN),
    validateRequest(ReviewValidation.createReviewValidationSchema),
    ReviewController.createReview
);

router.get("/media/:mediaId", ReviewController.getMediaReviews);

router.patch(
    "/:id",
    checkAuth(UserRole.USER, UserRole.ADMIN),
    validateRequest(ReviewValidation.updateReviewValidationSchema),
    ReviewController.updateReview
);

router.delete(
    "/:id",
    checkAuth(UserRole.USER, UserRole.ADMIN),
    ReviewController.deleteReview
);

router.post(
    "/:id/like",
    checkAuth(UserRole.USER, UserRole.ADMIN),
    ReviewController.toggleLike
);

router.post(
    "/comment",
    checkAuth(UserRole.USER, UserRole.ADMIN),
    validateRequest(ReviewValidation.createCommentValidationSchema),
    ReviewController.createComment
);

export const ReviewRoutes = router;
