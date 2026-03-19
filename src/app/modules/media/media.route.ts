import { Router } from "express";
import { MediaController } from "./media.controller";

const router = Router();

router.post("/", MediaController.createMedia);

export const MediaRoutes = router;