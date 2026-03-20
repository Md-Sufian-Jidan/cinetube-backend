import { Router } from "express";
import { MediaRoutes } from "../modules/media/media.route";
import { ReviewRoutes } from "../modules/review/review.route";
import { WatchlistRoutes } from "../modules/watchlist/watchlist.route";
import { PurchaseRoutes } from "../modules/purchase/purchase.route";
import { AdminRoutes } from "../modules/admin/admin.route";

const router = Router();

const routes = [
    {
        path: "/media",
        route: MediaRoutes
    },
    {
        path: "/reviews",
        route: ReviewRoutes
    },
    {
        path: "/watchlist",
        route: WatchlistRoutes
    },
    {
        path: "/payment",
        route: PurchaseRoutes
    },
    {
        path: "/admin",
        route: AdminRoutes
    }
];

routes.forEach((route) => router.use(route.path, route.route));

export default router;