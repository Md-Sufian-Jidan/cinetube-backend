import { Router } from "express";
import { MediaRoutes } from "../modules/media/media.route";

const router = Router();

const routes = [
    {
        path: "/media",
        route: MediaRoutes
    }
];

routes.forEach((route) => router.use(route.path, route.route));

export default router;