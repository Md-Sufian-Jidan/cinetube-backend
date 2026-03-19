import { Router } from "express";
import { MediaRoutes } from "../modules/media/media.route";
import { ReviewRoutes } from "../modules/review/review.route";

const router = Router();

const routes = [
    {
        path: "/media",
        route: MediaRoutes
    },
    {
        path: "/reviews",
        route: ReviewRoutes
    }
];

routes.forEach((route) => router.use(route.path, route.route));

export default router;